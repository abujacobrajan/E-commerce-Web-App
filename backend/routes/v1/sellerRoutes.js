import express from 'express';
import {
  sellerSignup,
  sellerLogin,
  sellerLogout,
  sellerProfile,
  updateSellerProfile,
  deleteSellerAccount,
  viewSellerList,
  checkSeller,
} from '../../controllers/sellerControllers.js';
import { sellerAuth } from '../../middlewares/sellerAuth.js';

const router = express.Router();

router.post('/signup', sellerSignup);
router.post('/login', sellerLogin);
router.post('/logout', sellerLogout);

router.get('/profile', sellerAuth, sellerProfile);
router.put('/update', sellerAuth, updateSellerProfile);
router.delete('/delete', sellerAuth, deleteSellerAccount);
router.get('/list', sellerAuth, viewSellerList);
router.get('/check-seller', sellerAuth, checkSeller);

export { router as sellerRoutes };
