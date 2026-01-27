const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.menuItem', 'name price image category isAvailable');

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Calculate totals
        let subtotal = 0;
        cart.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const gstRate = 5;
        const gstAmount = (subtotal * gstRate) / 100;
        const total = subtotal + gstAmount;

        res.json({
            success: true,
            cart: {
                items: cart.items,
                subtotal: Math.round(subtotal * 100) / 100,
                gstRate,
                gstAmount: Math.round(gstAmount * 100) / 100,
                total: Math.round(total * 100) / 100
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

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
    try {
        const { menuItemId, quantity = 1 } = req.body;

        // Validate menu item
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Menu item is not available'
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.menuItem.toString() === menuItemId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                menuItem: menuItemId,
                quantity,
                price: menuItem.price
            });
        }

        await cart.save();

        // Populate and return cart
        cart = await Cart.findOne({ user: req.user.id })
            .populate('items.menuItem', 'name price image category');

        res.json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.put('/update', protect, async (req, res) => {
    try {
        const { menuItemId, quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity cannot be negative'
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.menuItem.toString() === menuItemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        cart = await Cart.findOne({ user: req.user.id })
            .populate('items.menuItem', 'name price image category');

        res.json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/cart/remove/:menuItemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:menuItemId', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            item => item.menuItem.toString() !== req.params.menuItemId
        );

        await cart.save();

        cart = await Cart.findOne({ user: req.user.id })
            .populate('items.menuItem', 'name price image category');

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Clear cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            success: true,
            message: 'Cart cleared'
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
