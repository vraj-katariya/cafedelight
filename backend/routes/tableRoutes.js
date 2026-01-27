const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public (for availability checking logic by frontend) or Admin
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find();
        res.json({ success: true, count: tables.length, data: tables });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Create a table
// @route   POST /api/tables
// @access  Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const table = await Table.create(req.body);
        res.status(201).json({ success: true, data: table });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!table) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        res.json({ success: true, data: table });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id);

        if (!table) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
