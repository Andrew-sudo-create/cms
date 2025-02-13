import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' '); // Get token from header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};