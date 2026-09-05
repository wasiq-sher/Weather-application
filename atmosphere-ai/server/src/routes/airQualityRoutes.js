import { Router } from 'express';
import { getAirQuality } from '../controllers/airQualityController.js';
import { validateWeatherParams } from '../middleware/validate.js';

const router = Router();

/**
 * Air Quality Routes
 * GET /api/air-quality
 */
router.get('/', validateWeatherParams, getAirQuality);

export default router;
