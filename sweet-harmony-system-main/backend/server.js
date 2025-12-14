import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-harmony')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
import authRoutes from './routes/auth.js';
import sweetsRoutes from './routes/sweets.js';

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.get('/', (req, res) => {
  res.send('Sweet Harmony API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});