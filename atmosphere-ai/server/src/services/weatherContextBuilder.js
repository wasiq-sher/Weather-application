/**
 * Weather Context Builder / Engine
 * Dynamically filters and builds structured weather context JSON tailored specifically
 * to the user question intent.
 * 
 * Result structure:
 * {
 *   location: {},
 *   current: {},
 *   hourly: [],
 *   daily: [],
 *   airQuality: {},
 *   sun: {},
 *   relevantData: {}
 * }
 */
export class WeatherContextBuilder {
  /**
   * Determine user intent category from question keywords
   * Categories: 'clothing', 'rain', 'outdoor_exercise', 'commute', 'temperature_trend', 'general'
   * @param {string} question 
   * @returns {string}
   */
  detectIntent(question = '') {
    if (!question || typeof question !== 'string') return 'general';
    const q = question.toLowerCase().trim();

    // Clothing intent: temperature + feels-like + rain + wind + UV
    if (
      q.includes('wear') || 
      q.includes('outfit') || 
      q.includes('clothing') || 
      q.includes('jacket') || 
      q.includes('coat') || 
      q.includes('layers') || 
      q.includes('shorts') || 
      q.includes('sweater') ||
      q.includes('dress')
    ) {
      return 'clothing';
    }

    // Rain intent: hourly precipitation + radar + precipitation probability
    if (
      q.includes('rain') || 
      q.includes('precipitation') || 
      q.includes('shower') || 
      q.includes('umbrella') || 
      q.includes('storm') || 
      q.includes('drizzle') || 
      q.includes('downpour') || 
      q.includes('radar')
    ) {
      return 'rain';
    }

    // Outdoor exercise intent: temperature + AQI + UV + wind + rain
    if (
      q.includes('exercise') || 
      q.includes('workout') || 
      q.includes('run') || 
      q.includes('running') || 
      q.includes('jog') || 
      q.includes('jogging') || 
      q.includes('cycle') || 
      q.includes('cycling') || 
      q.includes('biking') || 
      q.includes('outdoor') || 
      q.includes('hike') || 
      q.includes('walk')
    ) {
      return 'outdoor_exercise';
    }

    // Commute intent: rain + visibility + wind + hourly forecast
    if (
      q.includes('commute') || 
      q.includes('drive') || 
      q.includes('driving') || 
      q.includes('traffic') || 
      q.includes('travel') || 
      q.includes('road') || 
      q.includes('visibility') || 
      q.includes('fog')
    ) {
      return 'commute';
    }

    // Temperature trend / drop intent
    if (
      q.includes('drop') || 
      q.includes('tonight') || 
      q.includes('night') || 
      q.includes('evening') || 
      q.includes('temperature') || 
      q.includes('cold') || 
      q.includes('hot') || 
      q.includes('warm')
    ) {
      return 'temperature_trend';
    }

    return 'general';
  }

  /**
   * Build structured JSON context containing ONLY data relevant to the user question
   * 
   * @param {Object} params
   * @param {string} params.question - The user query
   * @param {Object} [params.currentWeather] - Normalized current weather object
   * @param {Object} [params.hourlyForecast] - Normalized hourly forecast object
   * @param {Object} [params.dailyForecast] - Normalized daily forecast object
   * @param {Object} [params.airQuality] - Air quality telemetry
   * @param {Object} [params.sunInfo] - Sunrise/sunset/daylight telemetry
   * @param {Object} [params.radarInfo] - Doppler radar layer status
   * @param {string} [params.units] - Temperature unit ('F' or 'C')
   * @returns {Object} Structured JSON
   */
  buildContext({
    question = '',
    currentWeather = {},
    hourlyForecast = {},
    dailyForecast = {},
    airQuality = {},
    sunInfo = {},
    radarInfo = {},
    units = 'F',
  }) {
    const intent = this.detectIntent(question);

    const city = currentWeather?.location?.city || 'San Francisco';
    const region = currentWeather?.location?.region || 'CA';
    const country = currentWeather?.location?.country || 'United States';
    const lat = currentWeather?.location?.latitude ?? 37.7749;
    const lon = currentWeather?.location?.longitude ?? -122.4194;

    const locationObj = {
      city,
      region,
      country,
      latitude: lat,
      longitude: lon,
      localTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const rawCurrent = currentWeather?.current || {};
    const tempUnit = `°${units}`;
    const speedUnit = units === 'F' ? 'mph' : 'km/h';

    const currentTemp = rawCurrent.temperature ?? 68;
    const feelsLike = rawCurrent.feelsLike ?? currentTemp;
    const condition = rawCurrent.condition || 'Partly Cloudy';
    const humidity = rawCurrent.humidity ?? 50;
    const windSpeed = rawCurrent.windSpeed ?? 10;
    const windCardinal = rawCurrent.windCardinal || 'NW';
    const precipChance = rawCurrent.precipitationChance ?? 10;
    const uvIndex = rawCurrent.uvIndex ?? 4;
    const visibility = rawCurrent.visibility ?? 10;
    const pressure = rawCurrent.pressure ?? 1013;

    let currentObj = {};
    let hourlyList = [];
    let dailyList = [];
    let airQualityObj = {};
    let sunObj = {};
    let relevantDataObj = {};

    const rawHourly = hourlyForecast?.hourly || [];
    const rawDaily = dailyForecast?.daily || [];

    switch (intent) {
      case 'clothing':
        // Clothing question: temperature + feels-like + rain + wind + UV
        currentObj = {
          temperature: `${currentTemp}${tempUnit}`,
          feelsLike: `${feelsLike}${tempUnit}`,
          condition,
          precipitationChance: `${precipChance}%`,
          wind: `${windSpeed} ${speedUnit} ${windCardinal}`,
          uvIndex: `${uvIndex} (${rawCurrent.uvRisk || 'Moderate'})`,
        };

        // Short 6-hour hourly window for temperature & rain trends
        hourlyList = rawHourly.slice(0, 6).map((h) => ({
          time: h.hourLabel,
          temp: `${h.temperature}${tempUnit}`,
          feelsLike: `${h.feelsLike}${tempUnit}`,
          precipChance: `${h.precipitationChance}%`,
          condition: h.condition,
        }));

        // Minimal daily summary for high/low
        dailyList = rawDaily.slice(0, 1).map((d) => ({
          day: d.dayName,
          tempMax: `${d.tempMax}${tempUnit}`,
          tempMin: `${d.tempMin}${tempUnit}`,
          condition: d.condition,
        }));

        relevantDataObj = {
          category: 'clothing',
          requiredMetrics: ['temperature', 'feelsLike', 'rain', 'wind', 'UV'],
          layeringAdviceKey: currentTemp < 55 ? 'heavy_jacket_and_layers' : currentTemp < 70 ? 'light_sweater_or_jacket' : 'breathable_cotton',
          umbrellaRecommended: precipChance >= 30,
        };
        break;

      case 'rain':
        // Rain question: hourly precipitation + radar + precipitation probability
        currentObj = {
          precipitationChance: `${precipChance}%`,
          condition,
          humidity: `${humidity}%`,
          rainAmount: `${rawCurrent.rainAmount || 0} in`,
        };

        // Next 12 hours detailed hourly precipitation
        hourlyList = rawHourly.slice(0, 12).map((h) => ({
          time: h.hourLabel,
          precipChance: `${h.precipitationChance}%`,
          condition: h.condition,
          windSpeed: `${h.windSpeed} ${speedUnit}`,
        }));

        // Next 3 days rain chances
        dailyList = rawDaily.slice(0, 3).map((d) => ({
          day: d.dayName,
          precipChance: `${d.precipitationChance}%`,
          condition: d.condition,
        }));

        relevantDataObj = {
          category: 'rain',
          requiredMetrics: ['hourly precipitation', 'radar', 'precipitation probability'],
          radarStatus: radarInfo?.status || (precipChance >= 40 ? 'Active Rain Cells Detected' : 'Clear Radar Reflectivity'),
          peakRainHours: hourlyList.filter((h) => parseInt(h.precipChance, 10) >= 30).map((h) => `${h.time} (${h.precipChance})`),
          umbrellaNeeded: precipChance >= 30 || hourlyList.some((h) => parseInt(h.precipChance, 10) >= 30),
        };
        break;

      case 'outdoor_exercise':
        // Outdoor exercise: temperature + AQI + UV + wind + rain
        currentObj = {
          temperature: `${currentTemp}${tempUnit}`,
          feelsLike: `${feelsLike}${tempUnit}`,
          condition,
          uvIndex: `${uvIndex} (${rawCurrent.uvRisk || 'Moderate'})`,
          wind: `${windSpeed} ${speedUnit} ${windCardinal}`,
          precipitationChance: `${precipChance}%`,
          humidity: `${humidity}%`,
        };

        airQualityObj = {
          aqi: airQuality?.aqi ?? 35,
          category: airQuality?.category || 'Good',
          pm25: airQuality?.pm25 ?? 8.5,
          pm10: airQuality?.pm10 ?? 14.2,
          healthRecommendation: airQuality?.healthRecommendation || 'Air quality is favorable for outdoor exercise.',
        };

        sunObj = {
          sunrise: sunInfo?.sunrise || rawCurrent.sunrise || '6:35 AM',
          sunset: sunInfo?.sunset || rawCurrent.sunset || '7:48 PM',
          daylightHours: sunInfo?.daylightHours || '13h 13m',
        };

        // Next 8 hours exercise suitability curve
        hourlyList = rawHourly.slice(0, 8).map((h) => ({
          time: h.hourLabel,
          temp: `${h.temperature}${tempUnit}`,
          precipChance: `${h.precipitationChance}%`,
          uvIndex: h.uvIndex ?? 2,
          windSpeed: `${h.windSpeed} ${speedUnit}`,
          condition: h.condition,
        }));

        relevantDataObj = {
          category: 'outdoor_exercise',
          requiredMetrics: ['temperature', 'AQI', 'UV', 'wind', 'rain'],
          exerciseSuitabilityIndex: (airQuality?.aqi ?? 35) <= 50 && precipChance < 30 ? 'Optimal Outdoor Workout Conditions' : 'Moderate Outdoor Exercise Caution',
          bestWorkoutWindow: 'Midday to Early Afternoon',
        };
        break;

      case 'commute':
        // Commute: rain + visibility + wind + hourly forecast
        currentObj = {
          precipitationChance: `${precipChance}%`,
          visibility: `${visibility} miles`,
          wind: `${windSpeed} ${speedUnit} ${windCardinal}`,
          condition,
          temperature: `${currentTemp}${tempUnit}`,
        };

        // Next 12 hours hourly forecast for commute tracking
        hourlyList = rawHourly.slice(0, 12).map((h) => ({
          time: h.hourLabel,
          temp: `${h.temperature}${tempUnit}`,
          precipChance: `${h.precipitationChance}%`,
          visibility: `${h.visibility ?? visibility} miles`,
          windSpeed: `${h.windSpeed} ${speedUnit}`,
          condition: h.condition,
        }));

        relevantDataObj = {
          category: 'commute',
          requiredMetrics: ['rain', 'visibility', 'wind', 'hourly forecast'],
          visibilityImpact: visibility < 3 ? 'Heavy Fog / Reduced Visibility' : 'Clear Driving Visibility',
          hazardLevel: precipChance > 50 || visibility < 5 ? 'Exercise Driving Caution' : 'Normal Driving Conditions',
        };
        break;

      case 'temperature_trend':
        // Temperature drop / evening question
        currentObj = {
          temperature: `${currentTemp}${tempUnit}`,
          feelsLike: `${feelsLike}${tempUnit}`,
          tempMin: `${rawCurrent.tempMin ?? currentTemp - 5}${tempUnit}`,
          tempMax: `${rawCurrent.tempMax ?? currentTemp + 5}${tempUnit}`,
          condition,
          humidity: `${humidity}%`,
          wind: `${windSpeed} ${speedUnit}`,
        };

        hourlyList = rawHourly.slice(0, 12).map((h) => ({
          time: h.hourLabel,
          temp: `${h.temperature}${tempUnit}`,
          feelsLike: `${h.feelsLike}${tempUnit}`,
          condition: h.condition,
        }));

        dailyList = rawDaily.slice(0, 3).map((d) => ({
          day: d.dayName,
          tempMax: `${d.tempMax}${tempUnit}`,
          tempMin: `${d.tempMin}${tempUnit}`,
          condition: d.condition,
        }));

        sunObj = {
          sunset: sunInfo?.sunset || rawCurrent.sunset || '7:48 PM',
        };

        relevantDataObj = {
          category: 'temperature_trend',
          requiredMetrics: ['temperature', 'feelsLike', 'tempMin', 'tempMax', 'hourlyTrend'],
          expectedDrop: `${Math.abs(currentTemp - (rawCurrent.tempMin ?? currentTemp - 5))}${tempUnit} drop expected overnight`,
        };
        break;

      default:
        // General query
        currentObj = {
          temperature: `${currentTemp}${tempUnit}`,
          feelsLike: `${feelsLike}${tempUnit}`,
          tempMin: `${rawCurrent.tempMin ?? currentTemp - 5}${tempUnit}`,
          tempMax: `${rawCurrent.tempMax ?? currentTemp + 5}${tempUnit}`,
          condition,
          humidity: `${humidity}%`,
          wind: `${windSpeed} ${speedUnit} ${windCardinal}`,
          precipitationChance: `${precipChance}%`,
          uvIndex: `${uvIndex}`,
          visibility: `${visibility} miles`,
          pressure: `${pressure} hPa`,
        };

        hourlyList = rawHourly.slice(0, 8).map((h) => ({
          time: h.hourLabel,
          temp: `${h.temperature}${tempUnit}`,
          feelsLike: `${h.feelsLike}${tempUnit}`,
          condition: h.condition,
          precipChance: `${h.precipitationChance}%`,
          windSpeed: `${h.windSpeed} ${speedUnit}`,
        }));

        dailyList = rawDaily.slice(0, 5).map((d) => ({
          day: d.dayName,
          date: d.date,
          tempMax: `${d.tempMax}${tempUnit}`,
          tempMin: `${d.tempMin}${tempUnit}`,
          condition: d.condition,
          precipChance: `${d.precipitationChance}%`,
        }));

        airQualityObj = {
          aqi: airQuality?.aqi ?? 35,
          category: airQuality?.category || 'Good',
        };

        sunObj = {
          sunrise: sunInfo?.sunrise || rawCurrent.sunrise || '6:35 AM',
          sunset: sunInfo?.sunset || rawCurrent.sunset || '7:48 PM',
        };

        relevantDataObj = {
          category: 'general',
          requiredMetrics: ['current', 'hourly', 'daily', 'airQuality', 'sun'],
          summary: 'Full atmospheric telemetry overview',
        };
        break;
    }

    return {
      location: locationObj,
      current: currentObj,
      hourly: hourlyList,
      daily: dailyList,
      airQuality: airQualityObj,
      sun: sunObj,
      relevantData: relevantDataObj,
    };
  }
}

export const weatherContextBuilder = new WeatherContextBuilder();
export default weatherContextBuilder;
