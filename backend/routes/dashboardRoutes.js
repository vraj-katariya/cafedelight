const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const MenuItem = require('../models/MenuItem');
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalMenuItems = await MenuItem.countDocuments();

        // Booking stats
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todaysBookings = await Booking.countDocuments({
            date: { $gte: todayStart, $lte: todayEnd }
        });

        const totalTables = await Table.countDocuments();
        const availableTables = await Table.countDocuments({ isAvailable: true });

        // Get total revenue from completed payments
        const revenueResult = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get order stats by status
        const orderStats = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get recent users
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role createdAt');

        // Get daily revenue for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyRevenue = await Payment.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get top selling items
        const topItems = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            dashboard: {
                stats: {
                    totalUsers,
                    totalOrders,
                    totalMenuItems,
                    todaysBookings,
                    totalTables,
                    availableTables,
                    totalRevenue: Math.round(totalRevenue * 100) / 100
                },
                orderStats,
                recentOrders,
                recentUsers,
                recentBookings: await Booking.find().populate('user', 'name').populate('table', 'tableNumber').sort({ createdAt: -1 }).limit(5),
                dailyRevenue,
                topItems
            }
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
