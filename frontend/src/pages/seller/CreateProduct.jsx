import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axiosInstance.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
    rating: '',
    numReviews: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const sellerId = localStorage.getItem('sellerId');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerId = localStorage.getItem('sellerId');

    if (!sellerId) {
      toast.error('Seller is not authenticated');
      console.log('Seller is not authenticated');
      return;
    }

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    formDataToSend.append('seller', sellerId);
    console.log('FormData being sent:', formDataToSend);

    try {
      const response = await axiosInstance.post(
        '/products/create',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error);
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            className="form-control"
            name="brand"
            onChange={handleChange}
            value={formData.brand}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            onChange={handleChange}
            value={formData.category}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            onChange={handleChange}
            value={formData.price}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Count In Stock</label>
          <input
            type="number"
            className="form-control"
            name="countInStock"
            onChange={handleChange}
            value={formData.countInStock}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleImageChange}
            required
          />
        </div>

        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Product Preview"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
