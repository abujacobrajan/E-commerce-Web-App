import express from 'express';
import { userAuth } from '../../middlewares/userAuth.js';
import Stripe from 'stripe';
import { Order } from '../../models/orderModel.js';
import mongoose from 'mongoose';

const router = express.Router();
const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
const client_domain = process.env.CLIENT_DOMAIN;

router.post('/create-checkout-session', userAuth, async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const lineItems = products.map((product) => {
      if (!product.name || !product.price || !product.quantity) {
        throw new Error('Invalid product data');
      }

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${client_domain}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${client_domain}/user/payment/cancel`,
    });

    const order = new Order({
      userId: req.user.id,
      sessionId: session.id,
      products: products.map((product) => ({
        productId: product.productId,
        image: product.image,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ),
    });

    await order.save();
    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

router.get('/session-status', userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { session_id } = req.query;

    const orderDetails = await Order.findOne({ userId, sessionId: session_id });

    if (!orderDetails) {
      return res.status(400).json({ message: 'Order not found' });
    }
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session?.payment_status === 'paid') {
      await Order.findOneAndUpdate(
        { sessionId: session_id },
        {
          paymentStatus: 'Completed',
          customerEmail: session.customer_details.email,
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Payment completed successfully',
        sessionDetails: session,
        orderDetails: orderDetails,
      });
    } else {
      res.json({
        success: false,
        message: 'Payment not completed',
        sessionDetails: session,
      });
    }
  } catch (error) {
    console.error('Error retrieving session status:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

router.get('/has-purchased/:productId', userAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      userId,
      products: { $elemMatch: { productId } },
      paymentStatus: 'Completed',
    });

    const hasPurchased = !!order;

    res.json({ success: true, hasPurchased });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/orders', userAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate('products.productId')
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as paymentRoutes };
