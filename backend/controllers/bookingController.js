const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { room, purpose, startTime, endTime } = req.body;
    
    // Check for booking conflicts
    const [conflicts] = await pool.query(
      `SELECT id FROM bookings 
       WHERE room = ? AND (
         (start_time < ? AND end_time > ?) OR
         (start_time >= ? AND start_time < ?) OR
         (end_time > ? AND end_time <= ?)
       )`,
      [room, endTime, startTime, startTime, endTime, startTime, endTime]
    );
    
    if (conflicts.length > 0) {
      return res.status(400).json({ msg: 'Room already booked for this time' });
    }

    const bookingId = await Booking.create({
      userId: req.user.userId,
      room,
      purpose,
      startTime,
      endTime
    });
    
    res.json({ 
      id: bookingId,
      room,
      purpose,
      startTime,
      endTime,
      status: 'pending'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user.userId);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};