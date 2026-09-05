/**
 * Abstract Base Class for Weather Data Providers
 * Defines the strict interface that any pluggable weather provider must implement.
 */
export class BaseWeatherProvider {
  /**
   * @param {string} name Provider identifier
   */
  constructor(name = 'BaseWeatherProvider') {
    this.name = name;
  }

  /**
   * Fetch current weather metrics
   * @param {Object} params - { lat, lon, city, units }
   * @returns {Promise<Object>}
   */
  async getCurrentWeather(params) {
    throw new Error(`[${this.name}] getCurrentWeather() method not implemented.`);
  }

  /**
   * Fetch hourly weather forecast
   * @param {Object} params - { lat, lon, city, hours, units }
   * @returns {Promise<Array>}
   */
  async getHourlyForecast(params) {
    throw new Error(`[${this.name}] getHourlyForecast() method not implemented.`);
  }

  /**
   * Fetch 7-day or 14-day daily forecast
   * @param {Object} params - { lat, lon, city, days, units }
   * @returns {Promise<Array>}
   */
  async getDailyForecast(params) {
    throw new Error(`[${this.name}] getDailyForecast() method not implemented.`);
  }

  /**
   * Fetch air quality metrics
   * @param {Object} params - { lat, lon, city }
   * @returns {Promise<Object>}
   */
  async getAirQuality(params) {
    throw new Error(`[${this.name}] getAirQuality() method not implemented.`);
  }

  /**
   * Fetch solar schedule (sunrise/sunset/solar position)
   * @param {Object} params - { lat, lon, city, date }
   * @returns {Promise<Object>}
   */
  async getSunSchedule(params) {
    throw new Error(`[${this.name}] getSunSchedule() method not implemented.`);
  }

  /**
   * Fetch radar layer frames & tile URLs
   * @param {Object} params - { lat, lon, zoom, layer }
   * @returns {Promise<Object>}
   */
  async getRadarData(params) {
    throw new Error(`[${this.name}] getRadarData() method not implemented.`);
  }
}

export default BaseWeatherProvider;
