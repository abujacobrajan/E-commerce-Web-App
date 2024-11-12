import jwt from 'jsonwebtoken';

const sellerAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Seller not authorized. Token missing.',
      });
    }

    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (tokenVerified.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Seller not authorized. Insufficient permissions.',
      });
    }

    req.user = tokenVerified;
    console.log('Seller authenticated:', req.user);

    next();
  } catch (error) {
    console.error('Error in sellerAuth middleware:', error);

    if (error.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ message: 'Invalid token. Please log in again.' });
    }

    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token has expired. Please log in again.' });
    }
    res
      .status(500)
      .json({ message: error.message || 'Internal server error.' });
  }
};

export { sellerAuth };
