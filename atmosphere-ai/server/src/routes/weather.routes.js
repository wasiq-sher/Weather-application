import { Router } from 'express';
import {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getAirQuality,
  getSunSchedule,
  getRadarData,
} from '../controllers/weather.controller.js';
import { validateWeatherParams } from '../middleware/validate.js';
import { locationSearchRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * Weather API Routes (Search & query endpoints protected with location search rate limiter)
 */

// GET /api/weather/current
router.get('/current', locationSearchRateLimiter, validateWeatherParams, getCurrentWeather);

// GET /api/weather/hourly
router.get('/hourly', validateWeatherParams, getHourlyForecast);

// GET /api/weather/daily
router.get('/daily', validateWeatherParams, getDailyForecast);

// GET /api/weather/air-quality
router.get('/air-quality', validateWeatherParams, getAirQuality);

// GET /api/weather/sun
router.get('/sun', validateWeatherParams, getSunSchedule);

// GET /api/weather/radar
router.get('/radar', validateWeatherParams, getRadarData);

export default router;
