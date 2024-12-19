import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get('/seller/list');
      console.log('API response:', response.data);
      if (Array.isArray(response.data)) {
        const filteredSellers = response.data.filter(
          (user) => user.role !== 'admin'
        );
        setSellers(filteredSellers);
      } else if (response.data.sellers) {
        const filteredSellers = response.data.sellers.filter(
          (user) => user.role !== 'admin'
        );
        setSellers(filteredSellers);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      setSellers((prevSellers) =>
        prevSellers.filter((seller) => seller._id !== sellerId)
      );

      try {
        const response = await axiosInstance.delete(
          `/seller/delete-seller-by-admin/${sellerId}`
        );
        if (response.data.success) {
          alert('Seller deleted successfully.');
        } else {
          fetchSellers();
          alert('Failed to delete the seller. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting seller:', error);
        fetchSellers();
        alert('An error occurred while deleting the seller.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: '100vh' }}>
      <button className="btn btn-info mb-3" onClick={() => navigate('/admin')}>
        Back to Admins Page
      </button>

      <h2>All Sellers</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sellers) && sellers.length > 0 ? (
            sellers.map((seller) => (
              <tr key={seller._id}>
                <td>{seller._id}</td>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteSeller(seller._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No sellers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSellers;
