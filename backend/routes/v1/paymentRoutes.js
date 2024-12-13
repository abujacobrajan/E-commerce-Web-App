import express from 'express';
import { userAuth } from '../../middlewares/userAuth.js';
import Stripe from 'stripe';
import { Order } from '../../models/orderModel.js';

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
      success_url: `${client_domain}/user/payment/success`,
      cancel_url: `${client_domain}/user/payment/cancel`,
    });

    const order = new Order({
      userId: req.user.id,
      sessionId: session.id,
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
    const orderDetails = await Order.findOne({ userId });
    const sessionId = orderDetails.sessionId;
    // const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // res.send({
    //   status: session?.status,
    //   customer_email: session?.customer_details?.email,
    // });

    res.json({
      message: 'Succesfully fetched order details',
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error retrieving session status:', error);
    res.status(error?.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
});

export { router as paymentRoutes };
