const Booking = require('../models/Booking');
const Table = require('../models/Table');
const logger = require('../utils/logger');

// @desc    Check availability
// @route   GET /api/bookings/availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
    try {
        const { date, timeSlot, guests } = req.query;
        console.log('--- Availability Check ---');
        console.log(`Date: ${date}, TimeSlot: ${timeSlot}, Guests: ${guests}`);

        if (!date || !timeSlot) {
            return res.status(400).json({ success: false, message: 'Please provide date and timeSlot' });
        }

        const queryDate = new Date(date);
        const guestsNum = parseInt(guests) || 1;
        console.log(`Parsed Guests: ${guestsNum}, Capacity Filter: ${guestsNum} to ${guestsNum + 2}`);

        // Validate date (must be today or future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        queryDate.setHours(0, 0, 0, 0);

        if (queryDate < today) {
            return res.status(400).json({ success: false, message: 'Cannot book for past dates' });
        }

        // Find bookings for this date/time that are NOT cancelled
        const bookedTableIds = await Booking.find({
            date: queryDate,
            timeSlot: timeSlot,
            status: { $ne: 'Cancelled' }
        }).distinct('table');

        // and match the guest size (min capacity = guests, max capacity = guests + 2)
        const availableTables = await Table.find({
            _id: { $nin: bookedTableIds },
            isAvailable: true,
            capacity: { $gte: guestsNum, $lte: guestsNum + 2 }
        });

        console.log(`Found ${availableTables.length} tables matching criteria.`);
        console.log('--------------------------');

        res.json({ success: true, count: availableTables.length, data: availableTables });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  User
exports.createBooking = async (req, res, next) => {
    try {
        const { table, date, timeSlot, guests, notes } = req.body;
        const guestsNum = parseInt(guests);
        const bookingDate = new Date(date);

        // Validate date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);

        if (bookingDate < today) {
            return res.status(400).json({ success: false, message: 'Cannot book for past dates' });
        }

        // Check availability logic again to minimize race condition window
        const conflict = await Booking.findOne({
            table,
            date: bookingDate,
            timeSlot,
            status: { $ne: 'Cancelled' }
        });

        if (conflict) {
            return res.status(400).json({ success: false, message: 'This table is already booked for the selected time' });
        }

        const targetTable = await Table.findById(table);
        if (!targetTable) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        if (targetTable.capacity < guestsNum) {
            return res.status(400).json({ success: false, message: `Table only accommodates ${targetTable.capacity} guests` });
        }

        const booking = await Booking.create({
            user: req.user.id,
            table,
            date: bookingDate,
            timeSlot,
            guests: guestsNum,
            notes
        });

        logger.info(`📧 Mock Email Sent: Booking confirmed for ${req.user.id} at ${bookingDate}`);

        res.status(201).json({ success: true, data: booking });

    } catch (err) {
        next(err);
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  User
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('table', 'tableNumber location')
            .sort({ date: 1, timeSlot: 1 });

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Admin
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('table', 'tableNumber location')
            .sort({ date: -1 });

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  User (own) or Admin
exports.cancelBooking = async (req, res, next) => {
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
        next(err);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Admin
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // If trying to confirm, check if double booked first?
        // Ideally yes, but unique index handles it on DB level if we insert. 
        // Here we are just updating status.

        booking.status = status;
        await booking.save();

        res.json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};
