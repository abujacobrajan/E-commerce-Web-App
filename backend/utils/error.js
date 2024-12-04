const handleError = async (error, req, res, next) => {
  try {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrongg';
    res.status(statusCode).json({ message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || 'Server error' });
  }
};

export { handleError };
