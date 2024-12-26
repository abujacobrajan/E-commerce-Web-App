import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axiosInstance.get('/payment/orders');
        const fetchedOrders = response?.data?.orders || [];
        setOrders(fetchedOrders);
      } catch (error) {
        if (error.response?.status === 404) {
          setOrders([]);
        } else {
          toast.error('Failed to fetch orders.');
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="container m-4 p-4">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li
              key={order._id}
              className="list-group-item mb-3 border border-primary border-1"
            >
              <div>
                <strong>Order ID:</strong> {order._id}
              </div>
              <div>
                <strong>Status:</strong> {order.paymentStatus}
              </div>

              <div>
                <h5>Items:</h5>
                <ul className="list-group">
                  {order.products.map((product, index) => (
                    <li key={index} className="list-group-item">
                      <div className="row">
                        <div className="col-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100px', height: 'auto' }}
                          />
                        </div>
                        <div className="col-6">
                          <strong>{product.name}</strong>
                          <div>Quantity: {product.quantity}</div>
                          <div>Price: ₹{product.price}</div>
                          <div>Total: ₹{product.quantity * product.price}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </div>
              <div>
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
