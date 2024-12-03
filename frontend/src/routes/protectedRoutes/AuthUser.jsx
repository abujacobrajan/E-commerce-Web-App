import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthUser = ({ children }) => {
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  const checkUser = async () => {
    try {
      await axiosInstance({
        method: 'GET',
        url: 'user/check-user',
      });
      setIsUser(true);
    } catch (error) {
      setIsUser(false);
      console.log(error);
      navigate('/login');
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return isUser ? children : null;
};

AuthUser.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthUser;
