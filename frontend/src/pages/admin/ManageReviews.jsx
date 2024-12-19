import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get('/reviews/all-reviews');
      console.log('API response:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        setReviews(response.data.data);
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== id)
      );

      try {
        const response = await axiosInstance.delete(`/reviews/delete/${id}`);
        if (response.data.success) {
          alert('Review deleted successfully.');
        } else {
          fetchReviews();
          alert('Failed to delete the review. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        fetchReviews();
        alert('An error occurred while deleting the review.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: '100vh' }}>
      <button className="btn btn-info mb-3" onClick={() => navigate('/admin')}>
        Back to Admins Page
      </button>

      <h2>All Reviews</h2>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review._id}>
                <td>{review._id}</td>
                <td>
                  {review.product ? review.product.name : 'Unknown Product'}
                </td>
                <td>{review.user ? review.user.name : 'Unknown User'}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No reviews found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReviews;
