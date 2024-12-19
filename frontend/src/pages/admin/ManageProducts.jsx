import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/productlists');
      if (response.data.success && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingProductId(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      try {
        const response = await axiosInstance.delete(`/products/delete/${id}`);
        if (response.data.success) {
          alert('Product deleted successfully.');
        } else {
          fetchProducts();
          alert('Failed to delete the product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        fetchProducts();
        alert('An error occurred while deleting the product.');
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: '100vh' }}>
      <button className="btn btn-info mb-3" onClick={() => navigate('/admin')}>
        Back to Admin Page
      </button>

      <h2>All Products</h2>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(product._id)}
                    disabled={deletingProductId === product._id}
                  >
                    {deletingProductId === product._id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
