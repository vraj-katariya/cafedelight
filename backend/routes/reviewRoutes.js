const express = require('express');
const {
    getReviews,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getReviews)
    .post(protect, createReview);

router.route('/:id')
    .put(protect, authorize('admin'), updateReview)
    .delete(protect, authorize('admin'), deleteReview);

module.exports = router;
