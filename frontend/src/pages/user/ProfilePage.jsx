import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: 'user/profile',
      });
      setUser(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: 'user/logout',
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <div className=" min-vh-100">
      <img src={user?.profilePic} alt="" className="m-3"></img>
      <h1 className="m-3">{user?.name}</h1>
      <h1 className="m-3">{user?.email}</h1>
      <button type="button" className="btn btn-primary m-3">
        Update
      </button>
      <button onClick={handleLogout} type="button" className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
