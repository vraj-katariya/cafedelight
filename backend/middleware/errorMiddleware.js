const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) logger.debug(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({ success: false, message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        return res.status(400).json({ success: false, message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ success: false, message });
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorMiddleware;
