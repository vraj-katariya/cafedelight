const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, available } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (available !== undefined) {
            query.isAvailable = available === 'true';
        }

        const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
        res.json({
            success: true,
            count: menuItems.length,
            menuItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/menu/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = ['Coffee', 'Beverages', 'Snacks', 'Waffle', 'Cakes'];
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        res.json({
            success: true,
            menuItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/menu
// @desc    Create menu item
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['Coffee', 'Beverages', 'Snacks', 'Waffle', 'Cakes']).withMessage('Invalid category')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, description, price, category, image, isAvailable, isVeg } = req.body;

        const menuItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            image,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            isVeg: isVeg !== undefined ? isVeg : true
        });

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            menuItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().isIn(['Coffee', 'Beverages', 'Snacks', 'Waffle', 'Cakes']).withMessage('Invalid category')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            menuItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        await MenuItem.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
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
