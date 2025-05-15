const Booking = require('../models/Booking');
const pool = require('../config/db');

exports.createBooking = async (req, res) => {
  try {
    const { room, purpose, startTime, endTime } = req.body;

    // Conflict check
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

    // Correct user ID and get insert result
    const result = await Booking.create({
      userId: req.user.id,
      room,
      purpose,
      startTime,
      endTime
    });

    const bookingId = result.insertId || result.id; // adapt based on your model

    res.status(201).json({
      id: bookingId,
      room,
      purpose,
      startTime,
      endTime,
      status: 'pending'
    });
  } catch (err) {
    console.error('CreateBooking error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user.id);
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