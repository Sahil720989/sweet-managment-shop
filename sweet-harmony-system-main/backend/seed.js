import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sweet from './models/Sweet.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-harmony');
    console.log('Connected to MongoDB');

    // Create a dummy user if not exists
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      user = new User({
        email: 'admin@example.com',
        password: '$2a$10$examplehashedpassword', // dummy hashed password
        full_name: 'Admin User',
        role: 'admin',
      });
      await user.save();
      console.log('Dummy user created');
    }

    // Dummy sweets data
    const sweetsData = [
      {
        name: 'Chocolate Cake',
        category: 'Cake',
        price: 25.99,
        quantity: 10,
        description: 'Rich and moist chocolate cake',
        image_url: 'https://example.com/chocolate-cake.jpg',
        created_by: user._id,
      },
      {
        name: 'Vanilla Cupcake',
        category: 'Cupcake',
        price: 5.99,
        quantity: 20,
        description: 'Delicious vanilla cupcake with frosting',
        image_url: 'https://example.com/vanilla-cupcake.jpg',
        created_by: user._id,
      },
      {
        name: 'Strawberry Ice Cream',
        category: 'Ice Cream',
        price: 7.99,
        quantity: 15,
        description: 'Creamy strawberry ice cream',
        image_url: 'https://example.com/strawberry-ice-cream.jpg',
        created_by: user._id,
      },
      {
        name: 'Blueberry Muffin',
        category: 'Muffin',
        price: 4.99,
        quantity: 25,
        description: 'Fresh blueberry muffin',
        image_url: 'https://example.com/blueberry-muffin.jpg',
        created_by: user._id,
      },
      {
        name: 'Caramel Brownie',
        category: 'Brownie',
        price: 6.99,
        quantity: 12,
        description: 'Chewy caramel brownie',
        image_url: 'https://example.com/caramel-brownie.jpg',
        created_by: user._id,
      },
    ];

    // Check if sweets already exist
    const existingSweets = await Sweet.countDocuments();
    if (existingSweets === 0) {
      await Sweet.insertMany(sweetsData);
      console.log('Dummy sweets data inserted');
    } else {
      console.log('Sweets data already exists');
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();