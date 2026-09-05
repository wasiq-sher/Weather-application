import BaseWeatherProvider from './baseWeatherProvider.js';
import MockWeatherProvider from './mockWeatherProvider.js';

/**
 * US National Weather Service (weather.gov) Provider
 * Free public API implementation template for US coordinates.
 */
export class WeatherGovProvider extends BaseWeatherProvider {
  constructor() {
    super('WeatherGovProvider');
    this.fallbackProvider = new MockWeatherProvider();
    this.baseUrl = 'https://api.weather.gov';
  }

  async getCurrentWeather(params) {
    // US NWS API connector stub
    return this.fallbackProvider.getCurrentWeather(params);
  }

  async getHourlyForecast(params) {
    return this.fallbackProvider.getHourlyForecast(params);
  }

  async getDailyForecast(params) {
    return this.fallbackProvider.getDailyForecast(params);
  }

  async getAirQuality(params) {
    return this.fallbackProvider.getAirQuality(params);
  }

  async getSunSchedule(params) {
    return this.fallbackProvider.getSunSchedule(params);
  }

  async getRadarData(params) {
    return this.fallbackProvider.getRadarData(params);
  }
}

export default WeatherGovProvider;
