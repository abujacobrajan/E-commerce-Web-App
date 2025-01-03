import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/userslist');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeletingUserId(userId);
      try {
        const response = await axiosInstance.delete(
          `/user/delete-user-by-admin/${userId}`
        );
        if (response.data.success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          alert('User deleted successfully.');
        } else {
          alert('Failed to delete the user. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: '100vh' }}>
      <button className="btn btn-info mb-3" onClick={() => navigate('/admin')}>
        Back to Admin Page
      </button>

      <h2>All Users</h2>
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
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={deletingUserId === user._id}
                  >
                    {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
