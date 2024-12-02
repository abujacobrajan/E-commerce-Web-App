import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignupPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../config/axiosInstance';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Send a POST request to the signup endpoint
      const response = await axiosInstance({
        method: 'POST',
        url: 'user/signup',
        data,
      });
      toast.success('Registration successful');
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      toast.error('Registration failed');
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
                    <h3 className="text-uppercase">Create an account</h3>
                    <p className="text-muted">
                      Fill in the form below to register an account and enjoy
                      our services.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="name">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-control form-control-lg"
                        placeholder="Enter your name"
                        {...register('name', { required: true })}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="email">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="Enter a valid email address"
                        {...register('email', { required: true })}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        {...register('password', { required: true })}
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control form-control-lg"
                        placeholder="Repeat your password"
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
                          <u>Terms of service</u>
                        </a>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Already have an account?{' '}
                        <Link className="link-danger" to="/login">
                          Login
                        </Link>
                      </p>
                    </div>
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

export default SignupPage;
