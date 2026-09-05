import { Router } from 'express';
import { getPreferences, updatePreferences } from '../controllers/preferences.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all preferences routes
router.use(authenticateToken);

// GET /api/preferences
router.get('/', getPreferences);

// PUT /api/preferences
router.put('/', updatePreferences);

export default router;
