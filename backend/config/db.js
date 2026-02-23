const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Don't exit process in serverless / production to allow health check to show error
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            process.exit(1);
        }
        return false;
    }
};

module.exports = connectDB;
