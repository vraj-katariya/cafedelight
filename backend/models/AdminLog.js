const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    target: {
        type: String, // e.g., "Booking 123" or "Table 5"
    },
    details: {
        type: Object
    },
    ipAddress: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', adminLogSchema);
