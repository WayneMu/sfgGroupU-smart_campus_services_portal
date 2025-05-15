const pool = require('../config/db');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(role = 'student') as students,
        SUM(role = 'lecturer') as lecturers,
        SUM(role = 'admin') as admins
      FROM users
      WHERE status = 'active'
    `);
    
    const [bookings] = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [tickets] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(status = 'open') as open,
        SUM(status = 'in_progress') as in_progress
      FROM maintenance_tickets
    `);

    res.json({
      success: true,
      data: {
        users: users[0],
        bookings: bookings[0].count,
        tickets: tickets[0]
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.manageUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, role } = req.body;

    // Validate action
    const validActions = ['activate', 'deactivate', 'delete', 'changeRole'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Prevent self-modification
    if (userId == req.user.id) {
      return res.status(403).json({ success: false, error: 'Cannot modify your own account' });
    }

    // Execute action
    switch (action) {
      case 'activate':
        await pool.query('UPDATE users SET status = "active" WHERE id = ?', [userId]);
        break;
      case 'deactivate':
        await pool.query('UPDATE users SET status = "inactive" WHERE id = ?', [userId]);
        break;
      case 'delete':
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        break;
      case 'changeRole':
        await User.updateRole(userId, role);
        break;
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let users;

    if (role) {
      users = await User.getByRole(role);
    } else {
      users = await User.getAll();
    }

    res.json({ success: true, data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};