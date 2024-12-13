import express from 'express';
import {
  checkUser,
  userLogin,
  userLogout,
  userProfile,
  userSignup,
  updateUserProfile,
  deleteUserAccount,
  viewUserList,
} from '../../controllers/userControllers.js';
import { userAuth } from '../../middlewares/userAuth.js';
import { upload } from '../../middlewares/multer.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', userAuth, userLogout);

router.get('/profile', userAuth, userProfile);
router.put('/update', userAuth, upload.single('profilePic'), updateUserProfile);
router.delete('/delete', userAuth, deleteUserAccount);
// router.delete('/delete/:userId', userAuth, deleteUserAccount);
router.get('/userslist', userAuth, viewUserList);
router.get('/check-user', userAuth, checkUser);

export { router as userRoutes };
