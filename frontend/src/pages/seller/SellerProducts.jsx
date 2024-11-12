import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance.js';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await axiosInstance.get('/products/seller-products');
        console.log(response.data);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching seller products:', error);
      }
    };

    fetchSellerProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Your Products</h1>

      {Array.isArray(products) && products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4">
              <div className="card mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: ${product.price}</p>
                  <p className="card-text">{product.description}</p>
                  <button className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
