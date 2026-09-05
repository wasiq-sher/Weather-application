import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import airQualityService from '../services/airQualityService.js';

/**
 * Controller handling Air Quality telemetry endpoints
 */

/**
 * GET /api/air-quality
 * Retrieves normalized AQI, PM2.5, PM10, Ozone (O3), NO2, CO, SO2, and category classification.
 */
export const getAirQuality = asyncHandler(async (req, res) => {
  const { lat, lon, city, location } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    city: city || location || normalized.city || 'San Francisco',
  };

  const airQualityData = await airQualityService.getAirQuality(queryParams);
  return ApiResponse.success(res, airQualityData);
});

export default {
  getAirQuality,
};
