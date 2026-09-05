import { apiClient } from './apiClient.js';

export const LOCAL_STORAGE_KEY = 'atmosphere_guest_preferences';

export const DEFAULT_PREFERENCES = {
  temperatureUnit: 'F', // 'F' | 'C'
  windUnit: 'mph', // 'mph' | 'km/h'
  theme: 'dark', // 'dark' | 'light'
  notificationsEnabled: true,
  defaultLocation: {
    id: 'san-francisco',
    name: 'San Francisco',
    city: 'San Francisco',
    region: 'CA',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  aiAssistantPreferences: {
    responseStyle: 'concise', // 'concise' | 'detailed'
    focusArea: 'general', // 'general' | 'clothing' | 'outdoor' | 'commute'
    enforceGroundedData: true,
  },
};

/**
 * Get guest preferences from local storage
 */
export function getLocalPreferences() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      aiAssistantPreferences: {
        ...DEFAULT_PREFERENCES.aiAssistantPreferences,
        ...(parsed.aiAssistantPreferences || {}),
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save guest preferences to local storage
 */
export function saveLocalPreferences(prefs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn('[PreferencesService] Failed to save local preferences:', err);
  }
}

/**
 * Fetch preferences from backend (for authenticated users) or fall back to local
 */
export async function fetchUserPreferences(isAuthenticated = false) {
  const localPrefs = getLocalPreferences();

  if (!isAuthenticated) {
    return localPrefs;
  }

  try {
    const res = await apiClient.get('/preferences');
    const remoteData = res?.data || res;

    if (remoteData && typeof remoteData === 'object') {
      const merged = {
        ...localPrefs,
        temperatureUnit: remoteData.temperatureUnit || localPrefs.temperatureUnit,
        windUnit: remoteData.windUnit || localPrefs.windUnit,
        theme: remoteData.theme || localPrefs.theme,
        notificationsEnabled:
          remoteData.notificationsEnabled !== undefined
            ? remoteData.notificationsEnabled
            : localPrefs.notificationsEnabled,
        defaultLocation: remoteData.defaultLocation || localPrefs.defaultLocation,
        aiAssistantPreferences: {
          ...localPrefs.aiAssistantPreferences,
          ...(remoteData.aiAssistantPreferences || {}),
        },
      };

      // Keep local cache up to date
      saveLocalPreferences(merged);
      return merged;
    }
  } catch (err) {
    console.warn('[PreferencesService] Remote fetch failed, falling back to local:', err.message);
  }

  return localPrefs;
}

/**
 * Save preferences both locally and to MongoDB (if authenticated)
 */
export async function saveUserPreferences(prefs, isAuthenticated = false) {
  // Always update local guest state
  saveLocalPreferences(prefs);

  if (isAuthenticated) {
    try {
      const res = await apiClient.put('/preferences', prefs);
      return res?.data || res;
    } catch (err) {
      console.warn('[PreferencesService] Remote save failed:', err.message);
    }
  }

  return prefs;
}

/**
 * Synchronize local guest settings with MongoDB upon login
 */
export async function syncPreferencesOnLogin() {
  const localPrefs = getLocalPreferences();

  try {
    // 1. Fetch user's existing remote preferences from MongoDB
    const res = await apiClient.get('/preferences');
    const remoteData = res?.data || res;

    if (remoteData && typeof remoteData === 'object' && remoteData.createdAt) {
      // User has existing saved MongoDB preferences -> load & update local cache
      const merged = {
        ...localPrefs,
        temperatureUnit: remoteData.temperatureUnit || localPrefs.temperatureUnit,
        windUnit: remoteData.windUnit || localPrefs.windUnit,
        theme: remoteData.theme || localPrefs.theme,
        notificationsEnabled:
          remoteData.notificationsEnabled !== undefined
            ? remoteData.notificationsEnabled
            : localPrefs.notificationsEnabled,
        defaultLocation: remoteData.defaultLocation || localPrefs.defaultLocation,
        aiAssistantPreferences: {
          ...localPrefs.aiAssistantPreferences,
          ...(remoteData.aiAssistantPreferences || {}),
        },
      };
      saveLocalPreferences(merged);
      return merged;
    } else {
      // First time user login -> push current guest preferences to MongoDB
      await apiClient.put('/preferences', localPrefs);
      return localPrefs;
    }
  } catch (err) {
    console.warn('[PreferencesService] Login sync error:', err.message);
    return localPrefs;
  }
}

export default {
  DEFAULT_PREFERENCES,
  getLocalPreferences,
  saveLocalPreferences,
  fetchUserPreferences,
  saveUserPreferences,
  syncPreferencesOnLogin,
};
