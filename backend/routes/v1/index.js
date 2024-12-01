import express from 'express';
import { userRoutes } from './userRoutes.js';
import { productRoutes } from './productRoutes.js';
import { adminRoutes } from './adminRoutes.js';
import { reviewRoutes } from './reviewRoutes.js';
import { sellerRoutes } from './sellerRoutes.js';
import { cartRoutes } from './cartRoutes.js';
import { wishlistRoutes } from './wishlistRoutes.js';
const v1Router = express.Router();

v1Router.use('/user', userRoutes);
v1Router.use('/products', productRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/seller', sellerRoutes);
v1Router.use('/reviews', reviewRoutes);
v1Router.use('/cart', cartRoutes);
v1Router.use('/wishlist', wishlistRoutes);

export default v1Router;
