import express from 'express';
import {
  addReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  getAverageRating,
} from '../../controllers/reviewController.js';
import { userAuth } from '../../middlewares/userAuth.js';

const router = express.Router();
router.post('/add', userAuth, addReview);
router.get('/:productId/reviews', getReviewsByProduct);
router.put('/update/:reviewId', userAuth, updateReview);
router.delete('/delete/:reviewId', userAuth, deleteReview);
router.get('/:productId/average-rating', getAverageRating);

export { router as reviewRoutes };