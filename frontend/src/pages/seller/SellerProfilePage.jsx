import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SellerProfilePage = () => {
  const [seller, setSeller] = useState({});
  const navigate = useNavigate();

  const fetchSellerProfile = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: 'seller/profile',
      });
      setSeller(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance({
        method: 'POST',
        url: 'seller/logout',
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  return (
    <div className="min-vh-100">
      <img src={seller?.profilePic} alt="Profile Picture" className="m-3"></img>
      <h1 className="m-3">{seller?.name}</h1>
      <h2 className="m-3">{seller?.email}</h2>
      <button type="button" className="btn btn-primary m-3">
        Update
      </button>
      <button
        onClick={handleLogout}
        type="button"
        className="btn btn-danger m-3"
      >
        Logout
      </button>
    </div>
  );
};

export default SellerProfilePage;
