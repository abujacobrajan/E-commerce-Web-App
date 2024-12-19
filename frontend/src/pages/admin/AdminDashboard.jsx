import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <div className="container text-center" style={{ minHeight: '100vh' }}>
      <h1>Welcome Admin</h1>
      <div className="mt-4">
        <Link to="manage-users" className="btn btn-primary m-2">
          View All Users
        </Link>
        <Link to="manage-sellers" className="btn btn-primary m-2">
          View All Sellers
        </Link>
        <Link to="manage-products" className="btn btn-primary m-2">
          View All Products
        </Link>
        <Link to="manage-reviews" className="btn btn-primary m-2">
          View All Reviews
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
