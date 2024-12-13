import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import { Outlet } from 'react-router-dom';
import { axiosInstance } from '../config/axiosInstance.js';
import SellerHeader from '../components/seller/SellerHeader.jsx';

const AdminLayout = () => {
  const [admin, setAdmin] = useState(null);

  const fetchAdminProfile = async () => {
    try {
      const response = await axiosInstance.get('admin/profile');
      setAdmin(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <div className="d-flex flex-column h-100" style={{ minHeight: '100vh' }}>
      <SellerHeader admin={admin} />
      <main className="container flex-fill py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
