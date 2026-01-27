const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide item name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide item description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide item price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please provide item category'],
        enum: ['Coffee', 'Beverages', 'Snacks', 'Waffle', 'Cakes']
    },
    image: {
        type: String,
        default: 'default-food.jpg'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
