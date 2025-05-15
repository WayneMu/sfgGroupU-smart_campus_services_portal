const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Correct structure check
    if (!decoded.userId) {
      throw new Error('Invalid token structure: missing userId');
    }

    // ✅ Correct database query
    const [users] = await pool.query(
      'SELECT id, role FROM users WHERE id = ?', 
      [decoded.userId]
    );

    if (!users.length) {
      return res.status(401).json({ msg: 'User no longer exists' });
    }

    // ✅ Attach full user object to req.user
    req.user = users[0];
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ msg: 'User not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  next();
};
