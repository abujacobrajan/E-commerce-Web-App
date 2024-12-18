import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance.js';
import toast from 'react-hot-toast';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await axiosInstance.get('/products/seller-products');
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching seller products:', error);
      }
    };

    fetchSellerProducts();
  }, []);

  const deleteFromProductsList = async (productId) => {
    try {
      await axiosInstance.delete(`/products/delete/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditProductId(product._id);
    setEditedProduct({ ...product });
    setImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append('name', editedProduct.name);
    formData.append('price', editedProduct.price);
    formData.append('description', editedProduct.description);
    formData.append('brand', editedProduct.brand);
    formData.append('category', editedProduct.category);
    formData.append('countInStock', editedProduct.countInStock);

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axiosInstance.put(
        `/products/update/${editProductId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const updatedProduct = response.data.data;

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editProductId ? updatedProduct : product
        )
      );

      toast.success('Product updated successfully!');
      setEditProductId(null);
      setImage(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product.');
    }
  };

  const cancelEdit = () => {
    setEditProductId(null);
    setEditedProduct({});
    setImage(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h3>Your Products</h3>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div
              key={product._id}
              className={`col-12 ${
                editProductId === product._id ? 'col-md-12' : 'col-md-3'
              } mb-4`}
            >
              <div
                className={`border border-info rounded shadow p-3 bg-body`}
                style={{ width: '100%' }}
              >
                <div className="image-container text-center">
                  <img
                    src={
                      editProductId === product._id && image
                        ? URL.createObjectURL(image)
                        : product.image
                    }
                    alt={product.name}
                    style={{
                      width: editProductId === product._id ? '20%' : '100%',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                  />
                  {editProductId === product._id && (
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="form-control"
                      />
                    </div>
                  )}
                </div>
                {editProductId === product._id ? (
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="row mb-2">
                        <label className="col-sm-3 col-form-label">
                          Product Name:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            name="name"
                            value={editedProduct.name}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-3 col-form-label">
                          Brand:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            name="brand"
                            value={editedProduct.brand}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-3 col-form-label">
                          Price:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-3 col-form-label">
                          Category:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            name="category"
                            value={editedProduct.category}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-3 col-form-label">
                          Count In Stock:
                        </label>
                        <div className="col-sm-9">
                          <input
                            type="number"
                            name="countInStock"
                            value={editedProduct.countInStock}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-sm-3 col-form-label">
                          Description:
                        </label>
                        <div className="col-sm-9">
                          <textarea
                            name="description"
                            value={editedProduct.description}
                            onChange={handleInputChange}
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-success me-2"
                          onClick={saveChanges}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3>{product.name}</h3>
                    <p>Price: Rs.{product.price}</p>
                    <p>{product.description}</p>
                    <button
                      type="button"
                      className="btn btn-outline-danger me-2"
                      onClick={() => deleteFromProductsList(product._id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleEdit(product)}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
