require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await MenuItem.deleteMany({});

        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@cafedelight.com',
            password: 'Admin@123',
            role: 'admin',
            phone: '9876543210'
        });
        console.log('✅ Admin user created:', admin.email);

        // Create regular user
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'User@123',
            role: 'user',
            phone: '9876543211'
        });
        console.log('✅ Regular user created:', user.email);

        // Create menu items
        const menuItems = [
            // Coffee
            { name: 'Espresso', description: 'Strong and bold single shot of coffee', price: 120, category: 'Coffee', isVeg: true },
            { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 180, category: 'Coffee', isVeg: true },
            { name: 'Latte', description: 'Smooth espresso with steamed milk', price: 200, category: 'Coffee', isVeg: true },
            { name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 220, category: 'Coffee', isVeg: true },
            { name: 'Cold Brew', description: 'Slow-steeped cold coffee', price: 180, category: 'Coffee', isVeg: true },
            { name: 'Americano', description: 'Espresso diluted with hot water', price: 150, category: 'Coffee', isVeg: true },

            // Beverages
            { name: 'Green Tea', description: 'Premium organic green tea', price: 100, category: 'Beverages', isVeg: true },
            { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 150, category: 'Beverages', isVeg: true },
            { name: 'Mango Smoothie', description: 'Creamy mango smoothie with yogurt', price: 180, category: 'Beverages', isVeg: true },
            { name: 'Iced Tea', description: 'Refreshing iced tea with lemon', price: 120, category: 'Beverages', isVeg: true },
            { name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate', price: 160, category: 'Beverages', isVeg: true },

            // Snacks
            { name: 'Veg Sandwich', description: 'Fresh vegetables with cheese in toasted bread', price: 150, category: 'Snacks', isVeg: true },
            { name: 'Chicken Club Sandwich', description: 'Grilled chicken with bacon and veggies', price: 220, category: 'Snacks', isVeg: false },
            { name: 'French Fries', description: 'Crispy golden fries with dipping sauce', price: 120, category: 'Snacks', isVeg: true },
            { name: 'Paneer Tikka', description: 'Spiced grilled paneer cubes', price: 200, category: 'Snacks', isVeg: true },
            { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', price: 140, category: 'Snacks', isVeg: true },

            // Waffle
            { name: 'Classic Belgian Waffle', description: 'Traditional waffle with maple syrup', price: 180, category: 'Waffle', isVeg: true },
            { name: 'Chocolate Waffle', description: 'Waffle drizzled with chocolate sauce', price: 220, category: 'Waffle', isVeg: true },
            { name: 'Fruit Waffle', description: 'Waffle topped with fresh fruits and cream', price: 250, category: 'Waffle', isVeg: true },
            { name: 'Nutella Waffle', description: 'Waffle with Nutella and banana slices', price: 260, category: 'Waffle', isVeg: true },

            // Cakes
            { name: 'Chocolate Truffle Cake', description: 'Rich chocolate cake with truffle layers', price: 350, category: 'Cakes', isVeg: true },
            { name: 'Red Velvet Cake', description: 'Classic red velvet with cream cheese frosting', price: 320, category: 'Cakes', isVeg: true },
            { name: 'Cheesecake', description: 'New York style creamy cheesecake', price: 300, category: 'Cakes', isVeg: true },
            { name: 'Blueberry Muffin', description: 'Soft muffin loaded with blueberries', price: 120, category: 'Cakes', isVeg: true },
            { name: 'Carrot Cake', description: 'Moist carrot cake with walnut cream frosting', price: 280, category: 'Cakes', isVeg: true }
        ];

        await MenuItem.insertMany(menuItems);
        console.log('✅ Menu items created:', menuItems.length, 'items');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin: admin@cafedelight.com / Admin@123');
        console.log('   User: john@example.com / User@123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
