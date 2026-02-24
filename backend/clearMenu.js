require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const clearMenu = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');

        console.log('Deleting all menu items...');
        const result = await MenuItem.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} menu items.`);

        console.log('\n🎉 Your menu is now empty! You can start adding new items from the Admin Panel.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing menu:', error);
        process.exit(1);
    }
};

clearMenu();
