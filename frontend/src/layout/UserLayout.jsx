import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx';
import { Outlet } from 'react-router-dom';
import UserHeader from '../components/user/UserHeader.jsx';
import { axiosInstance } from '../config/axiosInstance.js';

const UserLayout = () => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('user/profile');
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <UserHeader user={user} />
      <div className="flex-fill">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
