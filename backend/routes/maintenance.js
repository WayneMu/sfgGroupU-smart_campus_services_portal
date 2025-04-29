const express = require('express');
const { check } = require('express-validator');
const { authMiddleware } = require('../middlewares/auth');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

// @route   POST api/maintenance
// @desc    Create maintenance ticket
router.post(
  '/',
  [
    authMiddleware,
    check('issueType', 'Issue type is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  maintenanceController.createTicket
);

// @route   GET api/maintenance
// @desc    Get user tickets
router.get('/', authMiddleware, maintenanceController.getUserTickets);

// @route   GET api/maintenance/all
// @desc    Get all tickets (admin only)
router.get('/all', authMiddleware, maintenanceController.getAllTickets);

module.exports = router;