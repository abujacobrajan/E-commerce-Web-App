import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import { Outlet } from 'react-router-dom';
import SellerHeader from '../components/seller/SellerHeader.jsx';
import { axiosInstance } from '../config/axiosInstance.js';

const SellerLayout = () => {
  const [seller, setSeller] = useState(null);

  const fetchSellerProfile = async () => {
    try {
      const response = await axiosInstance.get('seller/profile');
      setSeller(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <SellerHeader seller={seller} />
      <div className="flex-fill">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default SellerLayout;
