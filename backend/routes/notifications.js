const express = require('express');
const { check } = require('express-validator');
const { authMiddleware } = require('../middlewares/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// @route   POST api/notifications
// @desc    Create notification
router.post(
  '/',
  [
    authMiddleware,
    check('message', 'Message is required').not().isEmpty()
  ],
  notificationController.createNotification
);

// @route   GET api/notifications
// @desc    Get user notifications
router.get('/', authMiddleware, notificationController.getUserNotifications);

// @route   GET api/notifications/all
// @desc    Get all notifications (admin only)
router.get('/all', authMiddleware, notificationController.getAllNotifications);

module.exports = router;