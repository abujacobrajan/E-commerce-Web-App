import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthAdmin = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  const checkAdmin = async () => {
    try {
      const response = await axiosInstance.get('/admin/check-admin');
      if (response.data.success) {
        setIsAdmin(true);
        setAdminId(response.data.adminId);
      }
    } catch (error) {
      setIsAdmin(false);
      console.error(error);
      navigate('/seller-login');
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  return isAdmin ? React.cloneElement(children, { adminId }) : null;
};

AuthAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthAdmin;
