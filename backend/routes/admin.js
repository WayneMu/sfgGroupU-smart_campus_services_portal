const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// System statistics
router.get('/stats', authMiddleware, adminMiddleware, adminController.getStats);

// User management
router.get('/users', authMiddleware, adminMiddleware, adminController.listUsers);
router.put('/users/:userId', authMiddleware, adminMiddleware, adminController.manageUser);

module.exports = router;