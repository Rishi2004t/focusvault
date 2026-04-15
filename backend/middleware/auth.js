import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Neural Link: Retrieve token from Cookies, Headers, or Query
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ message: 'Neural link failed: No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ Critical: JWT_SECRET missing in neural core environment.');
      return res.status(500).json({ message: 'Internal encryption failure' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Neural session expired. Please re-authenticate.' });
    }
    res.status(401).json({ message: 'Neural link compromised: Invalid token.' });
  }
};

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing in environment');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
