const express = require('express');
const { 
    authMiddleware,
    lecturerMiddleware,
    adminMiddleware,
    sameDepartment
  } = require('../middlewares/auth');
// const { authMiddleware } = require('../middlewares/auth');
const timetableController = require('../controllers/timetableController');

const router = express.Router();

// @route   GET api/timetable
// @desc    Get user timetable
router.get('/', authMiddleware, timetableController.getUserTimetable);
router.get('/', authMiddleware, timetableController.getUserTimetable);
router.get('/all', authMiddleware, sameDepartment('timetable'), timetableController.getAllTimetable);
router.post('/', authMiddleware, lecturerMiddleware, timetableController.createTimetable);
router.put('/:id', authMiddleware, sameDepartment('timetable'), lecturerMiddleware, timetableController.updateTimetable);

// @route   GET api/timetable/all
// @desc    Get all timetable (admin only)

module.exports = router;