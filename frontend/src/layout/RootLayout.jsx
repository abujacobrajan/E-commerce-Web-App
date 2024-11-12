import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-fill">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
