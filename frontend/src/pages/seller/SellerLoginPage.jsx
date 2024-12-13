import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import './SellerLoginPage.css';
import { FaHome } from 'react-icons/fa';

const SellerLoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: 'seller/login',
        data,
      });
      const role = response.data.role;
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/seller/profile');
      }
      toast.success('Log-in successful');
    } catch (error) {
      toast.error('Log-in failed');
      console.log(error);
    }
  };

  return (
    <section className="min-vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-6 col-md-6 d-none d-lg-block">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample"
            />
          </div>

          <div className="col-12 col-md-6 col-lg-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="LoginHeading d-flex align-items-center my-4">
                <h4 className="text-center fw-bold mx-3 mb-0">
                  Seller Login Page
                </h4>
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
                <input
                  type="email"
                  id="form3Example3"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  {...register('email')}
                />
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
                <input
                  type="password"
                  id="form3Example4"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  {...register('password')}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="form2Example3"
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-body">
                  Forgot password?
                </a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2 d-flex align-items-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg d-flex gap-2 ms-3 me-3"
                  onClick={() => navigate('/')}
                >
                  <FaHome />
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have a seller account?{' '}
                  <Link className="link-danger" to="/seller-signup">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerLoginPage;
