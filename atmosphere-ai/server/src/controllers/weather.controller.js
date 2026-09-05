import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import weatherService from '../services/weather/weatherService.js';

/**
 * Controller handling all weather API endpoints
 */

/**
 * GET /api/weather/current
 * Retrieves current weather metrics for coordinates or city
 */
export const getCurrentWeather = asyncHandler(async (req, res) => {
  const { lat, lon, city, units, provider } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    city: city || normalized.city || 'San Francisco',
    units: units || 'F',
    provider,
  };

  const weatherData = await weatherService.getCurrentWeather(queryParams);
  return ApiResponse.success(res, weatherData);
});

/**
 * GET /api/weather/hourly
 * Retrieves 24-48 hour weather forecast
 */
export const getHourlyForecast = asyncHandler(async (req, res) => {
  const { lat, lon, city, hours, units, provider } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    city: city || normalized.city || 'San Francisco',
    hours: hours ? parseInt(hours, 10) : 24,
    units: units || 'F',
    provider,
  };

  const forecast = await weatherService.getHourlyForecast(queryParams);
  return ApiResponse.success(res, forecast);
});

/**
 * GET /api/weather/daily
 * Retrieves 7-day or 14-day daily forecast
 */
export const getDailyForecast = asyncHandler(async (req, res) => {
  const { lat, lon, city, days, units, provider } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    city: city || normalized.city || 'San Francisco',
    days: days ? parseInt(days, 10) : 7,
    units: units || 'F',
    provider,
  };

  const forecast = await weatherService.getDailyForecast(queryParams);
  return ApiResponse.success(res, forecast);
});

/**
 * GET /api/weather/air-quality
 * Retrieves air quality index and pollutant breakdowns
 */
export const getAirQuality = asyncHandler(async (req, res) => {
  const { lat, lon, city, provider } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    city: city || normalized.city || 'San Francisco',
    provider,
  };

  const airQualityData = await weatherService.getAirQuality(queryParams);
  return ApiResponse.success(res, airQualityData);
});

/**
 * GET /api/weather/sun
 * Retrieves sunrise, sunset, and solar position
 */
export const getSunSchedule = asyncHandler(async (req, res) => {
  const { lat, lon, city, date, provider } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    city: city || normalized.city || 'San Francisco',
    date,
    provider,
  };

  const sunData = await weatherService.getSunSchedule(queryParams);
  return ApiResponse.success(res, sunData);
});

/**
 * GET /api/weather/radar
 * Retrieves radar layer metadata, timestamps, and tile URL template
 */
export const getRadarData = asyncHandler(async (req, res) => {
  const { lat, lon, zoom, layer, provider } = req.query;
  const normalized = req.normalizedLocation || {};

  const queryParams = {
    lat: lat !== undefined ? parseFloat(lat) : normalized.latitude || 37.7749,
    lon: lon !== undefined ? parseFloat(lon) : normalized.longitude || -122.4194,
    zoom: zoom ? parseInt(zoom, 10) : 6,
    layer: layer || 'precipitation',
    provider,
  };

  const radarData = await weatherService.getRadarData(queryParams);
  return ApiResponse.success(res, radarData);
});

export default {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getAirQuality,
  getSunSchedule,
  getRadarData,
};
