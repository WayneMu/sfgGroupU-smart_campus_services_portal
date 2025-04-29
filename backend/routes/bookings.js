const express = require('express');
const { check } = require('express-validator');
const { authMiddleware } = require('../middlewares/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// @route   POST api/bookings
// @desc    Create booking
router.post(
  '/',
  [
    authMiddleware,
    check('room', 'Room is required').not().isEmpty(),
    check('purpose', 'Purpose is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601()
  ],
  bookingController.createBooking
);

// @route   GET api/bookings
// @desc    Get user bookings
router.get('/', authMiddleware, bookingController.getUserBookings);

// @route   GET api/bookings/all
// @desc    Get all bookings (admin only)
router.get('/all', authMiddleware, bookingController.getAllBookings);

module.exports = router;