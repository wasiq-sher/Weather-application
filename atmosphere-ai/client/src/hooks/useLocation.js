import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import locationService, { normalizeLocation } from '../services/locationService.js';

/**
 * useLocation Hook
 * 
 * Centralized React hook providing state and operations for:
 * - Detecting current user position via HTML5 Geolocation & Reverse Geocoding
 * - Searching cities with instant filtering or geocoding
 * - Adding, saving, and removing locations
 * - Selecting the active meteorological station
 * - Managing favorite locations
 * 
 * Ensures all locations adhere to the 5 core stored fields:
 * - city
 * - country
 * - latitude
 * - longitude
 * - timezone
 */
export function useLocation() {
  const appContext = useApp();
  const [locations, setLocations] = useState(() => locationService.getSavedLocations());
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Synchronize with AppContext activeLocation
  const activeLocation = useMemo(() => {
    return appContext?.activeLocation
      ? normalizeLocation(appContext.activeLocation)
      : locationService.getActiveLocation();
  }, [appContext?.activeLocation]);

  // Derived favorites list
  const favorites = useMemo(() => {
    return locations.filter((loc) => loc.isFavorite);
  }, [locations]);

  // Refresh saved locations from service
  const refreshLocations = useCallback(() => {
    const updated = locationService.getSavedLocations();
    setLocations(updated);
    return updated;
  }, []);

  /**
   * Select an active location across the entire application
   */
  const selectLocation = useCallback(
    (location) => {
      const normalized = normalizeLocation(location);
      locationService.setActiveLocation(normalized);
      if (appContext?.setActiveLocation) {
        appContext.setActiveLocation(normalized);
      }
      return normalized;
    },
    [appContext]
  );

  /**
   * Add a new location to saved locations
   */
  const addLocation = useCallback(
    (locationData, options = { selectImmediately: true, isFavorite: false }) => {
      const dataToSave = {
        ...locationData,
        isFavorite: options.isFavorite !== undefined ? options.isFavorite : Boolean(locationData.isFavorite),
      };

      const saved = locationService.saveLocation(dataToSave);
      const updatedList = refreshLocations();

      if (options.selectImmediately) {
        selectLocation(saved);
      }

      return { saved, updatedList };
    },
    [refreshLocations, selectLocation]
  );

  /**
   * Remove a saved location by ID
   */
  const removeLocation = useCallback(
    (locationId) => {
      const remaining = locationService.removeLocation(locationId);
      setLocations(remaining);

      // If removed location was currently active, fall back to another location
      if (activeLocation?.id === locationId) {
        const nextActive = remaining[0] || locationService.getSavedLocations()[0];
        if (nextActive) {
          selectLocation(nextActive);
        }
      }

      return remaining;
    },
    [activeLocation?.id, selectLocation]
  );

  /**
   * Toggle favorite status of a location
   */
  const toggleFavorite = useCallback(
    (locationId) => {
      const { updated, isFavorite } = locationService.toggleFavorite(locationId);
      setLocations(updated);

      // If current active location is the one toggled, update context state
      if (activeLocation?.id === locationId && appContext?.setActiveLocation) {
        appContext.setActiveLocation((prev) => ({
          ...prev,
          isFavorite,
        }));
      }

      return { updated, isFavorite };
    },
    [activeLocation?.id, appContext]
  );

  /**
   * Check if a location is marked as favorite
   */
  const isFavorite = useCallback(
    (locationId) => {
      return locations.some((loc) => loc.id === locationId && loc.isFavorite);
    },
    [locations]
  );

  /**
   * Detect current position using GPS & Reverse Geocoding
   */
  const detectLocation = useCallback(
    async (options = { addAndSelect: true }) => {
      setIsDetecting(true);
      setDetectionError(null);

      try {
        const detected = await locationService.detectCurrentLocation();
        
        if (options.addAndSelect) {
          addLocation(detected, { selectImmediately: true, isFavorite: false });
        }

        setIsDetecting(false);
        return { success: true, location: detected };
      } catch (err) {
        setIsDetecting(false);
        setDetectionError(err.message || 'Failed to detect current location.');
        return { success: false, error: err.message };
      }
    },
    [addLocation]
  );

  /**
   * Search for cities/stations by name, country, or coordinates
   */
  const search = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query || !query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }

    setIsSearching(true);
    try {
      const results = await locationService.search(query);
      setSearchResults(results);
      setIsSearching(false);
      return results;
    } catch (err) {
      console.error('Location search error:', err);
      setSearchResults([]);
      setIsSearching(false);
      return [];
    }
  }, []);

  /**
   * Clear active search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'atmosphere_saved_locations_v1') {
        refreshLocations();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshLocations]);

  return {
    locations,
    activeLocation,
    favorites,
    isDetecting,
    detectionError,
    setDetectionError,
    searchQuery,
    searchResults,
    isSearching,
    selectLocation,
    addLocation,
    removeLocation,
    toggleFavorite,
    isFavorite,
    detectLocation,
    search,
    clearSearch,
    refreshLocations,
  };
}

export default useLocation;
