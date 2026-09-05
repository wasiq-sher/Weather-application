import React, { createContext, useContext, useState, useEffect } from 'react';
import locationService, { normalizeLocation } from '../services/locationService.js';
import authService from '../services/authService.js';
import preferencesService from '../services/preferencesService.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('today');
  const [radarLayer, setRadarLayer] = useState('rain');
  const [isRadarLive, setIsRadarLive] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState(() => authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  // Preferences state
  const [preferences, setPreferences] = useState(() => preferencesService.getLocalPreferences());
  const [unit, setUnitState] = useState(() => preferences.temperatureUnit || 'F');

  // Sync active location
  const [activeLocation, setActiveLocationState] = useState(() => {
    const saved = locationService.getActiveLocation();
    if (saved) return saved;
    const defLoc = preferences.defaultLocation;
    return typeof defLoc === 'object' && defLoc?.name
      ? normalizeLocation(defLoc)
      : {
          id: 'san-francisco',
          name: 'San Francisco',
          city: 'San Francisco',
          region: 'CA',
          country: 'United States',
          latitude: 37.7749,
          longitude: -122.4194,
          lat: 37.7749,
          lon: -122.4194,
          timezone: 'America/Los_Angeles',
          localTime: '12:45 PM PST',
          fullTime: '12:45 PM PST',
          condition: 'Sunny & Mild',
        };
  });

  // Apply visual theme to document HTML/body element
  useEffect(() => {
    const currentTheme = preferences.theme || 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(currentTheme);
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(currentTheme);
    }
  }, [preferences.theme]);

  // Load and sync user profile and preferences on mount / auth change
  useEffect(() => {
    if (isAuthenticated) {
      authService
        .getMe()
        .then((res) => {
          const fetchedUser = res?.user || res?.data?.user;
          if (fetchedUser) {
            setUser(fetchedUser);
          }
        })
        .catch(() => {
          // Token invalid
        });

      // Synchronize guest preferences with MongoDB for logged in user
      preferencesService
        .syncPreferencesOnLogin()
        .then((synced) => {
          setPreferences(synced);
          if (synced.temperatureUnit) setUnitState(synced.temperatureUnit);
        })
        .catch((err) => {
          console.warn('[AppContext] Preferences sync error:', err.message);
        });
    } else {
      // Guest mode: load local preferences
      const local = preferencesService.getLocalPreferences();
      setPreferences(local);
      if (local.temperatureUnit) setUnitState(local.temperatureUnit);
    }
  }, [isAuthenticated]);

  const updatePreferences = async (newPartial) => {
    const updated = {
      ...preferences,
      ...newPartial,
      aiAssistantPreferences: {
        ...preferences.aiAssistantPreferences,
        ...(newPartial.aiAssistantPreferences || {}),
      },
    };

    setPreferences(updated);
    if (updated.temperatureUnit) {
      setUnitState(updated.temperatureUnit);
    }

    // Persist to MongoDB if authenticated, or localStorage if guest
    await preferencesService.saveUserPreferences(updated, isAuthenticated);
    return updated;
  };

  const setUnit = (newUnit) => {
    setUnitState(newUnit);
    updatePreferences({ temperatureUnit: newUnit });
  };

  const toggleUnit = () => {
    const nextUnit = unit === 'F' ? 'C' : 'F';
    setUnit(nextUnit);
  };

  const setActiveLocation = (loc) => {
    if (!loc) return;
    const normalized = typeof loc === 'function' ? loc(activeLocation) : normalizeLocation(loc);
    locationService.setActiveLocation(normalized);
    setActiveLocationState(normalized);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const value = {
    activeTab,
    setActiveTab,
    unit,
    setUnit,
    toggleUnit,
    preferences,
    updatePreferences,
    radarLayer,
    setRadarLayer,
    isRadarLive,
    setIsRadarLive,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebarCollapse,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
    activeLocation,
    setActiveLocation,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
