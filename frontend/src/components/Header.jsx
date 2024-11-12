import React from 'react';
import './Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="Header d-flex flex-row justify-content-between align-items-center">
      <div className="Logo p-2">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Zentromart</h2>
        </Link>
      </div>
      <div className="RightSideElements d-flex">
        <div className="LoginButton p-2 text-white">
          <Link
            to="/login"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Login
          </Link>
        </div>
        <div className="SignupButton p-2 text-white">
          <Link
            to="/signup"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
