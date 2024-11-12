import express from 'express';
import {
  adminSignup,
  adminLogin,
  adminLogout,
  adminProfile,
  checkAdmin,
  deleteAdminAccount,
  updateAdminProfile,
  viewAdminList,
} from '../../controllers/adminControllers.js';
import { adminAuth } from '../../middlewares/adminAuth.js';

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/profile', adminAuth, adminProfile);
router.put('/update', adminAuth, updateAdminProfile);
router.delete('/delete', adminAuth, deleteAdminAccount);
router.get('/adminlist', adminAuth, viewAdminList);
router.get('/check-admin', adminAuth, checkAdmin);

export { router as adminRoutes };
