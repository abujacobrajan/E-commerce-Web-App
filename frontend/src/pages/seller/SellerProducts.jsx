// import React, { useEffect, useState } from 'react';
// import { axiosInstance } from '../../config/axiosInstance.js';

// const SellerProducts = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchSellerProducts = async () => {
//       try {
//         const response = await axiosInstance.get('/products/seller-products');
//         setProducts(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching seller products:', error);
//       }
//     };

//     fetchSellerProducts();
//   }, []);

//   const deleteFromPoroductsList = async (productId) => {
//     try {
//       const response = await axiosInstance.delete(
//         `/products/delete/${productId}`
//       );

//       setProducts(products.filter((product) => product._id !== productId));
//     } catch (error) {
//       console.error('Error removing product from wishlist:', error);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h1>Your Products</h1>

//       {Array.isArray(products) && products.length === 0 ? (
//         <p>No products added yet.</p>
//       ) : (
//         <div className="row">
//           {products.map((product) => (
//             <div key={product._id} className="col-md-4">
//               <div className="card mb-4">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="card-img-top"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{product.name}</h5>
//                   <p className="card-text">Price: ${product.price}</p>
//                   <p className="card-text">{product.description}</p>
//                   <button
//                     className="btn btn-danger"
//                     onClick={() => deleteFromPoroductsList(product._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellerProducts;
// -----------------------------------------------------
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axiosInstance.js';
import toast from 'react-hot-toast';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null); // Track which product is being edited
  const [editedProduct, setEditedProduct] = useState({}); // Store temporary edits
  const [image, setImage] = useState(null); // To store selected image

  // Fetch seller products when component loads
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

  // Delete product from the list
  const deleteFromProductsList = async (productId) => {
    try {
      await axiosInstance.delete(`/products/delete/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  // Handle editing a product
  const handleEdit = (product) => {
    setEditProductId(product._id); // Set product being edited
    setEditedProduct({ ...product }); // Set current product details for editing
    setImage(null); // Reset image on edit
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change (for file input)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Store selected file
  };

  // Save product changes
  const saveChanges = async () => {
    const formData = new FormData();
    formData.append('name', editedProduct.name);
    formData.append('price', editedProduct.price);
    formData.append('description', editedProduct.description);
    formData.append('brand', editedProduct.brand);
    formData.append('category', editedProduct.category);
    formData.append('countInStock', editedProduct.countInStock);

    if (image) {
      formData.append('image', image); // Append image if selected
    }

    try {
      const response = await axiosInstance.put(
        `/products/update/${editProductId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Assuming backend returns updated product data
      const updatedProduct = response.data.data;

      // Update product list with the updated product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editProductId ? updatedProduct : product
        )
      );

      toast.success('Product updated successfully!'); // Show success toast
      setEditProductId(null); // Exit edit mode
      setImage(null); // Reset image
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product.'); // Show error toast
    }
  };

  // Cancel editing product
  const cancelEdit = () => {
    setEditProductId(null); // Exit edit mode without saving
    setEditedProduct({});
    setImage(null); // Reset image
  };

  return (
    <div>
      <h3>Your Products</h3>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div
              key={product._id}
              className={`col-12 ${
                editProductId === product._id ? 'col-md-12' : 'col-md-3'
              } mb-4`} // Full width after edit
            >
              <div
                className={`border border-info rounded shadow p-3 bg-body`}
                style={{ width: '100%' }} // Ensure the card width stays at 100% of the column
              >
                <div className="image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: editProductId === product._id ? '50%' : '100%', // Adjust image width based on edit mode
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                {editProductId === product._id ? (
                  // Edit Mode
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex justify-content-between mb-2">
                        <label>Product Name:</label>
                        <input
                          type="text"
                          name="name"
                          value={editedProduct.name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <label>Brand:</label>
                        <input
                          type="text"
                          name="brand"
                          value={editedProduct.brand}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <label>Price:</label>
                        <input
                          type="text"
                          name="price"
                          value={editedProduct.price}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <label>Category:</label>
                        <input
                          type="text"
                          name="category"
                          value={editedProduct.category}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <label>Count In Stock:</label>
                        <input
                          type="number"
                          name="countInStock"
                          value={editedProduct.countInStock}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <label>Description:</label>
                        <textarea
                          name="description"
                          value={editedProduct.description}
                          onChange={handleInputChange}
                          className="form-control"
                        ></textarea>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <label>Image:</label>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="form-control"
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-2">
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
                  // View Mode
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
