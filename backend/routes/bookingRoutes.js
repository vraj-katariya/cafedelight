const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    checkAvailability,
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
    updateBookingStatus
} = require('../controllers/bookingController');

// @desc    Check availability for a specific date and time
// @route   GET /api/bookings/availability
// @access  Public
router.get('/availability', checkAvailability);

// @desc    Create a booking
// @route   POST /api/bookings
// @access  User
router.post('/', protect, createBooking);

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  User
router.get('/my-bookings', protect, getMyBookings);

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Admin
router.get('/', protect, authorize('admin'), getAllBookings);

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  User (own) or Admin
router.put('/:id/cancel', protect, cancelBooking);

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Admin
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;
