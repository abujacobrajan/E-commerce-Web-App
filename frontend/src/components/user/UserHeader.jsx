import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { TbShoppingBagHeart } from 'react-icons/tb';
import { axiosInstance } from '../../config/axiosInstance';

const UserHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance({
        method: 'POST',
        url: 'user/logout',
      });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="Header d-flex justify-content-between align-items-center p-3">
      <div className="Logo">
        <Link to="/user/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Zentromart</h2>
        </Link>
      </div>

      <div className="RightSideElements d-flex align-items-center">
        <Link
          to="/user/wishlist"
          className="me-3"
          style={{ fontSize: '1.5rem', color: 'white' }}
        >
          <TbShoppingBagHeart />
        </Link>

        <Link
          to="/user/cart"
          className="me-3"
          style={{ fontSize: '1.5rem', color: 'white' }}
        >
          <FiShoppingCart />
        </Link>

        <Link
          to="/user/profile"
          className="me-3"
          style={{ fontSize: '1.5rem', color: 'white' }}
        >
          <CgProfile />
        </Link>

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

export default UserHeader;
