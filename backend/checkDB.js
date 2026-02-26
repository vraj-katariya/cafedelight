require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const orders = await db.collection('orders').find({}).toArray();
    console.log(`Found ${orders.length} orders`);
    for (const o of orders) {
        console.log(`Order ${o._id}: isReviewed=${o.isReviewed}, total=${o.total}`);
        if (!o.isReviewed) {
            await db.collection('orders').updateOne({ _id: o._id }, { $set: { isReviewed: true } });
            console.log('Fixed order to isReviewed = true');
        }
    }

    const reviews = await db.collection('reviews').find({}).toArray();
    console.log(`Found ${reviews.length} reviews`);
    for (const r of reviews) {
        console.log(`Review ${r._id}: orderId in review=${r.order}`);
    }

    process.exit(0);
}

check();
