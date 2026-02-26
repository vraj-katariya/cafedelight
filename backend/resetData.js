/**
 * Reset Script - Clears all orders, bookings, payments, carts, and reviews
 * Run: node backend/resetData.js
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function resetData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!\n');

        const db = mongoose.connection.db;

        // Collections to clear
        const collections = ['orders', 'bookings', 'payments', 'carts', 'reviews'];

        for (const col of collections) {
            try {
                const result = await db.collection(col).deleteMany({});
                console.log(`✅ Cleared "${col}" — ${result.deletedCount} documents deleted.`);
            } catch (err) {
                console.log(`⚠️  Could not clear "${col}": ${err.message}`);
            }
        }

        // Reset menu item sold counts to 0
        try {
            const result = await db.collection('menuitems').updateMany({}, { $set: { soldCount: 0, totalRevenue: 0 } });
            console.log(`✅ Reset "menuitems" sold counts — ${result.modifiedCount} items updated.`);
        } catch (err) {
            console.log(`⚠️  Could not reset menuitems: ${err.message}`);
        }

        console.log('\n🎉 Done! Dashboard will now show 0 orders, 0 revenue, and 0 bookings.');
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed.');
    }
}

resetData();
