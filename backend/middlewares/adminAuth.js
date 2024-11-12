import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Admin not authorized.' });
    }
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!tokenVerified) {
      return res
        .status(401)
        .json({ success: false, message: 'Admin not authorized' });
    }
    if (tokenVerified.role !== 'admin') {
      return res
        .status(401)
        .json({ success: false, message: 'Admin not authorized' });
    }
    req.admin = tokenVerified;

    next();
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || 'Internal server error.' });
  }
};

export { adminAuth };
