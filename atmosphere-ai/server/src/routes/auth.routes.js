import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * Authentication Endpoints (Rate limited to prevent brute force)
 */

// POST /api/auth/register
router.post('/register', authRateLimiter, authController.register);

// POST /api/auth/login
router.post('/login', authRateLimiter, authController.login);

// GET /api/auth/me
router.get('/me', authenticateToken, authController.getMe);

// GET /api/auth/profile (alias for /me)
router.get('/profile', authenticateToken, authController.getMe);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;
