import { useQuery } from '@tanstack/react-query';
import {
  fetchLocations,
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchDailyForecast,
  fetchAirHealth,
  fetchSunMoon,
  fetchAlerts,
} from '../data/mockWeatherData.js';

const getLocKey = (loc) => {
  if (!loc) return 'san-francisco';
  if (typeof loc === 'string') return loc;
  return `${loc.id || 'loc'}-${loc.latitude ?? loc.lat ?? 0}-${loc.longitude ?? loc.lon ?? 0}`;
};

export const WEATHER_QUERY_KEYS = {
  locations: ['weather', 'locations'],
  current: (loc) => ['weather', 'current', getLocKey(loc)],
  hourly: (loc) => ['weather', 'hourly', getLocKey(loc)],
  daily: (loc) => ['weather', 'daily', getLocKey(loc)],
  airHealth: (loc) => ['weather', 'airHealth', getLocKey(loc)],
  sunMoon: (loc) => ['weather', 'sunMoon', getLocKey(loc)],
  alerts: (loc) => ['weather', 'alerts', getLocKey(loc)],
};

export function useLocationsQuery() {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.locations,
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCurrentWeatherQuery(location = 'san-francisco') {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.current(location),
    queryFn: () => fetchCurrentWeather(location),
    staleTime: 1000 * 60 * 2,
  });
}

export function useHourlyForecastQuery(location = 'san-francisco') {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.hourly(location),
    queryFn: () => fetchHourlyForecast(location),
    staleTime: 1000 * 60 * 3,
  });
}

export function useDailyForecastQuery(location = 'san-francisco') {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.daily(location),
    queryFn: () => fetchDailyForecast(location),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAirHealthQuery(location = 'san-francisco') {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.airHealth(location),
    queryFn: () => fetchAirHealth(location),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSunMoonQuery(location = 'san-francisco') {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.sunMoon(location),
    queryFn: () => fetchSunMoon(location),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAlertsQuery(location = 'san-francisco') {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.alerts(location),
    queryFn: () => fetchAlerts(location),
    staleTime: 1000 * 60 * 2,
  });
}
