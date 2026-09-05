import MockWeatherProvider from './mockWeatherProvider.js';
import RealWeatherProvider from './weatherProvider.js';
import OpenWeatherMapProvider from './openWeatherMapProvider.js';
import WeatherGovProvider from './weatherGovProvider.js';
import airQualityService from '../airQualityService.js';

/**
 * Lightweight In-Memory TTL Cache for Server-Side Weather Data Optimization
 */
class SimpleTTLCache {
  constructor(defaultTtlMs = 120000) { // 2 minutes default
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs) {
    const ttl = ttlMs || this.defaultTtlMs;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  clear() {
    this.cache.clear();
  }
}

/**
 * Unified Weather Service Orchestrator
 * Manages pluggable provider strategies and delegates weather queries with TTL caching.
 */
export class WeatherService {
  constructor() {
    this.providers = new Map();
    this.cache = new SimpleTTLCache(180000); // 3 min default TTL

    // Register built-in providers
    this.registerProvider('real', new RealWeatherProvider());
    this.registerProvider('mock', new MockWeatherProvider());
    this.registerProvider('openweathermap', new OpenWeatherMapProvider());
    this.registerProvider('weathergov', new WeatherGovProvider());

    // Active provider defaults to real or ENV config
    const configuredProvider = process.env.WEATHER_PROVIDER || 'real';
    this.activeProviderName = this.providers.has(configuredProvider) ? configuredProvider : 'real';
  }

  /**
   * Helper to build consistent cache keys
   */
  _buildCacheKey(prefix, params) {
    const provider = params.provider || this.activeProviderName;
    const lat = params.lat !== undefined ? Number(params.lat).toFixed(2) : '';
    const lon = params.lon !== undefined ? Number(params.lon).toFixed(2) : '';
    const city = (params.city || '').toLowerCase().trim();
    const units = params.units || 'F';
    const layer = params.layer || '';
    const extra = params.hours || params.days || params.date || '';
    return `${prefix}:${provider}:${city}:${lat},${lon}:${units}:${layer}:${extra}`;
  }

  /**
   * Register a new pluggable weather provider
   * @param {string} key
   * @param {import('./baseWeatherProvider.js').BaseWeatherProvider} providerInstance
   */
  registerProvider(key, providerInstance) {
    if (!key || typeof key !== 'string') {
      throw new Error('Provider key must be a non-empty string');
    }
    this.providers.set(key.toLowerCase(), providerInstance);
  }

  /**
   * Get active provider instance
   * @returns {import('./baseWeatherProvider.js').BaseWeatherProvider}
   */
  getProvider(overrideProviderName) {
    if (overrideProviderName && this.providers.has(overrideProviderName.toLowerCase())) {
      return this.providers.get(overrideProviderName.toLowerCase());
    }
    return this.providers.get(this.activeProviderName) || this.providers.get('mock');
  }

  /**
   * Set active provider strategy
   * @param {string} providerName
   */
  setActiveProvider(providerName) {
    const key = (providerName || '').toLowerCase();
    if (!this.providers.has(key)) {
      throw new Error(`Provider '${providerName}' is not registered.`);
    }
    this.activeProviderName = key;
  }

  async getCurrentWeather(params) {
    const cacheKey = this._buildCacheKey('current', params);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const provider = this.getProvider(params.provider);
    const data = await provider.getCurrentWeather(params);
    this.cache.set(cacheKey, data, 120000); // 2 mins TTL
    return data;
  }

  async getHourlyForecast(params) {
    const cacheKey = this._buildCacheKey('hourly', params);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const provider = this.getProvider(params.provider);
    const data = await provider.getHourlyForecast(params);
    this.cache.set(cacheKey, data, 300000); // 5 mins TTL
    return data;
  }

  async getDailyForecast(params) {
    const cacheKey = this._buildCacheKey('daily', params);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const provider = this.getProvider(params.provider);
    const data = await provider.getDailyForecast(params);
    this.cache.set(cacheKey, data, 300000); // 5 mins TTL
    return data;
  }

  async getAirQuality(params) {
    const cacheKey = this._buildCacheKey('air', params);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await airQualityService.getAirQuality(params);
    this.cache.set(cacheKey, data, 300000); // 5 mins TTL
    return data;
  }

  async getSunSchedule(params) {
    const cacheKey = this._buildCacheKey('sun', params);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const provider = this.getProvider(params.provider);
    const data = await provider.getSunSchedule(params);
    this.cache.set(cacheKey, data, 600000); // 10 mins TTL
    return data;
  }

  async getRadarData(params) {
    const cacheKey = this._buildCacheKey('radar', params);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const provider = this.getProvider(params.provider);
    const data = await provider.getRadarData(params);
    this.cache.set(cacheKey, data, 300000); // 5 mins TTL
    return data;
  }
}

export const weatherService = new WeatherService();
export default weatherService;
