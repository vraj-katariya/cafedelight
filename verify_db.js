require('dotenv').config({ path: 'backend/.env' });
const mongoose = require('mongoose');

const checkDB = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        const menuCount = await mongoose.connection.db.collection('menuitems').countDocuments();

        console.log('--------------------------------');
        console.log(`Users found: ${userCount}`);
        console.log(`Menu Items found: ${menuCount}`);
        console.log('--------------------------------');

        if (userCount > 0) {
            console.log('✅ Database HAS data.');
            const admin = await mongoose.connection.db.collection('users').findOne({ email: 'admin@cafedelight.com' });
            if (admin) {
                console.log('✅ Admin user exists:', admin.email);
            } else {
                console.log('❌ Admin user NOT found!');
            }
        } else {
            console.log('❌ Database is EMPTY.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
};

checkDB();
