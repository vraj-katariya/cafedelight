const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./models/Review');

dotenv.config();

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding reviews...');

        const reviews = [
            {
                customerName: 'Raj Patel',
                rating: 5,
                comment: 'Excellent coffee and amazing atmosphere! The staff is very friendly.',
                date: new Date('2024-01-15')
            },
            {
                customerName: 'Priya Shah',
                rating: 4,
                comment: 'Great food and good service. The cafe has a wonderful ambiance.',
                date: new Date('2024-01-10')
            },
            {
                customerName: 'Ankit Mehta',
                rating: 5,
                comment: 'The best waffles in town! Highly recommended.',
                date: new Date('2024-02-01')
            }
        ];

        await Review.deleteMany();
        await Review.create(reviews);

        console.log('Sample reviews seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding reviews:', err);
        process.exit(1);
    }
};

seedReviews();
