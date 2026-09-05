import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
  
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  MONGODB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/atmosphere_ai',
  },
  
  JWT: {
    SECRET: process.env.JWT_SECRET || 'atmosphere_ai_dev_jwt_secret_key_123',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },

  AI: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  }
};

export default ENV;
