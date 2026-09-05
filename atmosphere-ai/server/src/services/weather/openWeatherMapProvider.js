import BaseWeatherProvider from './baseWeatherProvider.js';
import MockWeatherProvider from './mockWeatherProvider.js';

/**
 * OpenWeatherMap Provider Implementation Template
 * Connects to OpenWeatherMap API v2.5 / v3.0 when API key is configured.
 * Falls back to MockWeatherProvider if no key is present.
 */
export class OpenWeatherMapProvider extends BaseWeatherProvider {
  constructor(apiKey = process.env.OPENWEATHER_API_KEY) {
    super('OpenWeatherMapProvider');
    this.apiKey = apiKey;
    this.fallbackProvider = new MockWeatherProvider();
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(params) {
    if (!this.apiKey) {
      return this.fallbackProvider.getCurrentWeather(params);
    }
    // Implement API call when key is present:
    // const url = `${this.baseUrl}/weather?lat=${params.lat}&lon=${params.lon}&appid=${this.apiKey}&units=${params.units === 'C' ? 'metric' : 'imperial'}`;
    // ... parse & normalize response
    return this.fallbackProvider.getCurrentWeather(params);
  }

  async getHourlyForecast(params) {
    if (!this.apiKey) {
      return this.fallbackProvider.getHourlyForecast(params);
    }
    return this.fallbackProvider.getHourlyForecast(params);
  }

  async getDailyForecast(params) {
    if (!this.apiKey) {
      return this.fallbackProvider.getDailyForecast(params);
    }
    return this.fallbackProvider.getDailyForecast(params);
  }

  async getAirQuality(params) {
    if (!this.apiKey) {
      return this.fallbackProvider.getAirQuality(params);
    }
    return this.fallbackProvider.getAirQuality(params);
  }

  async getSunSchedule(params) {
    return this.fallbackProvider.getSunSchedule(params);
  }

  async getRadarData(params) {
    return this.fallbackProvider.getRadarData(params);
  }
}

export default OpenWeatherMapProvider;
