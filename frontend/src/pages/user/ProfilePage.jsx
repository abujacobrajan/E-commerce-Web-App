import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      house: '',
      street: '',
      district: '',
      state: '',
    },
    profilePic: null,
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        const userData = response?.data?.data;

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            house: userData.address?.house || '',
            street: userData.address?.street || '',
            district: userData.address?.district || '',
            state: userData.address?.state || '',
            pin: userData.address?.pin || '',
          },
          profilePic: null,
        });

        setProfilePicPreview(userData.profilePic || null);
      } catch (error) {
        toast.error('Failed to fetch profile.');
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith('passwordData.')) {
      const passwordField = name.split('.')[1];
      setPasswordData((prev) => ({
        ...prev,
        [passwordField]: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePic: file }));
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', JSON.stringify(formData.address));

      if (
        passwordData.newPassword &&
        passwordData.newPassword === passwordData.confirmPassword
      ) {
        formDataToSend.append('password', passwordData.newPassword);
      }

      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }

      await axiosInstance.put('/user/update', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile.');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/user/logout');
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout.');
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete('/user/delete');
      toast.success('Account deleted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account.');
      console.error(error);
    }
  };

  const renderAddress = () => {
    const { house, street, district, state, pin } = formData.address;
    if (house || street || district || state || pin) {
      return `${house ? house : ''}${house && street ? ', ' : ''}${
        street ? street : ''
      }${(street || house) && district ? ', ' : ''}${district ? district : ''}${
        (district || street || house) && state ? ', ' : ''
      }${state ? state : ''}${
        (state || district || street || house) && pin ? ', ' : ''
      }${pin ? pin : ''}`;
    }
    return 'N/A';
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      <div className="row flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card p-4 shadow-sm">
            <h2>{isEditing ? 'Edit Profile' : 'Profile'}</h2>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3 d-flex align-items-center">
                  <div className="me-3">
                    {profilePicPreview ? (
                      <img
                        src={profilePicPreview}
                        alt="Profile Preview"
                        className="mt-3"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <img
                        src="/default-profile-pic.jpg"
                        alt="Default Profile"
                        className="mt-3"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    className="form-control"
                    name="profilePic"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address:</label>
                  <div className="ms-3">
                    {['house', 'street', 'district', 'state', 'pin'].map(
                      (field) => (
                        <div
                          key={field}
                          className="mb-2 d-flex align-items-center"
                        >
                          <label className="me-2" style={{ width: '80px' }}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            style={{ maxWidth: '600px' }}
                            name={`address.${field}`}
                            value={formData.address[field]}
                            onChange={handleInputChange}
                            placeholder={`Enter ${field}`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="passwordData.newPassword"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Leave empty if you don't want to change your password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="passwordData.confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Leave empty if you don't want to change your password"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-3"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <img
                  src={profilePicPreview || '/default-profile-pic.jpg'}
                  alt="Profile"
                  className="mb-3"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {renderAddress()}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-primary ms-3"
                  onClick={() => navigate('/user/orders')}
                >
                  Your Orders
                </button>

                <button className="btn btn-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
                <button
                  className="btn btn-danger ms-3"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`modal fade ${showDeleteModal ? 'show' : ''}`}
        tabIndex="-1"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
        aria-hidden={!showDeleteModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
