import ApiError from '../utils/apiError.js';

/**
 * Middleware factory or helper functions to validate request query / body / params.
 */

/**
 * Validate weather location coordinates or query parameters
 */
export const validateWeatherParams = (req, res, next) => {
  const { lat, lon, latitude, longitude, city, name } = req.query;

  // If a city name is provided, that's valid
  if (city || name) {
    return next();
  }

  // Otherwise, require valid lat/lon coordinates
  const latitudeVal = lat !== undefined ? lat : latitude;
  const longitudeVal = lon !== undefined ? lon : longitude;

  if (latitudeVal === undefined || longitudeVal === undefined) {
    throw ApiError.badRequest(
      'Missing location parameters. Provide either lat and lon coordinates (e.g. ?lat=37.77&lon=-122.41) or a city parameter (e.g. ?city=San+Francisco).',
      null,
      'INVALID_LOCATION_PARAMS'
    );
  }

  const parsedLat = parseFloat(latitudeVal);
  const parsedLon = parseFloat(longitudeVal);

  if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
    throw ApiError.badRequest(
      'Invalid latitude value. Latitude must be a number between -90 and 90 degrees.',
      { received: latitudeVal },
      'INVALID_LATITUDE'
    );
  }

  if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
    throw ApiError.badRequest(
      'Invalid longitude value. Longitude must be a number between -180 and 180 degrees.',
      { received: longitudeVal },
      'INVALID_LONGITUDE'
    );
  }

  // Attach normalized parsed values onto req
  req.normalizedLocation = {
    latitude: parsedLat,
    longitude: parsedLon,
    city: city || name || null,
  };

  next();
};

/**
 * Validate POST /api/locations body
 */
export const validateCreateLocation = (req, res, next) => {
  const { name, city, latitude, longitude, lat, lon } = req.body || {};

  const locationName = name || city;
  const latVal = latitude !== undefined ? latitude : lat;
  const lonVal = longitude !== undefined ? longitude : lon;

  if (!locationName || typeof locationName !== 'string' || !locationName.trim()) {
    throw ApiError.badRequest('Location name or city is required', null, 'MISSING_CITY_NAME');
  }

  if (latVal === undefined || lonVal === undefined) {
    throw ApiError.badRequest('Latitude and longitude coordinates are required', null, 'MISSING_COORDINATES');
  }

  const parsedLat = parseFloat(latVal);
  const parsedLon = parseFloat(lonVal);

  if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
    throw ApiError.badRequest('Latitude must be a valid number between -90 and 90 degrees', { received: latVal });
  }

  if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
    throw ApiError.badRequest('Longitude must be a valid number between -180 and 180 degrees', { received: lonVal });
  }

  req.validatedBody = {
    name: locationName.trim(),
    city: locationName.trim(),
    region: req.body.region || '',
    country: req.body.country || 'US',
    latitude: parsedLat,
    longitude: parsedLon,
    timezone: req.body.timezone || 'UTC',
    isDefault: Boolean(req.body.isDefault),
  };

  next();
};

/**
 * Validate route parameter ID
 */
export const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!id || !id.trim()) {
    throw ApiError.badRequest('Resource ID parameter is required', null, 'MISSING_ID');
  }

  next();
};

export default {
  validateWeatherParams,
  validateCreateLocation,
  validateIdParam,
};
