const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { protect, authorize } = require('../middleware/auth');

// @desc    Check availability for a specific date and time
// @route   GET /api/bookings/availability
// @access  Public
router.get('/availability', async (req, res) => {
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
        return res.status(400).json({ success: false, message: 'Please provide date and timeSlot' });
    }

    try {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        // Find bookings for this date/time that are NOT cancelled
        const bookedTableIds = await Booking.find({
            date: queryDate,
            timeSlot: timeSlot,
            status: { $ne: 'Cancelled' }
        }).distinct('table');

        // Find tables that are NOT in the bookedTableIds and are generally available
        const availableTables = await Table.find({
            _id: { $nin: bookedTableIds },
            isAvailable: true
        });

        res.json({ success: true, count: availableTables.length, data: availableTables });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  User
router.post('/', protect, async (req, res) => {
    try {
        const { table, date, timeSlot, guests, notes } = req.body;
        const guestsNum = parseInt(guests);
        const bookingDate = new Date(date);
        bookingDate.setHours(0, 0, 0, 0);

        // Check if table exists
        const targetTable = await Table.findById(table);
        if (!targetTable) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        // Check capacity
        if (targetTable.capacity < guestsNum) {
            return res.status(400).json({ success: false, message: `Table only accommodates ${targetTable.capacity} guests` });
        }

        // Check for conflicts
        const conflict = await Booking.findOne({
            table,
            date: bookingDate,
            timeSlot,
            status: { $ne: 'Cancelled' }
        });

        if (conflict) {
            return res.status(400).json({ success: false, message: 'This table is already booked for the selected time' });
        }

        const booking = await Booking.create({
            user: req.user.id,
            table,
            date: bookingDate,
            timeSlot,
            guests: guestsNum,
            notes
        });

        res.status(201).json({ success: true, data: booking });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  User
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('table', 'tableNumber location')
            .sort({ date: 1, timeSlot: 1 });

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('table', 'tableNumber location')
            .sort({ date: -1 });

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  User (own) or Admin
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Verify ownership or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
