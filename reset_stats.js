require('dotenv').config({ path: 'backend/.env' });
const mongoose = require('mongoose');

const resetStats = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        console.log('Resetting statistics...');

        // Clear Orders
        const orderResult = await mongoose.connection.db.collection('orders').deleteMany({});
        console.log(`🗑️ Deleted ${orderResult.deletedCount} orders`);

        // Clear Payments
        const paymentResult = await mongoose.connection.db.collection('payments').deleteMany({});
        console.log(`🗑️ Deleted ${paymentResult.deletedCount} payments`);

        // Clear Bookings
        const bookingResult = await mongoose.connection.db.collection('bookings').deleteMany({});
        console.log(`🗑️ Deleted ${bookingResult.deletedCount} bookings`);

        console.log('--------------------------------');
        console.log('✅ All requested dashboard statistics have been reset to 0.');
        console.log('--------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Reset failed:', error.message);
        process.exit(1);
    }
};

resetStats();
