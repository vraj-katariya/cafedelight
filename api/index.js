require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('../backend/routes/authRoutes');
const userRoutes = require('../backend/routes/userRoutes');
const menuRoutes = require('../backend/routes/menuRoutes');
const cartRoutes = require('../backend/routes/cartRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const paymentRoutes = require('../backend/routes/paymentRoutes');
const dashboardRoutes = require('../backend/routes/dashboardRoutes');
const tableRoutes = require('../backend/routes/tableRoutes');
const bookingRoutes = require('../backend/routes/bookingRoutes');
const reviewRoutes = require('../backend/routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection caching for serverless
let cachedDb = null;

async function connectToDatabase() {

    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('Using cached database connection');
        return cachedDb;
    }

    try {
        console.log('Creating new database connection');
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        cachedDb = conn;
        console.log('MongoDB Connected');
        return cachedDb;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Cafe Delight API is running',
        timestamp: new Date().toISOString(),
        env: {
            node_env: process.env.NODE_ENV,
            mongo_defined: !!process.env.MONGODB_URI,
            mongo_prefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'N/A'
        },
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbState: mongoose.connection.readyState
    });
});

// Root route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Cafe Delight API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            menu: '/api/menu',
            cart: '/api/cart',
            orders: '/api/orders',
            payments: '/api/payments',
            tables: '/api/tables',
            bookings: '/api/bookings',
            admin: '/api/admin'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Vercel serverless function handler
module.exports = async (req, res) => {
    // Bypass DB connection for health check and root endpoint
    // This allows verifying the API is up even if DB is down
    if (req.url.includes('/api/health') || (req.url === '/api' && !req.body)) {
        return app(req, res);
    }

    try {
        // Connect to database
        await connectToDatabase();

        // Handle the request with Express
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
