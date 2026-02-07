const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    logout,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const { body } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimit');

// Apply rate limiting to all auth routes
router.use(authLimiter);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
], register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', protect, logout);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   PUT /api/auth/reset-password/:resettoken
// @desc    Reset password
// @access  Public
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
