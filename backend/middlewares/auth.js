const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.authMiddleware = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const [users] = await pool.query(
      'SELECT id, name, email, role, department FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, error: 'Token verification failed' });
  }
};

// Role-based middleware generator
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Requires ${roles.join(' or ')} privileges` 
      });
    }

    next();
  };
};

// Add department check middleware
exports.sameDepartment = (resourceType) => {
  return async (req, res, next) => {
    try {
      // Admins can access everything
      if (req.user.role === 'admin') return next();
      
      // For GET /all requests, filter by department
      if (req.method === 'GET' && req.path.includes('/all')) {
        req.departmentFilter = req.user.department;
        return next();
      }
      
      // For specific resource access, verify department
      if (req.params.id) {
        let query = '';
        switch(resourceType) {
          case 'timetable':
            query = 'SELECT department FROM timetable JOIN users ON timetable.lecturer_id = users.id WHERE timetable.id = ?';
            break;
          case 'maintenance':
            query = 'SELECT department FROM maintenance_tickets JOIN users ON maintenance_tickets.user_id = users.id WHERE maintenance_tickets.id = ?';
            break;
          case 'notification':
            query = 'SELECT department FROM notifications JOIN users ON notifications.user_id = users.id WHERE notifications.id = ?';
            break;
          default:
            return res.status(403).json({ error: 'Invalid resource type' });
        }
        
        const [results] = await pool.query(query, [req.params.id]);
        if (!results.length || results[0].department !== req.user.department) {
          return res.status(403).json({ error: 'Access denied - different department' });
        }
      }
      
      next();
    } catch (err) {
      console.error('Department check error:', err);
      res.status(500).json({ error: 'Server error during department verification' });
    }
  };
};

// Specific role middlewares
exports.adminMiddleware = exports.requireRole(['admin']);
exports.lecturerMiddleware = exports.requireRole(['lecturer', 'admin']);
exports.studentMiddleware = exports.requireRole(['student']);