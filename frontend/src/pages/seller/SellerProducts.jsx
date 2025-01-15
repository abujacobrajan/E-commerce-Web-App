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
                    <div className="col-md-6 mb-2">
                      <label htmlFor="name" className="form-label">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={editedProduct.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="brand" className="form-label">
                        Brand
                      </label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        className="form-control"
                        value={editedProduct.brand}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        value={editedProduct.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="category" className="form-label">
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        className="form-control"
                        value={editedProduct.category}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label htmlFor="countInStock" className="form-label">
                        Count In Stock
                      </label>
                      <input
                        type="number"
                        id="countInStock"
                        name="countInStock"
                        className="form-control"
                        value={editedProduct.countInStock}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={editedProduct.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
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
                ) : (
                  <div>
                    <h3>{product.name}</h3>
                    <p>Price: Rs.{product.price}</p>
                    <p>{product.description}</p>
                    <p>
                      <strong>Units Sold:</strong>
                      {product.unitsSold || 0}
                    </p>
                    <p>
                      <strong>In Stock: </strong>
                      {product.countInStock > 0
                        ? product.countInStock
                        : 'Out of Stock'}
                    </p>
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
