/**
 * Atmosphere AI - Reusable Forecast Data Model
 * 
 * Provides an object-oriented, reusable domain model for 7-day extended forecasts.
 * Centralizes temperature unit conversion, atmospheric comfort thresholds,
 * precipitation severity levels, and diurnal segment analysis.
 * 
 * Ready for mock data today, and drop-in compatible with future REST/GraphQL APIs.
 */

export class ForecastDay {
  constructor(data = {}) {
    this.id = data.id || `day-${data.day || Math.random().toString(36).substring(2, 9)}`;
    this.day = data.day || 'Today';
    this.dayFull = data.dayFull || data.day || 'Today';
    this.date = data.date || 'Today';
    this.condition = data.condition || 'Partly Cloudy';
    this.iconCode = data.iconCode || 'partly-cloudy-day';

    // Temperature metrics
    this.highF = typeof data.highF === 'number' ? data.highF : (data.high ? Math.round(data.high) : 70);
    this.highC = typeof data.highC === 'number' ? data.highC : Math.round(((this.highF - 32) * 5) / 9);
    this.lowF = typeof data.lowF === 'number' ? data.lowF : (data.low ? Math.round(data.low) : 52);
    this.lowC = typeof data.lowC === 'number' ? data.lowC : Math.round(((this.lowF - 32) * 5) / 9);

    // Atmospheric metrics
    this.pop = typeof data.pop === 'number' ? data.pop : (data.rainChance || 0); // Rain probability %
    this.precipitationAmount = data.precipitationAmount || (this.pop > 30 ? '0.12 in' : '0.00 in');
    this.precipitationType = data.precipitationType || (this.pop > 0 ? (this.lowF <= 32 ? 'snow' : 'rain') : 'none');

    this.windMph = typeof data.windMph === 'number' ? data.windMph : 10;
    this.windKmh = typeof data.windKmh === 'number' ? data.windKmh : Math.round(this.windMph * 1.609);
    this.windDirection = data.windDirection || 'NW';
    this.windGustMph = typeof data.windGustMph === 'number' ? data.windGustMph : Math.round(this.windMph * 1.35);
    this.windGustKmh = Math.round(this.windGustMph * 1.609);

    this.humidity = typeof data.humidity === 'number' ? data.humidity : 50;
    this.uvIndex = typeof data.uvIndex === 'number' ? data.uvIndex : 5;
    this.pressureHpa = typeof data.pressureHpa === 'number' ? data.pressureHpa : 1013;
    this.dewPointF = typeof data.dewPointF === 'number' ? data.dewPointF : Math.round(this.lowF - 4);
    this.dewPointC = Math.round(((this.dewPointF - 32) * 5) / 9);
    this.cloudCover = typeof data.cloudCover === 'number' ? data.cloudCover : 20;

    // Astronomy
    this.sunrise = data.sunrise || '6:30 AM';
    this.sunset = data.sunset || '7:45 PM';
    this.daylightDuration = data.daylightDuration || '13h 15m';

    // Editorial and advice
    this.summary = data.summary || 'Consistent seasonal conditions with mild diurnal temperature variance.';
    this.recommendations = data.recommendations || {
      attire: 'Light layers recommended; jacket suitable for evening cooling.',
      outdoor: 'Favorable conditions for daytime recreation and commute.',
      advisory: null,
    };

    // Diurnal segments (Morning, Afternoon, Evening, Overnight)
    this.dayParts = data.dayParts || this._generateDefaultDayParts();
  }

  _generateDefaultDayParts() {
    return [
      {
        part: 'Morning',
        time: '8:00 AM',
        tempF: this.lowF + 4,
        tempC: Math.round(((this.lowF + 4 - 32) * 5) / 9),
        condition: this.condition.includes('Fog') ? 'Cool Fog' : 'Crisp Morning',
        iconCode: this.iconCode.includes('rain') ? 'drizzle' : 'clear-day',
        pop: Math.max(0, this.pop - 10),
      },
      {
        part: 'Afternoon',
        time: '2:00 PM',
        tempF: this.highF,
        tempC: this.highC,
        condition: this.condition,
        iconCode: this.iconCode,
        pop: this.pop,
      },
      {
        part: 'Evening',
        time: '7:00 PM',
        tempF: Math.round(this.highF - 6),
        tempC: Math.round(((this.highF - 6 - 32) * 5) / 9),
        condition: 'Breezy Dusk',
        iconCode: 'partly-cloudy-day',
        pop: Math.round(this.pop * 0.7),
      },
      {
        part: 'Overnight',
        time: '11:00 PM',
        tempF: this.lowF,
        tempC: this.lowC,
        condition: 'Clear Night',
        iconCode: 'clear-night',
        pop: Math.round(this.pop * 0.4),
      },
    ];
  }

  // Getters & Formatting Helpers
  getHigh(unit = 'F') {
    return unit === 'C' ? this.highC : this.highF;
  }

  getLow(unit = 'F') {
    return unit === 'C' ? this.lowC : this.lowF;
  }

  getFormattedHigh(unit = 'F') {
    return `${this.getHigh(unit)}°`;
  }

  getFormattedLow(unit = 'F') {
    return `${this.getLow(unit)}°`;
  }

  getTempSpread(unit = 'F') {
    return this.getHigh(unit) - this.getLow(unit);
  }

  getWindSpeed(unit = 'F') {
    return unit === 'C' ? this.windKmh : this.windMph;
  }

  getFormattedWind(unit = 'F') {
    const speed = this.getWindSpeed(unit);
    const speedUnit = unit === 'C' ? 'km/h' : 'mph';
    return `${speed} ${speedUnit} ${this.windDirection}`;
  }

  getFormattedRainProb() {
    return `${this.pop}%`;
  }

  getFormattedHumidity() {
    return `${this.humidity}%`;
  }

  getRainSeverity() {
    if (this.pop >= 60) return { label: 'High Rain Risk', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    if (this.pop >= 30) return { label: 'Scattered Showers', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (this.pop >= 15) return { label: 'Isolated Drizzle', color: 'text-slate-300', bg: 'bg-slate-800/40' };
    return { label: 'Dry & Clear', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  }

  getUvDetails() {
    if (this.uvIndex >= 8) return { label: 'Very High', color: 'text-rose-400', advice: 'Extra protection required; seek shade midday.' };
    if (this.uvIndex >= 6) return { label: 'High', color: 'text-orange-400', advice: 'Wear hat, sunglasses, and apply SPF 30+.' };
    if (this.uvIndex >= 3) return { label: 'Moderate', color: 'text-amber-400', advice: 'Take precautions if outside during midday peak.' };
    return { label: 'Low', color: 'text-emerald-400', advice: 'No special sun protection required.' };
  }

  getHumidityCategory() {
    if (this.humidity >= 70) return { label: 'Humid', note: 'Higher moisture retention' };
    if (this.humidity >= 40) return { label: 'Comfortable', note: 'Optimal human comfort envelope' };
    return { label: 'Dry', note: 'Low atmospheric moisture' };
  }
}

/**
 * SevenDayForecastModel
 * Encapsulates a complete 7-day meteorological forecast sequence
 * with statistical aggregates, week envelopes, and domain helpers.
 */
export class SevenDayForecastModel {
  constructor(days = [], metadata = {}) {
    this.days = (days || []).map((d) => (d instanceof ForecastDay ? d : new ForecastDay(d)));
    this.locationId = metadata.locationId || 'san-francisco';
    this.locationName = metadata.locationName || 'San Francisco';
    this.confidenceScore = metadata.confidenceScore || '94%';
    this.modelSource = metadata.modelSource || 'GFS & ECMWF Multi-Model Ensemble';
    this.lastUpdated = metadata.lastUpdated || 'Live Sync';
  }

  get length() {
    return this.days.length;
  }

  getDay(index) {
    return this.days[index] || null;
  }

  getWeekHigh(unit = 'F') {
    if (!this.days.length) return 75;
    return Math.max(...this.days.map((d) => d.getHigh(unit)));
  }

  getWeekLow(unit = 'F') {
    if (!this.days.length) return 50;
    return Math.min(...this.days.map((d) => d.getLow(unit)));
  }

  getAverageHigh(unit = 'F') {
    if (!this.days.length) return 70;
    const sum = this.days.reduce((acc, d) => acc + d.getHigh(unit), 0);
    return Math.round(sum / this.days.length);
  }

  getAverageLow(unit = 'F') {
    if (!this.days.length) return 52;
    const sum = this.days.reduce((acc, d) => acc + d.getLow(unit), 0);
    return Math.round(sum / this.days.length);
  }

  getHottestDay(unit = 'F') {
    if (!this.days.length) return null;
    return [...this.days].sort((a, b) => b.getHigh(unit) - a.getHigh(unit))[0];
  }

  getCoolestDay(unit = 'F') {
    if (!this.days.length) return null;
    return [...this.days].sort((a, b) => a.getLow(unit) - b.getLow(unit))[0];
  }

  getWettestDay() {
    if (!this.days.length) return null;
    return [...this.days].sort((a, b) => b.pop - a.pop)[0];
  }

  getWindiestDay(unit = 'F') {
    if (!this.days.length) return null;
    return [...this.days].sort((a, b) => b.getWindSpeed(unit) - a.getWindSpeed(unit))[0];
  }

  getRainyDaysCount() {
    return this.days.filter((d) => d.pop >= 30).length;
  }

  /**
   * Factory method: instantiate from raw daily forecast array
   */
  static fromRawDailyData(rawArray = [], metadata = {}) {
    return new SevenDayForecastModel(rawArray, metadata);
  }
}

export default SevenDayForecastModel;
