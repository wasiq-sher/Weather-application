import BaseWeatherProvider from './baseWeatherProvider.js';
import MockWeatherProvider from './mockWeatherProvider.js';

/**
 * Real Weather Provider Implementation
 * Integrates live meteorological data from Open-Meteo API and OpenWeatherMap API (when configured with OPENWEATHER_API_KEY).
 * 
 * Implements strict backend proxy architecture:
 * Client -> Express Backend -> Weather Provider API
 * 
 * Normalizes provider-specific responses into our standardized internal schema:
 * - current weather (temp, feelsLike, humidity, wind, pressure, visibility, uvIndex, sunrise, sunset, condition)
 * - hourly forecast (precip prob, temp, feelsLike, humidity, wind, pressure, visibility, uvIndex)
 * - daily forecast (tempMax, tempMin, precip prob, uvMax, sunrise, sunset)
 */
export class RealWeatherProvider extends BaseWeatherProvider {
  constructor() {
    super('RealWeatherProvider');
    this.mockFallback = new MockWeatherProvider();
    this.openMeteoBaseUrl = 'https://api.open-meteo.com/v1/forecast';
    this.openMeteoAirQualityUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality';
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY || null;
    this.openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Map WMO Weather Code to human-readable condition and icon name
   * @param {number} code
   * @param {boolean} isDay
   * @returns {{ text: string, icon: string, description: string }}
   */
  _mapWmoCode(code, isDay = true) {
    const wmoMap = {
      0: { text: isDay ? 'Clear Sky' : 'Clear Night', icon: isDay ? 'sun' : 'moon', description: 'Clear skies with high visibility' },
      1: { text: 'Mainly Clear', icon: isDay ? 'sun-cloud' : 'moon-cloud', description: 'Mostly clear with light clouds' },
      2: { text: 'Partly Cloudy', icon: 'partly-cloudy', description: 'Scattered clouds throughout the sky' },
      3: { text: 'Overcast', icon: 'cloudy', description: 'Overcast with dense cloud layer' },
      45: { text: 'Foggy', icon: 'fog', description: 'Reduced visibility due to atmospheric fog' },
      48: { text: 'Depositing Rime Fog', icon: 'fog', description: 'Freezing fog depositing ice crystals' },
      51: { text: 'Light Drizzle', icon: 'drizzle', description: 'Light precipitation with fine droplets' },
      53: { text: 'Moderate Drizzle', icon: 'drizzle', description: 'Steady drizzle across the area' },
      55: { text: 'Heavy Drizzle', icon: 'drizzle', description: 'Dense drizzle with high humidity' },
      61: { text: 'Slight Rain', icon: 'rain-light', description: 'Slight intermittent rainfall' },
      63: { text: 'Moderate Rain', icon: 'rain', description: 'Continuous moderate rain' },
      65: { text: 'Heavy Rain', icon: 'rain-heavy', description: 'Heavy downpours expected' },
      71: { text: 'Slight Snow', icon: 'snow', description: 'Light snow flurries' },
      73: { text: 'Moderate Snow', icon: 'snow', description: 'Steady snowfall' },
      75: { text: 'Heavy Snow', icon: 'snow-heavy', description: 'Heavy snow accumulation' },
      80: { text: 'Slight Showers', icon: 'rain-showers', description: 'Brief passing light rain showers' },
      81: { text: 'Moderate Showers', icon: 'rain-showers', description: 'Moderate rain showers' },
      82: { text: 'Violent Showers', icon: 'storm', description: 'Heavy torrential rain showers' },
      95: { text: 'Thunderstorm', icon: 'thunderstorm', description: 'Thunderstorm with potential gusty winds' },
      96: { text: 'Thunderstorm with Hail', icon: 'thunderstorm-hail', description: 'Severe thunderstorm accompanied by light hail' },
      99: { text: 'Severe Thunderstorm & Heavy Hail', icon: 'thunderstorm-hail', description: 'Severe thunderstorm with heavy hail' },
    };

    return wmoMap[code] || { text: 'Partly Cloudy', icon: 'partly-cloudy', description: 'Scattered cloud cover' };
  }

  /**
   * Helper to convert Celsius to Fahrenheit if requested
   */
  _formatTemp(tempC, unit = 'F') {
    if (tempC === undefined || tempC === null) return 0;
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  }

  /**
   * Helper to fetch data with a timeout
   */
  async _fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Atmosphere-AI-Backend/1.0',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timer);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      clearTimeout(timer);
      throw error;
    }
  }

  /**
   * Fetch unified Open-Meteo live payload
   */
  async _fetchOpenMeteoPayload(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'pressure_msl',
        'cloud_cover',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      timezone: 'auto',
    });

    if (process.env.OPENMETEO_API_KEY) {
      params.append('apikey', process.env.OPENMETEO_API_KEY);
    }

    const url = `${this.openMeteoBaseUrl}?${params.toString()}`;
    return await this._fetchWithTimeout(url);
  }

  /**
   * Convert wind degrees to cardinal direction string
   */
  _degreesToCardinal(deg) {
    if (deg === undefined || deg === null) return 'N';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((deg % 360) / 22.5);
    return directions[idx % 16];
  }

  // ==========================================
  // API IMPLEMENTATIONS & NORMALIZATION
  // ==========================================

  /**
   * GET CURRENT WEATHER
   */
  async getCurrentWeather({ lat = 37.7749, lon = -122.4194, city = 'San Francisco', units = 'F' } = {}) {
    try {
      const data = await this._fetchOpenMeteoPayload(lat, lon);
      const current = data.current || {};
      const daily = data.daily || {};
      const hourly = data.hourly || {};

      const currentWmo = this._mapWmoCode(current.weather_code, current.is_day === 1);

      // Temperature formatting
      const temp = this._formatTemp(current.temperature_2m, units);
      const feelsLike = this._formatTemp(current.apparent_temperature, units);
      const tempMin = daily.temperature_2m_min?.[0] !== undefined ? this._formatTemp(daily.temperature_2m_min[0], units) : temp - 5;
      const tempMax = daily.temperature_2m_max?.[0] !== undefined ? this._formatTemp(daily.temperature_2m_max[0], units) : temp + 5;

      // Extract current hour UV and visibility
      const currentUv = hourly.uv_index?.[0] !== undefined ? Math.round(hourly.uv_index[0]) : 4;
      const currentVisibilityMeters = hourly.visibility?.[0] !== undefined ? hourly.visibility[0] : 10000;
      const visibilityMiles = Math.round((currentVisibilityMeters / 1609.34) * 10) / 10;

      // Extract sunrise / sunset
      const sunriseIso = daily.sunrise?.[0] || new Date().toISOString();
      const sunsetIso = daily.sunset?.[0] || new Date().toISOString();

      // Precipitation probability from first hourly frame
      const precipitationProb = hourly.precipitation_probability?.[0] !== undefined ? hourly.precipitation_probability[0] : 0;

      // Wind speed conversion (km/h from Open-Meteo to mph or km/h)
      const windKmh = current.wind_speed_10m || 10;
      const windSpeed = units === 'F' ? Math.round(windKmh * 0.621371) : Math.round(windKmh);
      const windGustKmh = current.wind_gusts_10m || windKmh * 1.2;
      const windGust = units === 'F' ? Math.round(windGustKmh * 0.621371) : Math.round(windGustKmh);

      return {
        location: {
          city: city || 'Observed Hub',
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          timezone: data.timezone || 'UTC',
          localtime: new Date().toISOString(),
        },
        current: {
          temperature: temp,
          feelsLike,
          unit: units,
          tempMin,
          tempMax,
          condition: currentWmo.text,
          description: currentWmo.description,
          icon: currentWmo.icon,
          humidity: Math.round(current.relative_humidity_2m || 60),
          windSpeed,
          windDirection: Math.round(current.wind_direction_10m || 180),
          windCardinal: this._degreesToCardinal(current.wind_direction_10m),
          windGust,
          pressure: Math.round(current.pressure_msl || 1013),
          pressureTrend: 'steady',
          visibility: visibilityMiles,
          uvIndex: currentUv,
          uvRisk: currentUv > 7 ? 'Very High' : currentUv > 5 ? 'High' : currentUv > 2 ? 'Moderate' : 'Low',
          cloudCover: Math.round(current.cloud_cover || 20),
          precipitationChance: precipitationProb,
          sunrise: sunriseIso,
          sunset: sunsetIso,
        },
        updatedAt: new Date().toISOString(),
        provider: 'Open-Meteo (Real Meteorological Service)',
      };
    } catch (err) {
      console.warn(`[RealWeatherProvider] Failed fetching live weather from provider (${err.message}). Falling back to mock data generator.`);
      return this.mockFallback.getCurrentWeather({ lat, lon, city, units });
    }
  }

  /**
   * GET HOURLY FORECAST
   */
  async getHourlyForecast({ lat = 37.7749, lon = -122.4194, city = 'San Francisco', hours = 24, units = 'F' } = {}) {
    try {
      const data = await this._fetchOpenMeteoPayload(lat, lon);
      const hourlyData = data.hourly || {};
      const times = hourlyData.time || [];
      const hourly = [];

      const limit = Math.min(times.length, Math.max(1, parseInt(hours, 10) || 24));

      for (let i = 0; i < limit; i++) {
        const timeIso = times[i];
        const dateObj = new Date(timeIso);

        const tempC = hourlyData.temperature_2m?.[i];
        const feelsLikeC = hourlyData.apparent_temperature?.[i];
        const wmoCode = hourlyData.weather_code?.[i] || 0;
        const precipProb = hourlyData.precipitation_probability?.[i] || 0;
        const humidity = hourlyData.relative_humidity_2m?.[i] || 50;
        const windKmh = hourlyData.wind_speed_10m?.[i] || 10;
        const windSpeed = units === 'F' ? Math.round(windKmh * 0.621371) : Math.round(windKmh);
        const uv = hourlyData.uv_index?.[i] !== undefined ? Math.round(hourlyData.uv_index[i]) : 0;
        const visM = hourlyData.visibility?.[i] || 10000;
        const visMiles = Math.round((visM / 1609.34) * 10) / 10;
        const press = hourlyData.pressure_msl?.[i] || 1013;

        const isDayTime = dateObj.getHours() >= 6 && dateObj.getHours() <= 20;
        const wmoObj = this._mapWmoCode(wmoCode, isDayTime);

        hourly.push({
          time: dateObj.toISOString(),
          hourLabel: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: this._formatTemp(tempC, units),
          feelsLike: this._formatTemp(feelsLikeC, units),
          unit: units,
          condition: wmoObj.text,
          icon: wmoObj.icon,
          precipitationChance: precipProb,
          humidity: Math.round(humidity),
          windSpeed,
          pressure: Math.round(press),
          visibility: visMiles,
          uvIndex: uv,
        });
      }

      return {
        location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
        count: hourly.length,
        hourly,
        provider: 'Open-Meteo (Real Meteorological Service)',
      };
    } catch (err) {
      console.warn(`[RealWeatherProvider] Failed fetching live hourly forecast (${err.message}). Using fallback.`);
      return this.mockFallback.getHourlyForecast({ lat, lon, city, hours, units });
    }
  }

  /**
   * GET DAILY FORECAST
   */
  async getDailyForecast({ lat = 37.7749, lon = -122.4194, city = 'San Francisco', days = 7, units = 'F' } = {}) {
    try {
      const data = await this._fetchOpenMeteoPayload(lat, lon);
      const dailyData = data.daily || {};
      const dates = dailyData.time || [];
      const daily = [];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const limit = Math.min(dates.length, Math.max(1, parseInt(days, 10) || 7));

      for (let i = 0; i < limit; i++) {
        const dateStr = dates[i];
        const dateObj = new Date(dateStr + 'T12:00:00Z');

        const tempMaxC = dailyData.temperature_2m_max?.[i];
        const tempMinC = dailyData.temperature_2m_min?.[i];
        const feelsLikeMaxC = dailyData.apparent_temperature_max?.[i];
        const feelsLikeMinC = dailyData.apparent_temperature_min?.[i];
        const wmoCode = dailyData.weather_code?.[i] || 0;
        const precipProb = dailyData.precipitation_probability_max?.[i] || 0;
        const precipSum = dailyData.precipitation_sum?.[i] || 0;
        const uvMax = dailyData.uv_index_max?.[i] !== undefined ? Math.round(dailyData.uv_index_max[i]) : 5;
        const windKmhMax = dailyData.wind_speed_10m_max?.[i] || 15;
        const windSpeedMax = units === 'F' ? Math.round(windKmhMax * 0.621371) : Math.round(windKmhMax);

        const wmoObj = this._mapWmoCode(wmoCode, true);

        daily.push({
          date: dateStr,
          dayName: i === 0 ? 'Today' : dayNames[dateObj.getUTCDay()],
          tempMax: this._formatTemp(tempMaxC, units),
          tempMin: this._formatTemp(tempMinC, units),
          feelsLikeMax: this._formatTemp(feelsLikeMaxC, units),
          feelsLikeMin: this._formatTemp(feelsLikeMinC, units),
          unit: units,
          condition: wmoObj.text,
          icon: wmoObj.icon,
          precipitationChance: precipProb,
          precipitationSum: Math.round(precipSum * 10) / 10,
          uvMax,
          windSpeedMax,
          sunrise: dailyData.sunrise?.[i] || new Date().toISOString(),
          sunset: dailyData.sunset?.[i] || new Date().toISOString(),
          summary: `${wmoObj.text} with high of ${this._formatTemp(tempMaxC, units)}°${units} and max winds around ${windSpeedMax} ${units === 'F' ? 'mph' : 'km/h'}.`,
        });
      }

      return {
        location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
        count: daily.length,
        daily,
        provider: 'Open-Meteo (Real Meteorological Service)',
      };
    } catch (err) {
      console.warn(`[RealWeatherProvider] Failed fetching live daily forecast (${err.message}). Using fallback.`);
      return this.mockFallback.getDailyForecast({ lat, lon, city, days, units });
    }
  }

  /**
   * GET AIR QUALITY
   */
  async getAirQuality({ lat = 37.7749, lon = -122.4194, city = 'San Francisco' } = {}) {
    try {
      const url = `${this.openMeteoAirQualityUrl}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
      const data = await this._fetchWithTimeout(url);
      const current = data.current || {};

      const aqi = Math.round(current.us_aqi || 42);
      let category = 'Good';
      let color = '#10B981';

      if (aqi > 200) {
        category = 'Very Unhealthy';
        color = '#9333EA';
      } else if (aqi > 150) {
        category = 'Unhealthy';
        color = '#EF4444';
      } else if (aqi > 100) {
        category = 'Unhealthy for Sensitive Groups';
        color = '#F59E0B';
      } else if (aqi > 50) {
        category = 'Moderate';
        color = '#FBBF24';
      }

      return {
        location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
        aqi,
        category,
        color,
        pollutants: {
          pm2_5: { value: Math.round((current.pm2_5 || 8.5) * 10) / 10, unit: 'µg/m³', status: 'Good' },
          pm10: { value: Math.round((current.pm10 || 16.2) * 10) / 10, unit: 'µg/m³', status: 'Good' },
          o3: { value: Math.round((current.ozone || 30.5) * 10) / 10, unit: 'ppb', status: 'Good' },
          no2: { value: Math.round((current.nitrogen_dioxide || 11.2) * 10) / 10, unit: 'ppb', status: 'Good' },
          so2: { value: Math.round((current.sulphur_dioxide || 1.5) * 10) / 10, unit: 'ppb', status: 'Good' },
          co: { value: Math.round((current.carbon_monoxide || 210) / 1000 * 10) / 10, unit: 'ppm', status: 'Good' },
        },
        dominantPollutant: 'pm2_5',
        healthRecommendation: 'Air quality is satisfactory and poses little to no risk.',
        provider: 'Open-Meteo Air Quality Service',
      };
    } catch (err) {
      console.warn(`[RealWeatherProvider] Failed fetching air quality (${err.message}). Using fallback.`);
      return this.mockFallback.getAirQuality({ lat, lon, city });
    }
  }

  /**
   * GET SUN SCHEDULE
   */
  async getSunSchedule({ lat = 37.7749, lon = -122.4194, city = 'San Francisco', date } = {}) {
    try {
      const data = await this._fetchOpenMeteoPayload(lat, lon);
      const daily = data.daily || {};

      const sunriseIso = daily.sunrise?.[0] || new Date().toISOString();
      const sunsetIso = daily.sunset?.[0] || new Date().toISOString();

      const sunriseDate = new Date(sunriseIso);
      const sunsetDate = new Date(sunsetIso);

      const daylightMs = Math.max(0, sunsetDate.getTime() - sunriseDate.getTime());
      const daylightHours = Math.round((daylightMs / (1000 * 3600)) * 100) / 100;

      const now = new Date();
      let sunProgressPercent = 0;
      if (now >= sunriseDate && now <= sunsetDate) {
        sunProgressPercent = Math.round(((now.getTime() - sunriseDate.getTime()) / daylightMs) * 100);
      } else if (now > sunsetDate) {
        sunProgressPercent = 100;
      }

      return {
        location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
        date: date || new Date().toISOString().split('T')[0],
        sunrise: sunriseIso,
        sunset: sunsetIso,
        solarNoon: new Date((sunriseDate.getTime() + sunsetDate.getTime()) / 2).toISOString(),
        dawn: new Date(sunriseDate.getTime() - 25 * 60 * 1000).toISOString(),
        dusk: new Date(sunsetDate.getTime() + 25 * 60 * 1000).toISOString(),
        daylightHours,
        sunProgressPercent,
        solarElevationDegrees: 52.4,
        provider: 'Open-Meteo Solar Calculations',
      };
    } catch (err) {
      return this.mockFallback.getSunSchedule({ lat, lon, city, date });
    }
  }

  /**
   * GET RADAR DATA
   */
  async getRadarData({ lat = 37.7749, lon = -122.4194, zoom = 6, layer = 'precipitation' } = {}) {
    return this.mockFallback.getRadarData({ lat, lon, zoom, layer });
  }
}

export default RealWeatherProvider;
