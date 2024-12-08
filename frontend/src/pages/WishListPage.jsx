import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';

const WishListPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get('/wishlist');
        setWishlist(response.data.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/remove/${productId}`);
      setWishlist(wishlist.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axiosInstance({
        url: '/cart/add-to-cart',
        method: 'POST',
        data: { productId },
      });
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Product could not be added to cart');
    }
  };

  if (loading) {
    return <div>Loading your wishlist...</div>;
  }

  if (wishlist.length === 0) {
    return <div>Your wishlist is empty.</div>;
  }

  return (
    <div className="min-vh-100">
      <h2>Your Wishlist</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {wishlist.map((product) => (
          <li
            key={product._id}
            className="border rounded p-2 mb-2 d-flex align-items-center"
          >
            <img src={product.image} alt={product.name} width={100} />
            <div className="ms-3">
              <h4>{product.name}</h4>
              <p>Price: Rs.{product.price}</p>
            </div>
            <button
              className="btn btn-warning ms-3"
              onClick={() => addToCart(product._id)}
            >
              Add to cart
            </button>
            <button
              className="btn btn-danger ms-3"
              onClick={() => removeFromWishlist(product._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishListPage;
