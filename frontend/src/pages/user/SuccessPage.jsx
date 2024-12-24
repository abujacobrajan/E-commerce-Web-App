import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleBackToHome = () => {
    navigate('/user/');
  };

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      'session_id'
    );

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

    if (sessionId) {
      const checkPaymentStatus = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/payment/session-status?session_id=${sessionId}`
          );
          setPaymentStatus(response.data);
          setOrderDetails(response.data.orderDetails);

          if (response.data.success) {
            await clearCart();
          }
        } catch (error) {
          setError('Error checking payment status.');
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };

      checkPaymentStatus();
    } else {
      setError('Session ID not found.');
      setLoading(false);
    }
  }, []);

  const renderPaymentStatus = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p className="text-danger">{error}</p>;
    }

    if (paymentStatus?.success) {
      return (
        <>
          <h2 className="text-success">Your payment is successful!</h2>
          <h3>Order Details:</h3>
          <div className="order-details">
            {orderDetails?.products?.map((product, index) => (
              <div key={index} className="product">
                {product.image && (
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                <p>
                  <strong>Product:</strong> {product.name}
                </p>
                <p>
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                <p>
                  <strong>Price:</strong> ₹{product.price}
                </p>
                <p>
                  <strong>Total:</strong> ₹{product.price * product.quantity}
                </p>
              </div>
            ))}
            <hr />
            <h4>Total Amount: ₹{orderDetails?.totalAmount}</h4>
            <hr />
          </div>
          <button className="btn btn-primary mt-4" onClick={handleBackToHome}>
            Back to Home
          </button>
        </>
      );
    }

    return (
      <p className="text-danger">Payment not completed. Please try again.</p>
    );
  };

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: '100vh' }}
    >
      {renderPaymentStatus()}
    </div>
  );
};

export default SuccessPage;
