import React from 'react';

const SuccessPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-success">Payment Successful!</h1>
      <p>Thank you for your purchase. Your transaction was successful.</p>
      <a href="/user/profile" className="btn btn-primary mt-3">
        Go to Profile
      </a>
    </div>
  );
};

export default SuccessPage;
