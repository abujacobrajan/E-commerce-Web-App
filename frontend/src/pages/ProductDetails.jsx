import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const addToCart = async () => {
    try {
      await axiosInstance.post('/cart/add-to-cart', { productId: product._id });
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Product could not be added to cart');
    }
  };

  const addToWishlist = async () => {
    try {
      await axiosInstance.post('/wishlist/add', { productId: product._id });
      toast.success('Product added to wishlist');
    } catch (error) {
      toast.error('Failed to add product to wishlist');
    }
  };

  const handleAddReview = async () => {
    try {
      const { rating, comment } = newReview;
      await axiosInstance.post('/reviews/add', {
        productId: product._id,
        rating,
        comment,
      });
      toast.success('Review added successfully');
      setNewReview({ rating: '', comment: '' });
      setShowAddReviewForm(false);

      const updatedProduct = await axiosInstance.get(`/products/${productId}`);
      setProduct(updatedProduct.data.data);
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };

  return (
    <div className="container mt-4">
      {product ? (
        <div className="row">
          {/* Left Section: Image */}
          <div className="col-md-4">
            <img
              src={product?.image}
              alt={product?.name}
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Right Section: Product Details and Reviews */}
          <div className="col-md-8">
            <h1>{product?.name}</h1>
            <p>
              <strong>Price:</strong> Rs.{product?.price}
            </p>
            <p>
              <strong>Brand:</strong> {product?.brand}
            </p>
            <p>
              <strong>Description:</strong> {product?.description}
            </p>
            <p>
              <strong>In Stock:</strong> {product?.countInStock}
            </p>
            <p>
              <strong>Rating:</strong>{' '}
              {product?.reviews && product.reviews.length > 0
                ? (
                    product.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / product.reviews.length
                  ).toFixed(1)
                : 'No ratings yet'}
            </p>
            <p>
              <strong>Seller:</strong>{' '}
              {product?.seller?.name || 'Unknown Seller'}
            </p>
            <button onClick={addToCart} className="btn btn-warning me-2">
              Add to cart
            </button>
            <button onClick={addToWishlist} className="btn btn-warning">
              Add to wishlist
            </button>
            <button
              className="btn btn-primary mt-3 d-block"
              onClick={() => setShowAddReviewForm(true)}
            >
              Add Review
            </button>

            {/* Reviews Section */}
            <div className="mt-4">
              <h3>Reviews</h3>
              <ul className="list-unstyled">
                {product?.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <li key={review._id} className="border rounded p-2 mb-2">
                      <p>
                        <strong>User:</strong>{' '}
                        {review?.user?.name || 'Anonymous'}
                      </p>
                      <p>
                        <strong>Comment:</strong> {review.comment}
                      </p>
                      <p>
                        <strong>Rating:</strong> {review.rating} / 5
                      </p>
                    </li>
                  ))
                ) : (
                  <p>No reviews available</p>
                )}
              </ul>

              {/* Add Review Form */}
              {showAddReviewForm && (
                <div className="mt-3 p-3 border rounded">
                  <h3>Add Your Review</h3>
                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      id="rating"
                      className="form-control"
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview({ ...newReview, rating: e.target.value })
                      }
                      min="1"
                      max="5"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      className="form-control"
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <button className="btn btn-success" onClick={handleAddReview}>
                    Submit Review
                  </button>
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => setShowAddReviewForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Product not found</div>
      )}
    </div>
  );
};

export default ProductDetails;
