import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const cleanData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-harmony');
    console.log('Connected to MongoDB');

    await User.deleteMany({ email: 'admin@example.com' });
    console.log('Dummy user removed');

    process.exit(0);
  } catch (error) {
    console.error('Error cleaning data:', error);
    process.exit(1);
  }
};

cleanData();