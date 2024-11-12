import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const addToCart = async () => {
    try {
      const response = await axiosInstance({
        url: '/cart/add-to-cart',
        method: 'POST',
        data: { productId: product._id },
      });
      console.log(response);
      toast.success('Product added to cart');
    } catch (error) {
      console.log(error);
      toast.error('Product could not add to cart');
    }
  };

  return (
    <div>
      {product ? (
        <div className="p-2 ">
          <h1>{product?.name}</h1>
          <img
            src={product?.image}
            alt={product?.name}
            style={{ width: '300px', height: '300px' }}
          />
          <p>
            <strong>Price:</strong> Rs.{product?.price}
          </p>
          <p>
            <strong>Brand:</strong> {product?.brand}
          </p>
          <p>
            <strong>Description:</strong> {product?.description}
          </p>

          <p>
            <strong>In Stock:</strong> {product?.countInStock}
          </p>
          <p>
            <strong>Rating:</strong> {product?.rating} / 5
          </p>
          <button onClick={addToCart} className="btn btn-warning">
            Add to cart
          </button>
          <p>
            <strong>Reviews:</strong> {product?.numReviews}
          </p>
          <ul>
            {product?.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <li key={review?._id}>Review ID: {review?._id}</li>
              ))
            ) : (
              <p>No reviews available</p>
            )}
          </ul>
        </div>
      ) : (
        <div>Product not found</div>
      )}
    </div>
  );
};

export default ProductDetails;
