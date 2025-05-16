const express = require('express');
const { check } = require('express-validator');
const { authMiddleware } = require('../middlewares/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();
const db = require('../models'); // Sequelize models

const {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

const {
  Booking,
  ClassAppointment,
  ClassAppointmentBooking
} = db;

// ================== Authenticated Booking Routes ==================

// POST /api/bookings — Create a booking with validation
router.post(
  '/bookings',
  [
    authMiddleware,
    check('room', 'Room is required').not().isEmpty(),
    check('purpose', 'Purpose is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601()
  ],
  bookingController.createBooking
);

// GET /api/bookings — Get current user's bookings
router.get('/bookings', authMiddleware, bookingController.getUserBookings);

// GET /api/bookings/all — Get all bookings (admin)
router.get('/bookings/all', authMiddleware, bookingController.getAllBookings);

// ================== Room CRUD Routes ==================

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

// ================== Room Booking with Conflict Check ==================

router.post('/room-bookings', async (req, res) => {
  const { userId, roomId, date, timeSlot } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      where: { roomId, date, timeSlot }
    });

    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const newBooking = await Booking.create({ userId, roomId, date, timeSlot });
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== Class Appointment Routes ==================

// GET all class appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await ClassAppointment.findAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// POST create new appointment
router.post('/appointments', async (req, res) => {
  const { lecturerId, topic, date, timeSlot, location } = req.body;

  try {
    const appt = await ClassAppointment.create({ lecturerId, topic, date, timeSlot, location });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Error creating appointment' });
  }
});

// POST student booking an appointment
router.post('/appointments/bookings', async (req, res) => {
  const { appointmentId, studentId } = req.body;

  try {
    const existing = await ClassAppointmentBooking.findOne({
      where: { appointmentId, studentId }
    });

    if (existing) return res.status(409).json({ message: 'Already booked' });

    const booking = await ClassAppointmentBooking.create({ appointmentId, studentId });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Error booking appointment' });
  }
});

// GET all bookings for a student
router.get('/appointments/bookings/:studentId', async (req, res) => {
  try {
    const bookings = await ClassAppointmentBooking.findAll({
      where: { studentId: req.params.studentId },
      include: ClassAppointment
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching student bookings' });
  }
});

module.exports = router;
