// import React from 'react';
// import { Link } from 'react-router-dom';
// const SellerSignupPage = () => {
//   return (
//     <section
//       className="vh-100 bg-image"
//       style={{
//         backgroundImage:
//           "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
//       }}
//     >
//       <div className="mask d-flex align-items-center h-100 gradient-custom-3">
//         <div className="container h-100">
//           <div className="row d-flex justify-content-center align-items-center h-100">
//             <div className="col-12 col-md-9 col-lg-7 col-xl-6">
//               <div className="card" style={{ borderRadius: '10px' }}>
//                 <div className="card-body p-4">
//                   <div className="text-center mb-4">
//                     <h3 className="text-uppercase">Seller Signup Page</h3>
//                   </div>

//                   <form>
//                     <div className="mb-3">
//                       <label className="form-label" htmlFor="form3Example1cg">
//                         Your Name
//                       </label>
//                       <input
//                         type="text"
//                         id="form3Example1cg"
//                         className="form-control"
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label" htmlFor="form3Example3cg">
//                         Your Email
//                       </label>
//                       <input
//                         type="email"
//                         id="form3Example3cg"
//                         className="form-control"
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label" htmlFor="form3Example4cg">
//                         Password
//                       </label>
//                       <input
//                         type="password"
//                         id="form3Example4cg"
//                         className="form-control"
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label" htmlFor="form3Example4cdg">
//                         Repeat your password
//                       </label>
//                       <input
//                         type="password"
//                         id="form3Example4cdg"
//                         className="form-control"
//                       />
//                     </div>

//                     <div className="form-check d-flex justify-content-center mb-4">
//                       <input
//                         className="form-check-input me-2"
//                         type="checkbox"
//                         id="form2Example3cg"
//                       />
//                       <label
//                         className="form-check-label"
//                         htmlFor="form2Example3cg"
//                       >
//                         I agree to all statements in{' '}
//                         <a href="#!" className="text-body">
//                           <u>Terms of service</u>
//                         </a>
//                       </label>
//                     </div>

//                     <div className="d-flex justify-content-center">
//                       <button
//                         type="button"
//                         className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
//                         style={{ padding: '8px 20px' }}
//                       >
//                         Register
//                       </button>
//                     </div>

//                     <p className="text-center text-muted mt-3 mb-0">
//                       Have already a seller account?{' '}
//                       <Link to="/seller-login">
//                         <u>Login here</u>
//                       </Link>
//                     </p>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SellerSignupPage;
// --------------------------------------------------------

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const SellerSignupPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Send data to seller signup endpoint
      const response = await axiosInstance({
        method: 'POST',
        url: 'seller/sellerSignup',
        data,
      });
      toast.success('Seller account created successfully');
      navigate('/seller-login'); // Redirect to seller login page
    } catch (error) {
      toast.error('Failed to create seller account');
      console.error(error);
    }
  };

  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: '10px' }}>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <h3 className="text-uppercase">Seller Signup</h3>
                    <p className="text-muted">
                      Register as a seller to showcase your products and grow
                      your business.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="name">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Enter your name"
                        {...register('name', { required: true })}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="email">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter a valid email address"
                        {...register('email', { required: true })}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Enter your password"
                        {...register('password', { required: true })}
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="confirmPassword">
                        Repeat Your Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        placeholder="Confirm your password"
                        {...register('confirmPassword', { required: true })}
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="form-check d-flex justify-content-center mb-4">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="terms"
                        {...register('terms', { required: true })}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to all statements in{' '}
                        <a href="#!" className="text-body">
                          <u>Terms of Service</u>
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    {/* Login Redirect */}
                    <p className="text-center text-muted mt-3 mb-0">
                      Already have a seller account?{' '}
                      <Link to="/seller-login">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerSignupPage;
