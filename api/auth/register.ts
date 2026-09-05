import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

// User Schema & Model Definition
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// MongoDB Connection Helper
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { fullName, email, password } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create and save user
    const newUser = new User({ fullName, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Account created successfully!' });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}