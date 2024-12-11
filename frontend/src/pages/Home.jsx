import React, { useState, useEffect } from 'react';
import './Home.css';
import { axiosInstance } from '../config/axiosInstance.js';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/productlists');
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      const response = await axiosInstance.get('/user/check-user');
      setIsUserLoggedIn(true);
    } catch (error) {
      console.error('Error checking user:', error);
      setIsUserLoggedIn(false);
    }
  };

  const checkSeller = async () => {
    try {
      const response = await axiosInstance.get('/seller/check-seller');
      setIsSellerLoggedIn(true);
    } catch (error) {
      console.error('Error checking seller:', error);
      setIsSellerLoggedIn(false);
    }
  };

  const checkAuth = async () => {
    if (!isUserLoggedIn) await checkUser();
    if (!isSellerLoggedIn) await checkSeller();
  };

  useEffect(() => {
    fetchProducts();
    checkAuth();
  }, []);

  const handleProductClick = (productId) => {
    if (isSellerLoggedIn) {
      navigate(`/seller/products/${productId}`);
    } else if (isUserLoggedIn) {
      navigate(`/user/products/${productId}`);
    } else {
      navigate(`/products/${productId}`);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="productList d-inline-flex flex-wrap">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-item"
            onClick={() => handleProductClick(product._id)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '200px', height: '200px' }}
            />
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <p>Price: Rs.{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
