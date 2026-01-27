const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/payments
// @desc    Get payment history
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        const payments = await Payment.find(query)
            .populate('order', 'total status createdAt')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('order')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check ownership or admin
        if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this payment'
            });
        }

        res.json({
            success: true,
            payment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/payments
// @desc    Create payment
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { orderId, method, paymentDetails } = req.body;

        // Validate order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to pay for this order'
            });
        }

        // Check if order is already paid
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Order is already paid'
            });
        }

        // Create payment
        const payment = await Payment.create({
            order: orderId,
            user: req.user.id,
            amount: order.total,
            method,
            status: 'completed',
            paymentDetails
        });

        // Update order payment status
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Payment successful',
            payment,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/payments/:id/status
// @desc    Update payment status (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Update order payment status accordingly
        if (status === 'refunded' || status === 'failed') {
            await Order.findByIdAndUpdate(payment.order, { paymentStatus: status });
        }

        res.json({
            success: true,
            message: 'Payment status updated',
            payment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
