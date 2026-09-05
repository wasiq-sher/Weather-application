import { Router } from 'express';
import { askQuestion } from '../controllers/assistantController.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { assistantRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * POST /api/assistant/ask
 * Grounded AI Weather Assistant query endpoint (Rate limited)
 */
router.post('/ask', assistantRateLimiter, optionalAuth, askQuestion);

export default router;
