import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../config/axiosInstance.js';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(false);

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
      await axiosInstance.get('/user/check-user');
      setIsUserLoggedIn(true);
    } catch (error) {
      setIsUserLoggedIn(false);
    }
  };

  const checkSeller = async () => {
    try {
      await axiosInstance.get('/seller/check-seller');
      setIsSellerLoggedIn(true);
    } catch (error) {
      setIsSellerLoggedIn(false);
    }
  };

  const checkAuth = async () => {
    await checkUser();
    await checkSeller();
  };

  useEffect(() => {
    fetchProducts();
    checkAuth();
  }, []);

  if (loading) return <div className="text-center">Loading products...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="productList d-flex flex-wrap justify-content-center">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-item card m-3"
            style={{ width: '18rem' }}
          >
            <Link
              to={
                isSellerLoggedIn
                  ? `/seller/products/${product._id}`
                  : isUserLoggedIn
                  ? `/user/products/${product._id}`
                  : `/products/${product._id}`
              }
              className="product-link"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text fw-bold">Price: Rs.{product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
