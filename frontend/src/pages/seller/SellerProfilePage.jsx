import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';

const SellerProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      building: '',
      street: '',
      district: '',
      state: '',
      pin: '',
    },
    profilePic: null,
    businessName: '',
    status: 'active',
    role: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const response = await axiosInstance.get('/seller/profile');
        const sellerData = response?.data?.data;

        setFormData({
          name: sellerData.name || '',
          email: sellerData.email || '',
          phone: sellerData.phone || '',
          address: sellerData.address || {
            building: '',
            street: '',
            district: '',
            state: '',
            pin: '',
          },
          profilePic: null,
          businessName: sellerData.businessName || '',
          status: sellerData.status || 'active',
          role: sellerData.role || '',
        });

        setProfilePicPreview(sellerData.profilePic || null);
      } catch (error) {
        toast.error('Failed to fetch profile.');
        console.error(error);
      }
    };

    fetchSellerProfile();
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
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('status', formData.status);

      if (
        passwordData.newPassword &&
        passwordData.newPassword === passwordData.confirmPassword
      ) {
        formDataToSend.append('password', passwordData.newPassword);
      }

      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }

      await axiosInstance.put('/seller/update', formDataToSend, {
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
      await axiosInstance.post('/seller/logout');
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout.');
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete('/seller/delete');
      toast.success('Account deleted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete account.');
      console.error(error);
    }
  };

  const renderAddress = () => {
    const { building, street, district, state, pin } = formData.address;
    return (
      `${building || ''}${street ? ', ' + street : ''}${
        district ? ', ' + district : ''
      }${state ? ', ' + state : ''}${pin ? ', ' + pin : ''}` || 'N/A'
    );
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
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
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
                  <label className="form-label">Address</label>
                  {['building', 'street', 'district', 'state', 'pin'].map(
                    (field) => (
                      <input
                        key={field}
                        type="text"
                        className="form-control mb-2"
                        name={`address.${field}`}
                        value={formData.address[field]}
                        onChange={handleInputChange}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                      />
                    )
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  <strong>Business Name:</strong> {formData.businessName}
                </p>
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
                <p>
                  <strong>Status:</strong> {formData.status}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button className="btn btn-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
                <button
                  className="btn btn-danger ms-3"
                  onClick={() => setIsModalOpen(true)}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`modal fade ${isModalOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ display: isModalOpen ? 'block' : 'none' }}
        aria-labelledby="deleteAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteAccountModalLabel">
                Confirm Account Deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <div className="modal-body">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
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

export default SellerProfilePage;
