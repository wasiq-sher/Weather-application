import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Schema & Model Definition (matches register.ts)
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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure request is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Parse body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON payload.' });
      }
    }

    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT Token
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}