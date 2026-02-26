const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
        trim: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false // Optional, can be anonymous
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: true // Set to true by default for now, unless you want moderation
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Review', reviewSchema);
