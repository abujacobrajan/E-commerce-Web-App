import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { axiosInstance } from '../../config/axiosInstance';

const SellerHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance({
        method: 'POST',
        url: 'seller/logout',
      });
      navigate('/'); // Redirect to home or seller login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="Header d-flex justify-content-between align-items-center p-3">
      {/* Logo Section */}
      <div className="Logo">
        <Link
          to="/seller/"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <h2>Zentromart</h2>
        </Link>
      </div>

      {/* Right-side Elements */}
      <div className="RightSideElements d-flex align-items-center">
        {/* Profile Icon (White Color) */}
        <Link
          to="/seller/profile"
          className="me-3"
          style={{ fontSize: '1.5rem', color: 'white' }}
        >
          <CgProfile />
        </Link>

        {/* Your Products Button */}
        <Link to="/seller/products">
          <button type="button" className="btn btn-outline-light me-2">
            Your Products
          </button>
        </Link>

        {/* Add Product Button */}
        <Link to="/seller/create-product">
          <button type="button" className="btn btn-outline-light me-2">
            Add Product
          </button>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SellerHeader;
