import express from 'express';
import { userAuth } from '../../middlewares/userAuth.js';
import Stripe from 'stripe';
import { Order } from '../../models/orderModel.js';
import { Product } from '../../models/productModel.js';
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

    const lineItems = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await Product.findById(product.productId);
        if (!dbProduct || dbProduct.countInStock < product.quantity) {
          throw new Error(`Product ${product.name} has insufficient stock.`);
        }
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: dbProduct.name,
              images: dbProduct.image ? [dbProduct.image] : [],
            },
            unit_amount: Math.round(dbProduct.price * 100),
          },
          quantity: product.quantity,
        };
      })
    );

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
        name: product.name,
        image: product.image,
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
    console.error('Error creating checkout session:', error.message);
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
      const updatedOrder = await Order.findOneAndUpdate(
        { sessionId: session_id },
        {
          paymentStatus: 'Completed',
          customerEmail: session.customer_details.email,
        },
        { new: true }
      );

      const updateStockPromises = updatedOrder.products.map(async (product) => {
        const dbProduct = await Product.findById(product.productId);
        if (dbProduct) {
          if (dbProduct.countInStock >= product.quantity) {
            dbProduct.countInStock -= product.quantity;
            dbProduct.unitsSold += product.quantity;
            await dbProduct.save();
          } else {
            console.warn(
              `Product ID: ${product.productId} has insufficient stock.`
            );
          }
        }
      });

      await Promise.all(updateStockPromises);

      res.json({
        success: true,
        message: 'Payment completed successfully and stock updated.',
        sessionDetails: session,
        orderDetails: updatedOrder,
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
