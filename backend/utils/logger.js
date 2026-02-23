const winston = require('winston');

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER || process.env.NODE_ENV === 'production';
const transports = [];

if (isVercel) {
    // On Vercel, only log to console - NEVER try to write to files
    transports.push(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
} else {
    // Local/Server environment - ensure directory exists or winston might crash
    try {
        const fs = require('fs');
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }
        transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
        transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));
    } catch (e) {
        console.warn('Logging to file failed, falling back to console:', e.message);
    }

    if (process.env.NODE_ENV !== 'production') {
        transports.push(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }));
    }
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: transports,
});

module.exports = logger;
