import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthSeller = ({ children }) => {
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const checkSeller = async () => {
    try {
      await axiosInstance({
        method: 'GET',
        url: 'seller/check-seller',
      });
      setIsSeller(true);
    } catch (error) {
      setIsSeller(false);
      console.log(error);
      navigate('/seller-login');
    }
  };

  useEffect(() => {
    checkSeller();
  }, []);

  return isSeller ? children : null;
};

AuthSeller.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthSeller;
