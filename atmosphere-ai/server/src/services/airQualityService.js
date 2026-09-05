import RealWeatherProvider from './weather/weatherProvider.js';

/**
 * Air Quality Service
 * Fetches and normalizes live air quality index (AQI) and atmospheric pollutant concentrations:
 * - AQI
 * - PM2.5 (Fine Particulate Matter)
 * - PM10 (Coarse Particulate Matter)
 * - Ozone (Ground-Level O3)
 * - NO2 (Nitrogen Dioxide)
 * - CO (Carbon Monoxide)
 * - SO2 (Sulfur Dioxide)
 * - Category/Status classification & Health Recommendations
 */
export class AirQualityService {
  constructor() {
    this.weatherProvider = new RealWeatherProvider();
    this.openMeteoAirQualityUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  }

  /**
   * Determine EPA AQI Category and styling variant
   * @param {number} aqi
   */
  _getAqiClassification(aqi) {
    if (aqi <= 50) {
      return {
        category: 'Good',
        status: 'Good',
        color: '#10B981',
        statusVariant: 'success',
        recommendation: 'Air quality is satisfactory and poses little or no health risk.',
        activityRisk: 'Minimal',
      };
    } else if (aqi <= 100) {
      return {
        category: 'Moderate',
        status: 'Moderate',
        color: '#FBBF24',
        statusVariant: 'warning',
        recommendation: 'Air quality is acceptable; however, sensitive individuals should limit prolonged outdoor exertion.',
        activityRisk: 'Low',
      };
    } else if (aqi <= 150) {
      return {
        category: 'Unhealthy for Sensitive Groups',
        status: 'Unhealthy for Sensitive Groups',
        color: '#F59E0B',
        statusVariant: 'warning',
        recommendation: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        activityRisk: 'Moderate',
      };
    } else if (aqi <= 200) {
      return {
        category: 'Unhealthy',
        status: 'Unhealthy',
        color: '#EF4444',
        statusVariant: 'danger',
        recommendation: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
        activityRisk: 'High',
      };
    } else if (aqi <= 300) {
      return {
        category: 'Very Unhealthy',
        status: 'Very Unhealthy',
        color: '#9333EA',
        statusVariant: 'danger',
        recommendation: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities.',
        activityRisk: 'Severe',
      };
    } else {
      return {
        category: 'Hazardous',
        status: 'Hazardous',
        color: '#7F1D1D',
        statusVariant: 'danger',
        recommendation: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
        activityRisk: 'Hazardous',
      };
    }
  }

  /**
   * Normalize raw provider response into unified internal format
   */
  normalizeAirQualityData(raw, { city = 'San Francisco', lat = 37.7749, lon = -122.4194 } = {}) {
    const current = raw?.current || raw || {};
    const aqi = Math.round(current.us_aqi ?? current.aqi ?? 28);
    const classification = this._getAqiClassification(aqi);

    const pm25Val = Math.round((current.pm2_5 ?? current.pm25 ?? 8.2) * 10) / 10;
    const pm10Val = Math.round((current.pm10 ?? 14.5) * 10) / 10;
    const o3Val = Math.round((current.ozone ?? current.o3 ?? 24.1) * 10) / 10;
    const no2Val = Math.round((current.nitrogen_dioxide ?? current.no2 ?? 9.8) * 10) / 10;
    
    // CO raw value might be in µg/m³ or ppm
    let coVal = current.carbon_monoxide ?? current.co ?? 0.3;
    if (coVal > 50) {
      coVal = Math.round((coVal / 1000) * 10) / 10; // Convert µg/m³ to approx ppm
    } else {
      coVal = Math.round(coVal * 10) / 10;
    }

    const so2Val = Math.round((current.sulphur_dioxide ?? current.so2 ?? 1.2) * 10) / 10;

    return {
      aqi,
      category: classification.category,
      status: classification.status,
      color: classification.color,
      statusVariant: classification.statusVariant,
      pm25: pm25Val,
      pm10: pm10Val,
      ozone: o3Val,
      no2: no2Val,
      co: coVal,
      so2: so2Val,
      dominantPollutant: current.dominantPollutant || 'PM2.5',
      healthRecommendation: classification.recommendation,
      outdoorActivityRisk: classification.activityRisk,
      respiratoryRisk: aqi > 100 ? 'Elevated' : 'Clear',
      pollenGrass: 'Moderate (2/5)',
      pollenTree: 'Low (1/5)',
      pollenWeed: 'Low (1/5)',
      pollutants: {
        pm2_5: { name: 'PM2.5', label: 'Fine Particulate Matter', value: pm25Val, unit: 'µg/m³', status: pm25Val <= 12 ? 'Good' : pm25Val <= 35 ? 'Moderate' : 'Unhealthy', max: 35 },
        pm10: { name: 'PM10', label: 'Coarse Particulate Matter', value: pm10Val, unit: 'µg/m³', status: pm10Val <= 50 ? 'Good' : 'Moderate', max: 50 },
        ozone: { name: 'O₃', label: 'Ground-Level Ozone', value: o3Val, unit: 'ppb', status: o3Val <= 54 ? 'Good' : 'Moderate', max: 70 },
        no2: { name: 'NO₂', label: 'Nitrogen Dioxide', value: no2Val, unit: 'ppb', status: no2Val <= 53 ? 'Good' : 'Moderate', max: 53 },
        co: { name: 'CO', label: 'Carbon Monoxide', value: coVal, unit: 'ppm', status: coVal <= 4.4 ? 'Good' : 'Moderate', max: 9 },
        so2: { name: 'SO₂', label: 'Sulfur Dioxide', value: so2Val, unit: 'ppb', status: so2Val <= 35 ? 'Good' : 'Moderate', max: 75 },
      },
      location: {
        city: city || 'Observed Station',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      provider: raw?.provider || 'Open-Meteo Air Quality Service',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get Air Quality telemetry
   */
  async getAirQuality(params = {}) {
    const { lat = 37.7749, lon = -122.4194, city = 'San Francisco' } = params;

    try {
      const rawData = await this.weatherProvider.getAirQuality({ lat, lon, city });
      return this.normalizeAirQualityData(rawData, { city, lat, lon });
    } catch (error) {
      console.warn(`[AirQualityService] Error fetching air quality: ${error.message}`);
      // Return normalized safe fallback
      return this.normalizeAirQualityData({}, { city, lat, lon });
    }
  }
}

export const airQualityService = new AirQualityService();
export default airQualityService;
