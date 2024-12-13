import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">Payment Cancelled</h1>
      <p>
        Your transaction was not completed. If you have any issues or need
        assistance, please contact our support team.
      </p>
      <Link to="/" className="btn btn-secondary mt-3">
        Back to Home
      </Link>
    </div>
  );
};

export default CancelPage;
