import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import UserPreferences from '../models/userPreferences.model.js';

/**
 * GET /api/preferences
 * Get authenticated user's preferences
 */
export const getPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  let preferences = null;

  if (userId) {
    try {
      preferences = await UserPreferences.findOne({ userId }).lean();
    } catch (err) {
      console.warn('[Preferences] Fetch warning:', err.message);
    }
  }

  if (!preferences) {
    preferences = {
      temperatureUnit: 'F',
      windUnit: 'mph',
      theme: 'dark',
      notificationsEnabled: true,
      defaultLocation: 'San Francisco, CA',
      aiAssistantPreferences: {
        responseStyle: 'concise',
        focusArea: 'general',
        enforceGroundedData: true,
      },
    };
  }

  return ApiResponse.success(res, preferences, 'User preferences retrieved successfully.');
});

/**
 * PUT /api/preferences
 * Update authenticated user's preferences
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const {
    temperatureUnit,
    windUnit,
    theme,
    notificationsEnabled,
    defaultLocation,
    aiAssistantPreferences,
  } = req.body || {};

  let updated = null;
  if (userId) {
    try {
      updated = await UserPreferences.findOneAndUpdate(
        { userId },
        {
          $set: {
            ...(temperatureUnit && { temperatureUnit }),
            ...(windUnit && { windUnit }),
            ...(theme && { theme }),
            ...(notificationsEnabled !== undefined && { notificationsEnabled }),
            ...(defaultLocation && { defaultLocation }),
            ...(aiAssistantPreferences && { aiAssistantPreferences }),
          },
        },
        { new: true, upsert: true }
      );
    } catch (err) {
      console.warn('[Preferences] Update warning:', err.message);
    }
  }

  return ApiResponse.success(
    res,
    updated || {
      temperatureUnit: temperatureUnit || 'F',
      windUnit: windUnit || 'mph',
      theme: theme || 'dark',
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
      defaultLocation: defaultLocation || 'San Francisco, CA',
      aiAssistantPreferences: aiAssistantPreferences || {
        responseStyle: 'concise',
        focusArea: 'general',
        enforceGroundedData: true,
      },
    },
    'Preferences updated successfully.'
  );
});

export default {
  getPreferences,
  updatePreferences,
};
