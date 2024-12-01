import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../../controllers/wishlistControllers.js';
import { userAuth } from '../../middlewares/userAuth.js';

const router = express.Router();

router.post('/add', userAuth, addToWishlist);
router.get('/', userAuth, getWishlist);
router.delete('/remove/:productId', userAuth, removeFromWishlist);

export { router as wishlistRoutes };
