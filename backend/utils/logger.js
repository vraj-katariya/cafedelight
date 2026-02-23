const winston = require('winston');

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const transports = [];

if (isVercel) {
    // On Vercel, only log to console
    transports.push(new winston.transports.Console({
        format: winston.format.simple(),
    }));
} else {
    // Local/Server environment
    transports.push(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
    transports.push(new winston.transports.File({ filename: 'logs/combined.log' }));

    if (process.env.NODE_ENV !== 'production') {
        transports.push(new winston.transports.Console({
            format: winston.format.simple(),
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
