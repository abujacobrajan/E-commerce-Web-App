import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: { type: String },
        image: { type: String },
        quantity: {
          type: Number,
          min: 1,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'UPI', 'Net Banking', 'Wallet'],
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    address: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
