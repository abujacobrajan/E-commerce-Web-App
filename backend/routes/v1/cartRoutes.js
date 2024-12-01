import express from 'express';

const router = express.Router();
import { userAuth } from '../../middlewares/userAuth.js';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateProductQuantityInCart,
  clearCart,
} from '../../controllers/cartControllers.js';

router.post('/add-to-cart', userAuth, addToCart);
router.delete('/remove', userAuth, removeFromCart);
router.put('/update', userAuth, updateProductQuantityInCart);
router.post('/clear', userAuth, clearCart);
// router.get('/get', userAuth, getCart);
router.get('/', userAuth, getCart);

export { router as cartRoutes };
