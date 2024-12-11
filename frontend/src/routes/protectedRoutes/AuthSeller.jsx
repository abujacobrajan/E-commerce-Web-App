import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthSeller = ({ children }) => {
  const [isSeller, setIsSeller] = useState(false);
  const [sellerId, setSellerId] = useState(null);
  const navigate = useNavigate();

  const checkSeller = async () => {
    try {
      const response = await axiosInstance.get('/seller/check-seller');
      if (response.data.success) {
        setIsSeller(true);
        setSellerId(response.data.sellerId);
      }
    } catch (error) {
      setIsSeller(false);
      console.error(error);
      navigate('/seller-login');
    }
  };

  useEffect(() => {
    checkSeller();
  }, []);

  return isSeller ? React.cloneElement(children, { sellerId }) : null;
};

AuthSeller.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthSeller;
