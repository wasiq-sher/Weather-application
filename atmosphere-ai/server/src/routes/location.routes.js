import { Router } from 'express';
import {
  getLocations,
  createLocation,
  deleteLocation,
} from '../controllers/location.controller.js';
import { validateCreateLocation, validateIdParam } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Protected Location API Routes
 * Requires valid JWT Bearer token
 */
router.use(authenticateToken);

// GET /api/locations
router.get('/', getLocations);

// POST /api/locations
router.post('/', validateCreateLocation, createLocation);

// DELETE /api/locations/:id
router.delete('/:id', validateIdParam, deleteLocation);

export default router;
