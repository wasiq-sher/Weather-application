import mongoose from 'mongoose';
import ENV from './env.js';

/**
 * Production MongoDB Connection Configuration & Lifecycle Manager
 */
class Database {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('Using existing MongoDB connection.');
      return;
    }

    const uri = ENV.MONGODB.URI;

    const options = {
      autoIndex: !ENV.IS_PRODUCTION, // Don't build indexes in production
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    try {
      // Configure connection event listeners
      mongoose.connection.on('connected', () => {
        this.isConnected = true;
        console.log('✅ MongoDB connected successfully to database cluster.');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        this.isConnected = false;
        console.warn('⚠️  MongoDB disconnected. Attempting reconnection...');
      });

      // Attempt initial connection
      await mongoose.connect(uri, options);
    } catch (error) {
      console.error('❌ Failed to establish initial MongoDB connection:', error.message);
      console.warn('ℹ️  Server will continue running in offline/transient database mode.');
      // In development or container environments without a live MongoDB instance,
      // allow server to continue running without crash
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB connection gracefully closed.');
    }
  }

  getConnectionState() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const readyState = mongoose.connection?.readyState ?? 0;
    return {
      status: states[readyState] || 'unknown',
      isConnected: readyState === 1,
    };
  }
}

export const db = new Database();
export default db;
