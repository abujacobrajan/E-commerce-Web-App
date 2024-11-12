import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center min-vh-100 align-items-center ">
      <h2>404 Page Not Found!</h2>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default ErrorPage;
