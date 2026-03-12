const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Order = require('./models/Order');
const Booking = require('./models/Booking');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('booking');
        console.log('--- Latest Orders ---');
        latestOrders.forEach(o => {
            console.log(`Order ID: ${o._id}, CreatedAt: ${o.createdAt}, Booking: ${o.booking ? 'LINKED' : 'NULL'}`);
            if (o.booking) {
                console.log(`  Booking Date: ${o.booking.date}, Slot: ${o.booking.timeSlot}`);
            }
        });

        const latestBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
        console.log('\n--- Latest Bookings ---');
        latestBookings.forEach(b => {
            console.log(`Booking ID: ${b._id}, User: ${b.user}, Date: ${b.date}, Slot: ${b.timeSlot}, Status: ${b.status}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkData();
