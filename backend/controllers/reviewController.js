import { Review } from '../models/reviewModel.js';
import { Product } from '../models/productModel.js';
import { User } from '../models/userModel.js';

const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    await newReview.save();

    product.reviews.push(newReview._id);
    product.numReviews = product.reviews.length;
    product.rating =
      (product.rating * (product.numReviews - 1) + rating) / product.numReviews;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: newReview,
    });
  } catch (error) {
    console.error('Error in addReview:', error);
    next(error);
  }
};

const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: productId }).populate(
      'user',
      'name'
    );

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error in getReviewsByProduct:', error);
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment, product: productId, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview,
    });
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    console.error('Error in updateReview:', error);
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const product = await Product.findById(deletedReview.product);
    if (product) {
      product.reviews.pull(reviewId);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.numReviews || 0;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    next(error);
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId });

    if (!reviews.length) {
      return res
        .status(404)
        .json({ message: 'No reviews found for this product' });
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name');

    if (!reviews.length) {
      return res
        .status(404)
        .json({ success: false, message: 'No reviews found' });
    }

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    next(error);
  }
};

export {
  addReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  getAverageRating,
  getAllReviews,
};
