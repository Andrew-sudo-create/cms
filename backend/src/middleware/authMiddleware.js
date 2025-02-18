import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  // console.log('Before token check');

  try {
    const token = req.header('Authorization')?.split(' ');

    if (!token) {
      // console.log('Token missing');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // console.log('Token present:', token[1]);

    const decoded = jwt.verify(token[1], process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded);

    req.user = await User.findById(decoded.userId).select('-password');
    // console.log('Found user:', req.user);

    next();
  } catch (err) {
    // console.error('Error in authMiddleware:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;