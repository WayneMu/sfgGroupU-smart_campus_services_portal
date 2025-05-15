const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// @route   GET api/admin/stats
// @desc    Get system statistics
router.get('/stats', authMiddleware, adminMiddleware, adminController.getStats);

// @route   PUT api/admin/users/:userId
// @desc    Manage user account
router.put('/users/:userId', authMiddleware, adminMiddleware, adminController.manageUser);

module.exports = router;