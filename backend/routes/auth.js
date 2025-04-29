const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6+ characters').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST api/auth/login
// @desc    Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET api/auth/user
// @desc    Get current logged-in user
// ✅ PROTECTED WITH authMiddleware
router.get('/user', authMiddleware, authController.getUser);

module.exports = router;
