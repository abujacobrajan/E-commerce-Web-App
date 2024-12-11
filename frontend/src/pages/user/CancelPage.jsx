import React from 'react';

const CancelPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">Payment Cancelled</h1>
      <p>Your transaction was not completed. You can try again</p>
      <a href="/user/cart" className="btn btn-warning mt-3">
        Go to Cart
      </a>
    </div>
  );
};

export default CancelPage;
