import React, { useEffect } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/user/');
  };
  useEffect(() => {
    const clearCart = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (sessionId) {
        try {
          console.log('Payment successful, session ID:', sessionId);

          await axiosInstance({
            method: 'POST',
            url: '/cart/clear',
          });
        } catch (error) {
          console.error('Error clearing the cart:', error);
        }
      }
    };

    clearCart();
  }, []);

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: '100vh' }}
    >
      <h2 className="text-success">Your payment is successful!</h2>
      <button className="btn btn-primary mt-4" onClick={handleBackToHome}>
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;
