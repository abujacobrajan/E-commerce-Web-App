import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthSeller = ({ children }) => {
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const checkSeller = async () => {
    try {
      await axiosInstance({
        method: 'GET',
        url: 'seller/check-seller',
      });
      setIsSeller(true);
    } catch (error) {
      setIsSeller(false);
      console.log(error);
      navigate('/seller-login');
    }
  };

  useEffect(() => {
    checkSeller();
  }, []);

  return isSeller ? children : null;
};

// Add prop-types validation
AuthSeller.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is required and is a valid React node
};

export default AuthSeller;
// -----------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { axiosInstance } from '../../config/axiosInstance';
// import { useNavigate } from 'react-router-dom';

// const AuthSeller = ({ children }) => {
//   const [isSeller, setIsSeller] = useState(null); // Use null to represent loading state
//   const navigate = useNavigate();

//   const checkSeller = async () => {
//     try {
//       await axiosInstance({
//         method: 'GET',
//         url: 'seller/check-seller',
//       });
//       setIsSeller(true);
//     } catch (error) {
//       setIsSeller(false);
//       console.log(error);
//       navigate('/seller-login');
//     }
//   };

//   useEffect(() => {
//     checkSeller();
//   }, []);

//   if (isSeller === null) {
//     // Loading state
//     return <div>Loading...</div>;
//   }

//   return isSeller ? children : null;
// };

// // Prop-types validation
// AuthSeller.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default AuthSeller;
