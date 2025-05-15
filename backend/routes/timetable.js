const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const timetableController = require('../controllers/timetableController');

const router = express.Router();

// @route   GET api/timetable
// @desc    Get user timetable
router.get('/', authMiddleware, timetableController.getUserTimetable);

// @route   GET api/timetable/all
// @desc    Get all timetable (admin only)
router.get('/all', authMiddleware, timetableController.getAllTimetable);

module.exports = router;