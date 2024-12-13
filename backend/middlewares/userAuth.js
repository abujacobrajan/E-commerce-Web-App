import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'User not authorized.' });
    }
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // if (!tokenVerified) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: 'User not authorized' });
    // }
    if (tokenVerified.role !== 'user' && tokenVerified.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized.',
      });
    }

    req.user = tokenVerified;

    next();
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || 'Internal server error.' });
  }
};

export { userAuth };
