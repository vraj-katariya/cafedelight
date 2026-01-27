const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide a booking date']
    },
    timeSlot: {
        type: String,
        required: [true, 'Please provide a time slot']
    },
    guests: {
        type: Number,
        required: [true, 'Please provide number of guests'],
        min: 1
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Prevent double booking for same table/date/time
// Note: This unique index helps, but application logic should also validate.
bookingSchema.index({ table: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
