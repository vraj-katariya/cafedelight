const Review = require('../models/Review');
const logger = require('../utils/logger');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        logger.error(`Error in getReviews: ${err.message}`);
        next(err);
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public (or Private)
exports.createReview = async (req, res, next) => {
    try {
        // If user is logged in, attach user id
        if (req.user) {
            req.body.user = req.user.id;
        }

        // Link review to order if orderId is provided
        if (req.body.orderId) {
            req.body.order = req.body.orderId;
        }

        const review = await Review.create(req.body);

        // Update order status if orderId is provided
        if (req.body.orderId) {
            const Order = require('../models/Order');
            await Order.findByIdAndUpdate(req.body.orderId, { isReviewed: true });
        }

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (err) {
        logger.error(`Error in createReview: ${err.message}`);
        next(err);
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (err) {
        logger.error(`Error in updateReview: ${err.message}`);
        next(err);
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (err) {
        logger.error(`Error in deleteReview: ${err.message}`);
        next(err);
    }
};
