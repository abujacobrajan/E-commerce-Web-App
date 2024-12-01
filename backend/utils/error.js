// const handleError = (error, req, res, next) => {
//   const statusCode = error.statusCode || 500;
//   const message = error.message || 'Something went wrong';

//   res.status(statusCode).json({
//     success: false,
//     message,
//   });
// };

// export { handleError };

const handleError = async (error, req, res, next) => {
  try {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    res.status(statusCode).message({ message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server error' });
  }
};

export { handleError };
