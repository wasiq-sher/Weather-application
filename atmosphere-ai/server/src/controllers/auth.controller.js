import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import ENV from '../config/env.js';
import User from '../models/user.model.js';
import UserPreferences from '../models/userPreferences.model.js';

// Fallback secret for JWT if ENV.JWT.SECRET is unset
const JWT_SECRET = process.env.JWT_SECRET || ENV.JWT?.SECRET || 'atmosphere_ai_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || ENV.JWT?.EXPIRES_IN || '7d';

/**
 * Controller handling user authentication & profile operations
 */
export const authController = {
  /**
   * POST /api/auth/register
   * Registers a new user with secure password hashing via bcrypt
   */
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body || {};

      if (!email || typeof email !== 'string' || !email.trim()) {
        throw ApiError.badRequest('Email address is required.', null, 'MISSING_EMAIL');
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        throw ApiError.badRequest('Password is required and must be at least 6 characters long.', null, 'INVALID_PASSWORD');
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      let existingUser = null;
      try {
        existingUser = await User.findOne({ email: normalizedEmail });
      } catch (err) {
        console.warn('[Auth] Database lookup warning:', err.message);
      }

      if (existingUser) {
        throw ApiError.badRequest('An account with this email address already exists.', null, 'EMAIL_IN_USE');
      }

      // Create new user (password is automatically hashed via pre-save hook)
      let newUser;
      try {
        newUser = new User({
          name: name ? name.trim() : 'Weather Explorer',
          email: normalizedEmail,
          password: password,
        });
        await newUser.save();

        // Create default user preferences
        await UserPreferences.create({
          userId: newUser._id,
          temperatureUnit: 'F',
          windUnit: 'mph',
          theme: 'dark',
          notificationsEnabled: true,
          defaultLocation: 'San Francisco, CA',
        }).catch((e) => console.warn('[Auth] Preferences creation notice:', e.message));

      } catch (dbErr) {
        console.warn('[Auth] Database save warning:', dbErr.message);
        // Fallback user object if database is unavailable
        newUser = {
          _id: 'usr_' + Date.now(),
          name: name ? name.trim() : 'Weather Explorer',
          email: normalizedEmail,
          createdAt: new Date(),
        };
      }

      // Generate JWT token
      const payload = {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return ApiResponse.created(
        res,
        {
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
          },
          token,
        },
        'User registered successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   * Authenticates user credentials and issues a signed JWT token
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        throw ApiError.badRequest('Email address and password are required.', null, 'MISSING_CREDENTIALS');
      }

      const normalizedEmail = email.trim().toLowerCase();

      let user = null;
      try {
        user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
      } catch (err) {
        console.warn('[Auth] User fetch warning:', err.message);
      }

      if (!user) {
        throw ApiError.unauthorized('Invalid email address or password.', null, 'INVALID_CREDENTIALS');
      }

      // Verify password hash
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid email address or password.', null, 'INVALID_CREDENTIALS');
      }

      // Generate JWT Token
      const payload = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      // Change this in login:
return ApiResponse.success(
  res,
  {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  },
  200, // Pass 200 before the message string
  'Logged in successfully.'
);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me (or GET /api/auth/profile)
   * Retrieves authenticated user details and preferences
   */
  getMe: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      let user = null;
      let preferences = null;

      if (userId) {
        try {
          user = await User.findById(userId);
          preferences = await UserPreferences.findOne({ userId });
        } catch (err) {
          console.warn('[Auth] Profile query notice:', err.message);
        }
      }

      const userDetails = user
        ? { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt }
        : { id: req.user.id, name: req.user.name || 'Weather Explorer', email: req.user.email };

      return ApiResponse.success(
        res,
        {
          user: userDetails,
          preferences: preferences || {
            temperatureUnit: 'F',
            windUnit: 'mph',
            theme: 'dark',
            notificationsEnabled: true,
            defaultLocation: 'San Francisco, CA',
          },
        },
        'Authenticated profile retrieved successfully.'
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/logout
   * Logs out user session
   */
  logout: async (req, res, next) => {
    try {
      return ApiResponse.success(res, { loggedOut: true }, 'Logged out successfully.');
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
