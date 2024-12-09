import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance.js';

const CartPage = () => {
  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState({});

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: '/cart',
      });

      setCartItems(response.data.data);
      setLoading(false);
      setCartData(response?.data?.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axiosInstance({
        method: 'PUT',
        url: `cart/update/`,
        data: { productId, quantity: newQuantity },
      });

      setCartItems((prevCart) => ({
        ...prevCart,
        products: prevCart.products.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));

      setCartData((prevCart) => ({
        ...prevCart,
        totalPrice: response.data.data.totalPrice,
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await axiosInstance({
        method: 'DELETE',
        url: `/cart/remove`,
        data: { productId },
      });

      setCartItems((prevCart) => ({
        ...prevCart,
        products: prevCart.products.filter(
          (item) => item.productId._id !== productId
        ),
      }));

      setCartData((prevCart) => ({
        ...prevCart,
        totalPrice: response.data.data.totalPrice,
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!cartItems || cartItems.products.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h3>This is your shopping cart.</h3>
      <div>
        <ul style={{ listStyleType: 'none', padding: 0 }} className="m-2">
          {cartItems.products.map((item) => (
            <li
              className="border border-info rounded shadow m-3 p-3 mb-5 bg-body rounded"
              key={item.productId._id}
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                width={100}
              />
              <h3>{item.productId.name}</h3>
              <p>Price: Rs.{item.productId.price}</p>

              <p>
                Quantity :
                <button
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity - 1)
                  }
                >
                  -
                </button>{' '}
                {item.quantity}{' '}
                <button
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </p>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeItem(item.productId._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-danger rounded shadow m-3 p-3 mb-5 bg-body rounded">
        <h4>Price Summary:</h4>
        <p>Total Price: Rs.{cartData?.totalPrice}</p>
        <button
          type="button"
          className="btn btn-warning btn-rounded"
          data-mdb-ripple-init
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default CartPage;
