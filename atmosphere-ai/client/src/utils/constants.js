export const APP_CONFIG = {
  name: 'Atmosphere AI',
  tagline: 'Live Weather Assistant',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  defaultLocation: {
    city: 'San Francisco',
    region: 'CA',
    temp: 68,
    unit: 'F',
    condition: 'Partly Cloudy',
  },
  refreshInterval: 60000, // 1 minute
};

export const NAVIGATION_ITEMS = [
  { id: 'today', label: 'Today', icon: 'Calendar', active: true },
  { id: 'radar', label: 'Rain Radar', icon: 'Compass', badge: 'Live' },
  { id: 'air-health', label: 'Air & Health', icon: 'Wind' },
  { id: 'forecast-7d', label: '7-Day Forecast', icon: 'CalendarDays' },
  { id: 'sun-moon', label: 'Sun & Moon', icon: 'Sun' },
  { id: 'assistant', label: 'Weather Assistant', icon: 'Bot', aiBadge: true },
];

export const RADAR_MODES = [
  { id: 'rain', label: 'Rain' },
  { id: 'wind', label: 'Wind' },
  { id: 'clouds', label: 'Clouds' },
];
