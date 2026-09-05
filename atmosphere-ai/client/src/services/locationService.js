/**
 * Atmosphere AI - Location Management & Geocoding Service
 * 
 * Provides location persistence, GPS detection, and a pluggable Geocoding API architecture.
 * 
 * Stores the 5 core meteorological coordinates:
 * - city
 * - country
 * - latitude
 * - longitude
 * - timezone
 * 
 * Geocoding Architecture:
 * - BaseGeocodingProvider: Standardized contract for geocoding services.
 * - MockGeocodingProvider: High-fidelity mock geocoding database for immediate prototype operation.
 * - ServerProxyGeocodingProvider: Production adapter configured to query server-side geocoding
 *   routes (/api/geocoding/search, /api/geocoding/reverse).
 *   CRITICAL SECURITY NOTICE: API keys and secrets are strictly kept on the server side
 *   and never exposed to the frontend browser client.
 */

const STORAGE_KEYS = {
  LOCATIONS: 'atmosphere_saved_locations_v1',
  ACTIVE_LOCATION: 'atmosphere_active_location_v1',
  FAVORITES: 'atmosphere_favorite_ids_v1',
};

// Preset default meteorological observation stations
export const DEFAULT_PRESET_LOCATIONS = [
  {
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
    isDefault: true,
    isFavorite: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'new-york',
    name: 'New York',
    city: 'New York',
    region: 'NY',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    lat: 40.7128,
    lon: -74.0060,
    timezone: 'America/New_York',
    localTime: '3:45 PM EST',
    isDefault: false,
    isFavorite: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'london',
    name: 'London',
    city: 'London',
    region: 'England',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    lat: 51.5074,
    lon: -0.1278,
    timezone: 'Europe/London',
    localTime: '8:45 PM GMT',
    isDefault: false,
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    city: 'Tokyo',
    region: 'Kanto',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    lat: 35.6762,
    lon: 139.6503,
    timezone: 'Asia/Tokyo',
    localTime: '5:45 AM JST',
    isDefault: false,
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'sydney',
    name: 'Sydney',
    city: 'Sydney',
    region: 'NSW',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    lat: -33.8688,
    lon: 151.2093,
    timezone: 'Australia/Sydney',
    localTime: '6:45 AM AEST',
    isDefault: false,
    isFavorite: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// Rich presets grouped by country for quick addition and discovery
export const COUNTRY_STATION_PRESETS = {
  'Pakistan': [
    { city: 'Karachi', region: 'Sindh', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
    { city: 'Lahore', region: 'Punjab', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi' },
    { city: 'Islamabad', region: 'Federal Capital', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },
    { city: 'Rawalpindi', region: 'Punjab', country: 'Pakistan', latitude: 33.5651, longitude: 73.0169, timezone: 'Asia/Karachi' },
    { city: 'Faisalabad', region: 'Punjab', country: 'Pakistan', latitude: 31.4504, longitude: 73.1350, timezone: 'Asia/Karachi' },
    { city: 'Multan', region: 'Punjab', country: 'Pakistan', latitude: 30.1575, longitude: 71.5249, timezone: 'Asia/Karachi' },
    { city: 'Peshawar', region: 'Khyber Pakhtunkhwa', country: 'Pakistan', latitude: 34.0151, longitude: 71.5249, timezone: 'Asia/Karachi' },
    { city: 'Quetta', region: 'Balochistan', country: 'Pakistan', latitude: 30.1798, longitude: 66.9750, timezone: 'Asia/Karachi' },
    { city: 'Sialkot', region: 'Punjab', country: 'Pakistan', latitude: 32.4945, longitude: 74.5229, timezone: 'Asia/Karachi' },
    { city: 'Gujranwala', region: 'Punjab', country: 'Pakistan', latitude: 32.1877, longitude: 74.1945, timezone: 'Asia/Karachi' },
    { city: 'Hyderabad', region: 'Sindh', country: 'Pakistan', latitude: 25.3960, longitude: 68.3578, timezone: 'Asia/Karachi' },
    { city: 'Murree', region: 'Punjab', country: 'Pakistan', latitude: 33.9070, longitude: 73.3943, timezone: 'Asia/Karachi' },
    { city: 'Gwadar', region: 'Balochistan', country: 'Pakistan', latitude: 25.1264, longitude: 62.3225, timezone: 'Asia/Karachi' },
    { city: 'Gilgit', region: 'Gilgit-Baltistan', country: 'Pakistan', latitude: 35.9221, longitude: 74.3087, timezone: 'Asia/Karachi' },
  ],
  'United States': [
    { city: 'San Francisco', region: 'CA', country: 'United States', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
    { city: 'New York', region: 'NY', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
    { city: 'Seattle', region: 'WA', country: 'United States', latitude: 47.6062, longitude: -122.3321, timezone: 'America/Los_Angeles' },
    { city: 'Chicago', region: 'IL', country: 'United States', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
    { city: 'Miami', region: 'FL', country: 'United States', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
    { city: 'Austin', region: 'TX', country: 'United States', latitude: 30.2672, longitude: -97.7431, timezone: 'America/Chicago' },
  ],
  'United Kingdom': [
    { city: 'London', region: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
    { city: 'Manchester', region: 'England', country: 'United Kingdom', latitude: 53.4808, longitude: -2.2426, timezone: 'Europe/London' },
    { city: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', latitude: 55.9533, longitude: -3.1883, timezone: 'Europe/London' },
    { city: 'Birmingham', region: 'England', country: 'United Kingdom', latitude: 52.4862, longitude: -1.8904, timezone: 'Europe/London' },
  ],
  'United Arab Emirates': [
    { city: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
    { city: 'Abu Dhabi', region: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
    { city: 'Sharjah', region: 'Sharjah', country: 'United Arab Emirates', latitude: 25.3463, longitude: 55.4209, timezone: 'Asia/Dubai' },
  ],
  'Saudi Arabia': [
    { city: 'Riyadh', region: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
    { city: 'Jeddah', region: 'Makkah', country: 'Saudi Arabia', latitude: 21.5433, longitude: 39.1728, timezone: 'Asia/Riyadh' },
    { city: 'Mecca', region: 'Makkah', country: 'Saudi Arabia', latitude: 21.3891, longitude: 39.8579, timezone: 'Asia/Riyadh' },
    { city: 'Medina', region: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
  ],
  'India': [
    { city: 'New Delhi', region: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
    { city: 'Mumbai', region: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
    { city: 'Bengaluru', region: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
    { city: 'Kolkata', region: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  ],
  'Canada': [
    { city: 'Toronto', region: 'ON', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
    { city: 'Vancouver', region: 'BC', country: 'Canada', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver' },
    { city: 'Montreal', region: 'QC', country: 'Canada', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Toronto' },
  ],
  'Australia': [
    { city: 'Sydney', region: 'NSW', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
    { city: 'Melbourne', region: 'VIC', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
    { city: 'Brisbane', region: 'QLD', country: 'Australia', latitude: -27.4698, longitude: 153.0251, timezone: 'Australia/Brisbane' },
  ],
};

// Flattened list of presets for catalog indexing
const FLATTENED_COUNTRY_PRESETS = Object.entries(COUNTRY_STATION_PRESETS).flatMap(([country, cities]) =>
  cities.map((c) => ({
    id: `${c.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${country.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: c.city,
    ...c,
    lat: c.latitude,
    lon: c.longitude,
  }))
);

// Rich global city catalog for mock geocoding results
export const MOCK_CITY_CATALOG = [
  ...DEFAULT_PRESET_LOCATIONS,
  ...FLATTENED_COUNTRY_PRESETS,
  {
    id: 'paris',
    name: 'Paris',
    city: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    lat: 48.8566,
    lon: 2.3522,
    timezone: 'Europe/Paris',
    localTime: '9:45 PM CET',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    city: 'Berlin',
    region: 'Berlin',
    country: 'Germany',
    latitude: 52.5200,
    longitude: 13.4050,
    lat: 52.5200,
    lon: 13.4050,
    timezone: 'Europe/Berlin',
    localTime: '9:45 PM CET',
  },
  {
    id: 'seattle',
    name: 'Seattle',
    city: 'Seattle',
    region: 'WA',
    country: 'United States',
    latitude: 47.6062,
    longitude: -122.3321,
    lat: 47.6062,
    lon: -122.3321,
    timezone: 'America/Los_Angeles',
    localTime: '12:45 PM PST',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    city: 'Los Angeles',
    region: 'CA',
    country: 'United States',
    latitude: 34.0522,
    longitude: -118.2437,
    lat: 34.0522,
    lon: -118.2437,
    timezone: 'America/Los_Angeles',
    localTime: '12:45 PM PST',
  },
  {
    id: 'chicago',
    name: 'Chicago',
    city: 'Chicago',
    region: 'IL',
    country: 'United States',
    latitude: 41.8781,
    longitude: -87.6298,
    lat: 41.8781,
    lon: -87.6298,
    timezone: 'America/Chicago',
    localTime: '2:45 PM CST',
  },
  {
    id: 'miami',
    name: 'Miami',
    city: 'Miami',
    region: 'FL',
    country: 'United States',
    latitude: 25.7617,
    longitude: -80.1918,
    lat: 25.7617,
    lon: -80.1918,
    timezone: 'America/New_York',
    localTime: '3:45 PM EST',
  },
  {
    id: 'toronto',
    name: 'Toronto',
    city: 'Toronto',
    region: 'ON',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    lat: 43.6532,
    lon: -79.3832,
    timezone: 'America/Toronto',
    localTime: '3:45 PM EST',
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    city: 'Vancouver',
    region: 'BC',
    country: 'Canada',
    latitude: 49.2827,
    longitude: -123.1207,
    lat: 49.2827,
    lon: -123.1207,
    timezone: 'America/Vancouver',
    localTime: '12:45 PM PST',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    city: 'Singapore',
    region: 'Central',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    lat: 1.3521,
    lon: 103.8198,
    timezone: 'Asia/Singapore',
    localTime: '4:45 AM SGT',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
    lat: 25.2048,
    lon: 55.2708,
    timezone: 'Asia/Dubai',
    localTime: '12:45 AM GST',
  },
  {
    id: 'seoul',
    name: 'Seoul',
    city: 'Seoul',
    region: 'Gyeonggi',
    country: 'South Korea',
    latitude: 37.5665,
    longitude: 126.9780,
    lat: 37.5665,
    lon: 126.9780,
    timezone: 'Asia/Seoul',
    localTime: '5:45 AM KST',
  },
  {
    id: 'rome',
    name: 'Rome',
    city: 'Rome',
    region: 'Lazio',
    country: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
    lat: 41.9028,
    lon: 12.4964,
    timezone: 'Europe/Rome',
    localTime: '9:45 PM CET',
  },
  {
    id: 'madrid',
    name: 'Madrid',
    city: 'Madrid',
    region: 'Community of Madrid',
    country: 'Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    lat: 40.4168,
    lon: -3.7038,
    timezone: 'Europe/Madrid',
    localTime: '9:45 PM CET',
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    city: 'Amsterdam',
    region: 'North Holland',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    lat: 52.3676,
    lon: 4.9041,
    timezone: 'Europe/Amsterdam',
    localTime: '9:45 PM CET',
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    city: 'Melbourne',
    region: 'VIC',
    country: 'Australia',
    latitude: -37.8136,
    longitude: 144.9631,
    lat: -37.8136,
    lon: 144.9631,
    timezone: 'Australia/Melbourne',
    localTime: '6:45 AM AEST',
  },
  {
    id: 'auckland',
    name: 'Auckland',
    city: 'Auckland',
    region: 'Auckland',
    country: 'New Zealand',
    latitude: -36.8485,
    longitude: 174.7633,
    lat: -36.8485,
    lon: 174.7633,
    timezone: 'Pacific/Auckland',
    localTime: '8:45 AM NZST',
  },
  {
    id: 'mexico-city',
    name: 'Mexico City',
    city: 'Mexico City',
    region: 'CDMX',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    lat: 19.4326,
    lon: -99.1332,
    timezone: 'America/Mexico_City',
    localTime: '1:45 PM CST',
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    city: 'São Paulo',
    region: 'SP',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
    lat: -23.5505,
    lon: -46.6333,
    timezone: 'America/Sao_Paulo',
    localTime: '4:45 PM BRT',
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    city: 'Buenos Aires',
    region: 'CABA',
    country: 'Argentina',
    latitude: -34.6037,
    longitude: -58.3816,
    lat: -34.6037,
    lon: -58.3816,
    timezone: 'America/Argentina/Buenos_Aires',
    localTime: '4:45 PM ART',
  },
  {
    id: 'cairo',
    name: 'Cairo',
    city: 'Cairo',
    region: 'Cairo Governorate',
    country: 'Egypt',
    latitude: 30.0444,
    longitude: 31.2357,
    lat: 30.0444,
    lon: 31.2357,
    timezone: 'Africa/Cairo',
    localTime: '10:45 PM EEST',
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    city: 'Cape Town',
    region: 'Western Cape',
    country: 'South Africa',
    latitude: -33.9249,
    longitude: 18.4241,
    lat: -33.9249,
    lon: 18.4241,
    timezone: 'Africa/Johannesburg',
    localTime: '9:45 PM SAST',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    lat: 19.0760,
    lon: 72.8777,
    timezone: 'Asia/Kolkata',
    localTime: '1:15 AM IST',
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    city: 'Hong Kong',
    region: 'HK',
    country: 'Hong Kong',
    latitude: 22.3193,
    longitude: 114.1694,
    lat: 22.3193,
    lon: 114.1694,
    timezone: 'Asia/Hong_Kong',
    localTime: '4:45 AM HKT',
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    city: 'Stockholm',
    region: 'Stockholm County',
    country: 'Sweden',
    latitude: 59.3293,
    longitude: 18.0686,
    lat: 59.3293,
    lon: 18.0686,
    timezone: 'Europe/Stockholm',
    localTime: '9:45 PM CEST',
  },
];

/**
 * Normalizes any location input into the canonical schema storing:
 * - city
 * - country
 * - latitude
 * - longitude
 * - timezone
 */
export function normalizeLocation(raw = {}) {
  const city = raw.city || raw.name || 'San Francisco';
  const country = raw.country || 'United States';
  const latitude = typeof raw.latitude === 'number' ? raw.latitude : (typeof raw.lat === 'number' ? raw.lat : 37.7749);
  const longitude = typeof raw.longitude === 'number' ? raw.longitude : (typeof raw.lon === 'number' ? raw.lon : -122.4194);
  const timezone = raw.timezone || 'UTC';
  const region = raw.region || '';
  const id = raw.id || `${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.abs(Math.round(latitude))}`;

  return {
    id,
    city: city.trim(),
    name: city.trim(),
    region: region.trim(),
    country: country.trim(),
    latitude: Number(latitude.toFixed(4)),
    longitude: Number(longitude.toFixed(4)),
    lat: Number(latitude.toFixed(4)),
    lon: Number(longitude.toFixed(4)),
    timezone,
    localTime: raw.localTime || 'Live Sync',
    isDefault: Boolean(raw.isDefault),
    isFavorite: Boolean(raw.isFavorite),
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

/**
 * Calculates Haversine distance in kilometers between two geo-coordinates
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Base Geocoding Provider Interface
 */
export class BaseGeocodingProvider {
  async search(query) {
    throw new Error('search method must be implemented by GeocodingProvider');
  }

  async reverseGeocode(latitude, longitude) {
    throw new Error('reverseGeocode method must be implemented by GeocodingProvider');
  }
}

/**
 * MockGeocodingProvider
 * High-performance, zero-latency local catalog provider with fuzzy matching,
 * coordinate parsing, and nearest-station reverse geocoding.
 */
export class MockGeocodingProvider extends BaseGeocodingProvider {
  constructor(catalog = MOCK_CITY_CATALOG) {
    super();
    this.catalog = catalog;
  }

  async search(query = '') {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    // Check if query is coordinate format: "37.77, -122.41"
    const coordMatch = cleanQuery.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[3]);
      const reverse = await this.reverseGeocode(lat, lon);
      return [reverse];
    }

    // 1. Rank local catalog results
    const cleanLower = cleanQuery.toLowerCase();
    const localResults = [];
    for (const item of this.catalog) {
      const cityLower = item.city.toLowerCase();
      const countryLower = item.country.toLowerCase();
      const regionLower = (item.region || '').toLowerCase();

      let score = 0;
      if (cityLower === cleanLower) score = 100;
      else if (cityLower.startsWith(cleanLower)) score = 80;
      else if (cityLower.includes(cleanLower)) score = 60;
      else if (countryLower.startsWith(cleanLower)) score = 40;
      else if (countryLower.includes(cleanLower)) score = 30;
      else if (regionLower.includes(cleanLower)) score = 20;

      if (score > 0) {
        localResults.push({
          ...normalizeLocation(item),
          _score: score,
        });
      }
    }
    localResults.sort((a, b) => b._score - a._score);
    const localNormalized = localResults.map(({ _score, ...loc }) => loc);

    // 2. Query live Open-Meteo Geocoding API for global search (covers all cities, towns, provinces)
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.results)) {
          const apiResults = data.results.map((r) =>
            normalizeLocation({
              id: `geo-${(r.name + '-' + (r.country || '')).toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              name: r.name,
              city: r.name,
              region: r.admin1 || r.admin2 || '',
              country: r.country || '',
              latitude: r.latitude,
              longitude: r.longitude,
              lat: r.latitude,
              lon: r.longitude,
              timezone: r.timezone || 'UTC',
            })
          );

          // Merge local and API results avoiding duplicates
          const merged = [...localNormalized];
          for (const item of apiResults) {
            const alreadyIn = merged.some(
              (m) =>
                m.city.toLowerCase() === item.city.toLowerCase() &&
                m.country.toLowerCase() === item.country.toLowerCase()
            );
            if (!alreadyIn) {
              merged.push(item);
            }
          }
          return merged;
        }
      }
    } catch (e) {
      console.warn('[MockGeocodingProvider] Open-Meteo geocoding search failed, using local catalog:', e.message);
    }

    return localNormalized;
  }

  async reverseGeocode(latitude, longitude) {
    const lat = Number(latitude);
    const lon = Number(longitude);

    // Attempt live reverse geocoding via BigDataCloud client API (free, fast, no auth)
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && (data.city || data.locality || data.principalSubdivision)) {
          const cityName = data.city || data.locality || data.principalSubdivision;
          const regionName = data.principalSubdivision || '';
          const countryName = data.countryName || '';
          return normalizeLocation({
            id: `geo-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: `${cityName} (GPS)`,
            city: cityName,
            region: regionName,
            country: countryName,
            latitude: lat,
            longitude: lon,
            lat,
            lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            isGpsDetected: true,
          });
        }
      }
    } catch (e) {
      // Continue to catalog check
    }

    // Find closest city in catalog
    let closest = null;
    let minDistance = Infinity;

    for (const item of this.catalog) {
      const dist = calculateDistanceKm(lat, lon, item.latitude, item.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    }

    // If within 100km of a known city, return closest city with actual coordinates
    if (closest && minDistance <= 100) {
      return normalizeLocation({
        ...closest,
        id: `geo-${closest.city.toLowerCase()}`,
        latitude: lat,
        longitude: lon,
        lat,
        lon,
        name: `${closest.city} (GPS)`,
      });
    }

    // Otherwise generate coordinate-based station with estimated timezone
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    const tzOffsetHours = Math.round(lon / 15);
    const tzName = `UTC${tzOffsetHours >= 0 ? '+' : ''}${tzOffsetHours}`;

    return normalizeLocation({
      id: `station-${Math.abs(Math.round(lat))}${latDir}-${Math.abs(Math.round(lon))}${lonDir}`,
      city: `Station ${Math.abs(lat).toFixed(2)}°${latDir}`,
      name: `Station ${Math.abs(lat).toFixed(2)}°${latDir}`,
      region: `${Math.abs(lon).toFixed(2)}°${lonDir}`,
      country: closest ? closest.country : 'Global Coordinate',
      latitude: lat,
      longitude: lon,
      lat,
      lon,
      timezone: closest ? closest.timezone : tzName,
      localTime: 'Live GPS Telemetry',
    });
  }
}

/**
 * ServerProxyGeocodingProvider
 * Production-ready provider designed to hit backend proxy routes:
 * GET /api/geocoding/search?q={query}
 * GET /api/geocoding/reverse?lat={lat}&lon={lon}
 * 
 * SECURITY MANDATE:
 * Third-party geocoding API keys (Open-Meteo, Mapbox, Google Maps, Nominatim)
 * are NEVER bundled or exposed in client-side code. The Node/Express server
 * handles rate limiting, secret injection, and caching.
 * 
 * Includes transparent fallback to MockGeocodingProvider if the server route
 * is not yet provisioned.
 */
export class ServerProxyGeocodingProvider extends BaseGeocodingProvider {
  constructor(fallbackProvider = new MockGeocodingProvider()) {
    super();
    this.fallbackProvider = fallbackProvider;
    this.baseUrl = '/api/geocoding';
  }

  async search(query) {
    try {
      const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        // Fall back gracefully to mock provider
        return this.fallbackProvider.search(query);
      }
      const data = await res.json();
      if (Array.isArray(data?.results)) {
        return data.results.map(normalizeLocation);
      }
      return this.fallbackProvider.search(query);
    } catch {
      return this.fallbackProvider.search(query);
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      const res = await fetch(`${this.baseUrl}/reverse?lat=${latitude}&lon=${longitude}`);
      if (!res.ok) {
        return this.fallbackProvider.reverseGeocode(latitude, longitude);
      }
      const data = await res.json();
      if (data?.location) {
        return normalizeLocation(data.location);
      }
      return this.fallbackProvider.reverseGeocode(latitude, longitude);
    } catch {
      return this.fallbackProvider.reverseGeocode(latitude, longitude);
    }
  }
}

/**
 * LocationService
 * Central management service for saving, removing, favoriting,
 * detecting, and selecting meteorological locations.
 */
export class LocationService {
  constructor(geocodingProvider = new MockGeocodingProvider()) {
    this.provider = geocodingProvider;
  }

  setGeocodingProvider(provider) {
    if (provider instanceof BaseGeocodingProvider) {
      this.provider = provider;
    }
  }

  // Geocoding Proxy Methods
  async search(query) {
    return this.provider.search(query);
  }

  async reverseGeocode(latitude, longitude) {
    return this.provider.reverseGeocode(latitude, longitude);
  }

  /**
   * Helper to detect location via secure IP geolocation services
   * when GPS is denied, unavailable, or restricted by iframe permissions.
   */
  async _detectViaIp() {
    // Attempt 1: ipwho.is (reliable, HTTPS, returns city, country, exact lat/lon, timezone)
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false && data.latitude && data.longitude) {
          const city = data.city || 'Local Station';
          const region = data.region || data.region_code || '';
          const country = data.country || 'Detected Region';
          return normalizeLocation({
            id: `ip-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: `${city} (Auto-Detected)`,
            city,
            region,
            country,
            latitude: data.latitude,
            longitude: data.longitude,
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timezone?.id || 'UTC',
            isGpsDetected: true,
          });
        }
      }
    } catch (e) {
      console.warn('[LocationService] ipwho.is detection failed:', e.message);
    }

    // Attempt 2: ipapi.co
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude && !data.error) {
          const city = data.city || 'Local Station';
          const region = data.region || data.region_code || '';
          const country = data.country_name || data.country || 'Detected Region';
          return normalizeLocation({
            id: `ip-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: `${city} (Auto-Detected)`,
            city,
            region,
            country,
            latitude: data.latitude,
            longitude: data.longitude,
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timezone || 'UTC',
            isGpsDetected: true,
          });
        }
      }
    } catch (e) {
      console.warn('[LocationService] ipapi.co detection failed:', e.message);
    }

    // Attempt 3: freeipapi.com
    try {
      const res = await fetch('https://freeipapi.com/api/json');
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          const city = data.cityName || 'Local Station';
          const region = data.regionName || '';
          const country = data.countryName || 'Detected Region';
          return normalizeLocation({
            id: `ip-${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: `${city} (Auto-Detected)`,
            city,
            region,
            country,
            latitude: data.latitude,
            longitude: data.longitude,
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timeZone || 'UTC',
            isGpsDetected: true,
          });
        }
      }
    } catch (e) {
      console.warn('[LocationService] freeipapi detection failed:', e.message);
    }

    // Attempt 4: Return default preset location
    return normalizeLocation(DEFAULT_PRESET_LOCATIONS[0]);
  }

  /**
   * Detects current position using browser HTML5 Geolocation API
   * and automatically falls back to IP Geolocation if GPS is denied or restricted.
   */
  async detectCurrentLocation() {
    // 1. Try Browser Geolocation API
    if (typeof window !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: false,
              timeout: 4000,
              maximumAge: 60000,
            }
          );
        });

        if (position && position.coords) {
          const { latitude, longitude } = position.coords;
          const location = await this.reverseGeocode(latitude, longitude);
          return {
            ...location,
            isGpsDetected: true,
          };
        }
      } catch (gpsError) {
        console.info('[LocationService] Geolocation unavailable or denied, activating IP geolocation fallback...', gpsError?.message);
      }
    }

    // 2. High-reliability IP-based location fallback (works without browser permission popups or iframe blocks)
    return await this._detectViaIp();
  }

  // Local Storage Persistence
  getSavedLocations() {
    if (typeof window === 'undefined') return DEFAULT_PRESET_LOCATIONS.map(normalizeLocation);

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
      if (!stored) {
        // Initialize with default presets
        const initial = DEFAULT_PRESET_LOCATIONS.map(normalizeLocation);
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeLocation);
      }
      return DEFAULT_PRESET_LOCATIONS.map(normalizeLocation);
    } catch {
      return DEFAULT_PRESET_LOCATIONS.map(normalizeLocation);
    }
  }

  saveLocation(locationData) {
    const normalized = normalizeLocation(locationData);
    const existing = this.getSavedLocations();

    // Check if location already exists by id or city + country
    const index = existing.findIndex(
      (loc) =>
        loc.id === normalized.id ||
        (loc.city.toLowerCase() === normalized.city.toLowerCase() &&
          loc.country.toLowerCase() === normalized.country.toLowerCase())
    );

    let updated;
    if (index >= 0) {
      // Update existing
      updated = [...existing];
      updated[index] = {
        ...existing[index],
        ...normalized,
        // preserve favorite status unless explicitly passed
        isFavorite: locationData.isFavorite !== undefined ? locationData.isFavorite : existing[index].isFavorite,
      };
    } else {
      // Append new location at beginning
      updated = [normalized, ...existing];
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist location to localStorage', e);
      }
    }

    return normalized;
  }

  removeLocation(locationId) {
    const existing = this.getSavedLocations();
    const updated = existing.filter((loc) => loc.id !== locationId);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to remove location from localStorage', e);
      }
    }

    return updated;
  }

  toggleFavorite(locationId) {
    const existing = this.getSavedLocations();
    let newStatus = false;

    const updated = existing.map((loc) => {
      if (loc.id === locationId) {
        newStatus = !loc.isFavorite;
        return { ...loc, isFavorite: newStatus };
      }
      return loc;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update favorite in localStorage', e);
      }
    }

    return { updated, isFavorite: newStatus };
  }

  getFavoriteLocations() {
    return this.getSavedLocations().filter((loc) => loc.isFavorite);
  }

  getActiveLocation() {
    if (typeof window === 'undefined') return normalizeLocation(DEFAULT_PRESET_LOCATIONS[0]);

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOCATION);
      if (stored) {
        return normalizeLocation(JSON.parse(stored));
      }
    } catch {}

    const saved = this.getSavedLocations();
    return saved[0] || normalizeLocation(DEFAULT_PRESET_LOCATIONS[0]);
  }

  setActiveLocation(location) {
    const normalized = normalizeLocation(location);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LOCATION, JSON.stringify(normalized));
      } catch {}
    }
    return normalized;
  }

  /**
   * Get list of supported preset countries
   */
  getAvailableCountries() {
    return Object.keys(COUNTRY_STATION_PRESETS);
  }

  /**
   * Get stations for a given country
   */
  getStationsForCountry(countryName = 'Pakistan') {
    const list = COUNTRY_STATION_PRESETS[countryName] || COUNTRY_STATION_PRESETS['Pakistan'] || [];
    return list.map((item) =>
      normalizeLocation({
        id: `${item.city.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${item.country.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: item.city,
        ...item,
        lat: item.latitude,
        lon: item.longitude,
      })
    );
  }
}

// Global default service instance
export const locationService = new LocationService(new MockGeocodingProvider());
export default locationService;
