const User = require('../models/User');
const Booking = require('../models/Booking');
const Maintenance = require('../models/Maintenance');

exports.getStats = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [bookings] = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const [tickets] = await pool.query('SELECT COUNT(*) as count FROM maintenance_tickets');
    
    res.json({
      users: users[0].count,
      bookings: bookings[0].count,
      tickets: tickets[0].count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.manageUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'activate', 'deactivate', 'delete'
    
    // Implement user management logic
    res.json({ msg: `User ${userId} ${action}d successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};