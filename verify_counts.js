require('dotenv').config({ path: 'backend/.env' });
const mongoose = require('mongoose');

const checkDB = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        const menuCount = await mongoose.connection.db.collection('menuitems').countDocuments();
        const orderCount = await mongoose.connection.db.collection('orders').countDocuments();
        const paymentCount = await mongoose.connection.db.collection('payments').countDocuments();
        const bookingCount = await mongoose.connection.db.collection('bookings').countDocuments();

        console.log('--------------------------------');
        console.log(`Users remaining: ${userCount}`);
        console.log(`Menu Items remaining: ${menuCount}`);
        console.log(`Orders remaining: ${orderCount}`);
        console.log(`Payments remaining: ${paymentCount}`);
        console.log(`Bookings remaining: ${bookingCount}`);
        console.log('--------------------------------');

        if (orderCount === 0 && paymentCount === 0 && bookingCount === 0) {
            console.log('✅ Verification SUCCESS: Stats collections are empty.');
        } else {
            console.log('❌ Verification FAILED: Some collections still have data.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
};

checkDB();
