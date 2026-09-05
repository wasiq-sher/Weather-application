import BaseWeatherProvider from './baseWeatherProvider.js';

/**
 * Mock Weather Provider
 * Generates realistic atmospheric weather data dynamically based on coordinates and parameters.
 */
export class MockWeatherProvider extends BaseWeatherProvider {
  constructor() {
    super('MockWeatherProvider');
  }

  /**
   * Helper to derive baseline temp from latitude
   */
  _getBaselineTemp(lat = 37.77, units = 'F') {
    const absLat = Math.abs(lat);
    // Cooler near poles, warmer near equator
    let celsius = 30 - (absLat / 90) * 35;
    celsius += (Math.random() * 4 - 2); // slight variation

    if (units === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  }

  async getCurrentWeather({ lat = 37.77, lon = -122.41, city = 'San Francisco', units = 'F' } = {}) {
    const temp = this._getBaselineTemp(lat, units);
    const feelsLike = temp + (units === 'F' ? 2 : 1);
    const humidity = Math.min(95, Math.max(30, Math.round(65 + Math.sin(lat) * 15)));
    const windSpeed = Math.round(8 + Math.abs(Math.cos(lon)) * 12);
    const pressure = Math.round(1013 + (Math.sin(lat * lon) * 12));
    const uvIndex = Math.max(1, Math.min(11, Math.round(6 - Math.abs(lat) / 20)));

    return {
      location: {
        city: city || 'Current Station',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        timezone: 'UTC',
        localtime: new Date().toISOString(),
      },
      current: {
        temperature: temp,
        feelsLike,
        unit: units,
        tempMin: temp - 6,
        tempMax: temp + 8,
        condition: 'Partly Cloudy',
        description: 'Scattered clouds with mild coastal breeze',
        icon: 'partly-cloudy-day',
        humidity,
        windSpeed,
        windDirection: 240,
        windCardinal: 'WSW',
        windGust: windSpeed + 6,
        pressure,
        pressureTrend: 'steady',
        visibility: 10,
        uvIndex,
        uvRisk: uvIndex > 7 ? 'Very High' : uvIndex > 5 ? 'High' : 'Moderate',
        cloudCover: 35,
        dewPoint: temp - 10,
        precipitationChance: 15,
      },
      updatedAt: new Date().toISOString(),
      provider: this.name,
    };
  }

  async getHourlyForecast({ lat = 37.77, lon = -122.41, city = 'San Francisco', hours = 24, units = 'F' } = {}) {
    const baseTemp = this._getBaselineTemp(lat, units);
    const hourly = [];
    const now = new Date();

    const limit = Math.min(Math.max(1, parseInt(hours, 10) || 24), 72);

    for (let i = 0; i < limit; i++) {
      const hourDate = new Date(now.getTime() + i * 3600 * 1000);
      const hourOfDay = hourDate.getHours();

      // Diurnal cycle: colder at 5 AM, warmer at 3 PM
      const diurnalOffset = Math.sin(((hourOfDay - 9) / 24) * 2 * Math.PI) * 6;
      const temp = Math.round(baseTemp + diurnalOffset);
      const precip = Math.max(0, Math.min(100, Math.round(20 + Math.sin(i * 0.5) * 30)));

      hourly.push({
        time: hourDate.toISOString(),
        hourLabel: hourDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: temp,
        feelsLike: temp + (units === 'F' ? 1 : 0.5),
        condition: precip > 40 ? 'Light Rain' : temp > 80 ? 'Sunny' : 'Partly Cloudy',
        icon: precip > 40 ? 'rain' : 'partly-cloudy',
        precipitationChance: precip,
        humidity: Math.min(95, Math.max(35, 60 - diurnalOffset * 2)),
        windSpeed: Math.round(6 + Math.abs(Math.sin(i)) * 10),
        uvIndex: hourOfDay >= 9 && hourOfDay <= 17 ? Math.round(Math.sin(((hourOfDay - 6) / 12) * Math.PI) * 8) : 0,
      });
    }

    return {
      location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
      count: hourly.length,
      hourly,
      provider: this.name,
    };
  }

  async getDailyForecast({ lat = 37.77, lon = -122.41, city = 'San Francisco', days = 7, units = 'F' } = {}) {
    const baseTemp = this._getBaselineTemp(lat, units);
    const daily = [];
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const limit = Math.min(Math.max(1, parseInt(days, 10) || 7), 14);

    const conditions = [
      { text: 'Sunny & Clear', icon: 'sun', precip: 5 },
      { text: 'Partly Cloudy', icon: 'partly-cloudy', precip: 15 },
      { text: 'Mostly Cloudy', icon: 'cloudy', precip: 25 },
      { text: 'Passing Showers', icon: 'rain-showers', precip: 55 },
      { text: 'Clear Sky', icon: 'sun', precip: 0 },
      { text: 'Breezy & Mild', icon: 'wind', precip: 10 },
      { text: 'Scattered Clouds', icon: 'partly-cloudy', precip: 20 },
    ];

    for (let i = 0; i < limit; i++) {
      const forecastDate = new Date(now.getTime() + i * 86400 * 1000);
      const cond = conditions[i % conditions.length];
      const tempMax = Math.round(baseTemp + (Math.sin(i) * 4) + 4);
      const tempMin = Math.round(tempMax - 12 - (Math.cos(i) * 2));

      daily.push({
        date: forecastDate.toISOString().split('T')[0],
        dayName: i === 0 ? 'Today' : dayNames[forecastDate.getDay()],
        tempMax,
        tempMin,
        unit: units,
        condition: cond.text,
        icon: cond.icon,
        precipitationChance: cond.precip,
        humidity: Math.round(55 + Math.sin(i) * 15),
        windSpeed: Math.round(8 + Math.cos(i) * 5),
        uvMax: Math.round(6 + (i % 3)),
        summary: `Expect ${cond.text.toLowerCase()} with winds up to ${Math.round(12 + i)} mph.`,
      });
    }

    return {
      location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
      count: daily.length,
      daily,
      provider: this.name,
    };
  }

  async getAirQuality({ lat = 37.77, lon = -122.41, city = 'San Francisco' } = {}) {
    const aqi = Math.round(38 + Math.abs(Math.sin(lat * lon)) * 25);
    let category = 'Good';
    let color = '#10B981';

    if (aqi > 150) {
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
        pm2_5: { value: 9.4, unit: 'µg/m³', status: 'Good' },
        pm10: { value: 18.2, unit: 'µg/m³', status: 'Good' },
        o3: { value: 32.1, unit: 'ppb', status: 'Good' },
        no2: { value: 12.5, unit: 'ppb', status: 'Good' },
        so2: { value: 1.8, unit: 'ppb', status: 'Good' },
        co: { value: 0.4, unit: 'ppm', status: 'Good' },
      },
      dominantPollutant: 'pm2_5',
      healthRecommendation: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      provider: this.name,
    };
  }

  async getSunSchedule({ lat = 37.77, lon = -122.41, city = 'San Francisco', date } = {}) {
    const targetDate = date ? new Date(date) : new Date();

    const sunrise = new Date(targetDate);
    sunrise.setHours(6, 32, 0, 0);

    const sunset = new Date(targetDate);
    sunset.setHours(19, 48, 0, 0);

    const solarNoon = new Date(targetDate);
    solarNoon.setHours(13, 10, 0, 0);

    const dawn = new Date(targetDate);
    dawn.setHours(6, 5, 0, 0);

    const dusk = new Date(targetDate);
    dusk.setHours(20, 15, 0, 0);

    return {
      location: { city, latitude: parseFloat(lat), longitude: parseFloat(lon) },
      date: targetDate.toISOString().split('T')[0],
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      solarNoon: solarNoon.toISOString(),
      dawn: dawn.toISOString(),
      dusk: dusk.toISOString(),
      daylightHours: 13.26,
      sunProgressPercent: 62,
      solarElevationDegrees: 48.5,
      provider: this.name,
    };
  }

  async getRadarData({ lat = 37.77, lon = -122.41, zoom = 6, layer = 'precipitation' } = {}) {
    const now = Math.floor(Date.now() / 1000);
    const timestamps = [];

    for (let i = 6; i >= 0; i--) {
      timestamps.push(now - i * 600); // 10 minute intervals
    }

    return {
      center: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
      zoom: parseInt(zoom, 10) || 6,
      activeLayer: layer,
      availableLayers: ['precipitation', 'clouds', 'wind', 'temperature', 'pressure'],
      tileUrlTemplate: 'https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png',
      timestamps,
      latestTimestamp: timestamps[timestamps.length - 1],
      provider: this.name,
    };
  }
}

export default MockWeatherProvider;
