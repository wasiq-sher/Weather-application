import mongoose from 'mongoose';
import db from '../config/db.js';

export const dbService = {
  checkHealth: async () => {
    const conn = db.getConnectionState();
    let pingLatencyMs = null;

    if (conn.isConnected && mongoose.connection.db) {
      const start = Date.now();
      try {
        await mongoose.connection.db.admin().ping();
        pingLatencyMs = Date.now() - start;
      } catch (err) {
        // Ping failed
      }
    }

    return {
      status: conn.status,
      isConnected: conn.isConnected,
      latencyMs: pingLatencyMs,
      databaseName: mongoose.connection?.name || 'atmosphere_ai',
    };
  },
};

export default dbService;
