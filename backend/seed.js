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
            { name: 'Espresso', description: 'Strong and bold single shot of coffee', price: 120, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80' },
            { name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 180, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80' },
            { name: 'Latte', description: 'Smooth espresso with steamed milk', price: 200, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 220, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80' },
            { name: 'Cold Brew', description: 'Slow-steeped cold coffee', price: 180, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Americano', description: 'Espresso diluted with hot water', price: 150, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=600&q=80' },
            { name: 'Macchiato', description: 'Espresso stained with milk foam', price: 160, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80' },
            { name: 'Flat White', description: 'Micro-foamed milk over double espresso', price: 190, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80' },
            { name: 'Affogato', description: 'Vanilla gelato with hot espresso', price: 250, category: 'Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1594133900913-76127402eced?auto=format&fit=crop&w=600&q=80' },

            // Beverages
            { name: 'Green Tea', description: 'Premium organic green tea', price: 100, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80' },
            { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 150, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
            { name: 'Mango Smoothie', description: 'Creamy mango smoothie', price: 180, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1623065640554-5f508092780a?auto=format&fit=crop&w=600&q=80' },
            { name: 'Iced Tea', description: 'Refreshing iced tea with lemon', price: 120, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
            { name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate', price: 160, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1544787210-2213d84ad96b?auto=format&fit=crop&w=600&q=80' },
            { name: 'Masala Chai', description: 'Traditional Indian spiced tea', price: 40, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1571934811356-5cc561b6821f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Strawberry Milkshake', description: 'Fresh strawberries blended with milk', price: 190, category: 'Beverages', isVeg: true, image: 'https://images.unsplash.com/photo-1579722820308-d74e50192237?auto=format&fit=crop&w=600&q=80' },

            // Snacks
            { name: 'Veg Sandwich', description: 'Fresh vegetables with cheese in toasted bread', price: 150, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80' },
            { name: 'Chicken Club Sandwich', description: 'Grilled chicken with fresh veggies', price: 220, category: 'Snacks', isVeg: false, image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=600&q=80' },
            { name: 'French Fries', description: 'Crispy golden fries', price: 120, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80' },
            { name: 'Paneer Tikka', description: 'Spiced grilled paneer cubes', price: 200, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80' },
            { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', price: 140, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea8c5369511?auto=format&fit=crop&w=600&q=80' },
            { name: 'Samosa (2 pcs)', description: 'Crispy pastry filled with spiced potatoes', price: 60, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1601050638917-3606f8095bb4?auto=format&fit=crop&w=600&q=80' },
            { name: 'Vada Pav', description: 'Mumbai style spicy potato burger', price: 50, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1626132646529-5aa2ef969392?auto=format&fit=crop&w=600&q=80' },
            { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 130, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1622321453416-0916068224a1?auto=format&fit=crop&w=600&q=80' },

            // Waffle
            { name: 'Classic Belgian Waffle', description: 'Traditional waffle with maple syrup', price: 180, category: 'Waffle', isVeg: true, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80' },
            { name: 'Chocolate Waffle', description: 'Waffle drizzled with chocolate sauce', price: 220, category: 'Waffle', isVeg: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
            { name: 'Fruit Waffle', description: 'Waffle with fresh fruits', price: 250, category: 'Waffle', isVeg: true, image: 'https://images.unsplash.com/photo-1459789034005-ba29c5781515?auto=format&fit=crop&w=600&q=80' },
            { name: 'Nutella Waffle', description: 'Waffle with Nutella and banana', price: 260, category: 'Waffle', isVeg: true, image: 'https://images.unsplash.com/photo-1581404090799-3543d463e264?auto=format&fit=crop&w=600&q=80' },

            // Cakes
            { name: 'Chocolate Truffle Cake', description: 'Rich chocolate cake', price: 350, category: 'Cakes', isVeg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
            { name: 'Red Velvet Cake', description: 'Classic red velvet', price: 320, category: 'Cakes', isVeg: true, image: 'https://images.unsplash.com/photo-1586788680434-30d324671450?auto=format&fit=crop&w=600&q=80' },
            { name: 'Cheesecake', description: 'Creamy cheesecake', price: 300, category: 'Cakes', isVeg: true, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80' },
            { name: 'Blueberry Muffin', description: 'Soft muffin with blueberries', price: 120, category: 'Cakes', isVeg: true, image: 'https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?auto=format&fit=crop&w=600&q=80' }
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
