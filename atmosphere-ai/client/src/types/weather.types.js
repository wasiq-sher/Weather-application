/**
 * Atmosphere AI - Centralized Weather Data Model & Types
 * 
 * Defines standard data contracts for:
 * - Locations
 * - Current Weather
 * - Hourly & Extended Forecasts
 * - Air Quality & Health Biometeorology
 * - Solar & Lunar Astronomical Telemetry
 * - Radar Layers & Weather Alerts
 * - User Preferences
 */

/**
 * @typedef {Object} Location
 * @property {string} id - Unique identifier (e.g., "san-francisco")
 * @property {string} name - City name
 * @property {string} region - State or district
 * @property {string} country - Country name or code
 * @property {number} lat - Latitude coordinate
 * @property {number} lon - Longitude coordinate
 * @property {string} timezone - IANA timezone string
 * @property {string} localTime - Formatted current local time
 * @property {boolean} [isDefault] - Whether this is the default location
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {string} locationId
 * @property {number} tempF
 * @property {number} tempC
 * @property {number} feelsLikeF
 * @property {number} feelsLikeC
 * @property {number} highF
 * @property {number} highC
 * @property {number} lowF
 * @property {number} lowC
 * @property {string} condition - e.g., "Sunny & Mild"
 * @property {string} iconCode - e.g., "clear-day", "partly-cloudy-day", "rain"
 * @property {number} humidity - Relative humidity percentage (0-100)
 * @property {number} uvIndex - UV Index (0-12+)
 * @property {string} uvLevel - e.g., "Low", "Moderate", "High", "Extreme"
 * @property {number} aqi - Air Quality Index (0-500)
 * @property {string} aqiStatus - e.g., "Good", "Moderate", "Unhealthy"
 * @property {number} pressureHpa - Atmospheric pressure
 * @property {number} windMph
 * @property {number} windKmh
 * @property {string} windDirection - e.g., "NW", "SSW"
 * @property {number} windGustMph
 * @property {number} visibilityMiles
 * @property {number} visibilityKm
 * @property {number} dewPointF
 * @property {number} dewPointC
 * @property {number} cloudCover - Percentage (0-100)
 * @property {string} sunrise - e.g., "6:32 AM"
 * @property {string} sunset - e.g., "7:45 PM"
 * @property {string} summary - Comprehensive AI-generated summary
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} HourlyForecastItem
 * @property {string} time - e.g., "1 PM", "Now"
 * @property {number} hour24 - e.g., 13
 * @property {number} tempF
 * @property {number} tempC
 * @property {string} condition
 * @property {string} iconCode
 * @property {number} pop - Probability of precipitation (0-100)
 * @property {string} [precipitationType] - "rain", "snow", "fog", "shower"
 * @property {number} humidity
 * @property {number} windMph
 * @property {boolean} isNow
 */

/**
 * @typedef {Object} DailyForecastItem
 * @property {string} day - e.g., "Mon", "Tue", "Today"
 * @property {string} date - e.g., "Sep 4"
 * @property {number} highF
 * @property {number} highC
 * @property {number} lowF
 * @property {number} lowC
 * @property {string} condition
 * @property {string} iconCode
 * @property {number} pop - Probability of precipitation
 * @property {number} humidity
 * @property {number} windMph
 * @property {number} uvIndex
 * @property {string} summary
 */

/**
 * @typedef {Object} AirHealthMetrics
 * @property {number} aqi - Air Quality Index (0-500)
 * @property {string} category - "Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy"
 * @property {string} dominantPollutant - e.g., "PM2.5"
 * @property {number} pm25 - µg/m³
 * @property {number} pm10 - µg/m³
 * @property {number} o3 - ppb (Ozone)
 * @property {number} no2 - ppb (Nitrogen Dioxide)
 * @property {number} co - ppm (Carbon Monoxide)
 * @property {number} so2 - ppb (Sulfur Dioxide)
 * @property {string} healthRecommendation
 * @property {string} outdoorActivityRisk - "Minimal", "Low", "Moderate", "High"
 * @property {string} respiratoryRisk - "Clear", "Mild Caution", "Advisory"
 * @property {string} pollenTree - "Low", "Moderate", "High"
 * @property {string} pollenGrass - "Low", "Moderate", "High"
 */

/**
 * @typedef {Object} SunMoonMetrics
 * @property {string} sunrise
 * @property {string} sunset
 * @property {string} dawn - Astronomical or civil twilight
 * @property {string} dusk
 * @property {string} daylightDuration - e.g., "13h 13m"
 * @property {string} solarNoon - e.g., "1:08 PM"
 * @property {number} sunAltitudeDeg - e.g., 54.2
 * @property {string} goldenHourMorning - e.g., "6:32 AM - 7:15 AM"
 * @property {string} goldenHourEvening - e.g., "7:05 PM - 7:45 PM"
 * @property {string} moonPhase - e.g., "Waxing Gibbous", "Full Moon"
 * @property {number} moonIlluminationPct - 0 to 100
 * @property {string} moonrise - e.g., "4:18 PM"
 * @property {string} moonset - e.g., "3:45 AM"
 * @property {number} moonAgeDays - Days into cycle
 */

/**
 * @typedef {Object} WeatherAlert
 * @property {string} id
 * @property {string} severity - "advisory", "watch", "warning"
 * @property {string} event
 * @property {string} headline
 * @property {string} description
 * @property {string} effective
 * @property {string} expires
 */

export const TemperatureUnits = {
  FAHRENHEIT: 'F',
  CELSIUS: 'C',
};

export const WindUnits = {
  MPH: 'mph',
  KMH: 'km/h',
  MS: 'm/s',
  KNOTS: 'knots',
};

export const PressureUnits = {
  HPA: 'hPa',
  INHG: 'inHg',
  MBAR: 'mbar',
};

export const RadarLayers = {
  RAIN: 'rain',
  WIND: 'wind',
  CLOUDS: 'clouds',
  TEMPERATURE: 'temp',
};
