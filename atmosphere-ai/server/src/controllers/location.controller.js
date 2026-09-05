import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import locationService from '../services/location.service.js';

/**
 * Controller handling saved location management endpoints
 */

/**
 * GET /api/locations
 * List saved locations for authenticated user
 */
export const getLocations = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const userId = req.user?.id || null;
  const locations = await locationService.getLocations({ q, userId });
  return ApiResponse.success(res, {
    count: locations.length,
    locations,
  });
});

/**
 * POST /api/locations
 * Create a new saved location for authenticated user
 */
export const createLocation = asyncHandler(async (req, res) => {
  const payload = req.validatedBody || req.body;
  const userId = req.user?.id || null;
  const createdLocation = await locationService.createLocation({
    ...payload,
    userId,
  });
  return ApiResponse.created(res, createdLocation);
});

/**
 * DELETE /api/locations/:id
 * Delete a saved location by ID
 */
export const deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const deleted = await locationService.deleteLocation(id, userId);

  if (!deleted) {
    throw ApiError.notFound(`Location with ID '${id}' was not found or does not belong to you.`, null, 'LOCATION_NOT_FOUND');
  }

  return ApiResponse.success(res, {
    message: 'Location deleted successfully',
    id,
  });
});

export default {
  getLocations,
  createLocation,
  deleteLocation,
};
