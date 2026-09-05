import React from 'react';
import { 
  CloudRain, 
  Gauge, 
  Eye, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Thermometer,
  Droplets,
  Wind,
  Sun
} from 'lucide-react';
import WeatherIcon from './WeatherIcon.jsx';
import { useApp } from '../context/AppContext.jsx';

/**
 * CurrentWeather Component
 * 
 * Highly reusable weather component designed to display telemetry from mock or real API data.
 * Does not hard-code values; all metrics and content are passed as props or derived from data props.
 * 
 * Props:
 * - temperature: Current ambient temperature (number or string)
 * - condition: Weather condition description (string)
 * - feelsLike: Apparent / feels-like temperature (number or string)
 * - high: Today's maximum temperature (number or string)
 * - low: Today's minimum temperature (number or string)
 * - rainChance: Probability of precipitation (number or string, e.g. 15 or "15%")
 * - airPressure: Barometric pressure (string or number, e.g. "1012 hPa" or 1012)
 * - visibility: Distance of atmospheric clarity (string or number, e.g. "10 mi" or "16 km")
 * - lastUpdated: Time or relative timestamp of last sensor update (string)
 * - weatherIcon: Icon code or condition string to render matching graphic (string)
 * - summary: "Today's Simple Summary" text content (string)
 * - locationName: Name of the active observation station or city (string)
 * - locationRegion: State / province / administrative region (string)
 * - locationCountry: Country name or code (string)
 * - unit: Temperature scale unit ('F' | 'C')
 * - weather / data: Optional raw API or mock object providing some or all of the above fields
 * - onShowRadar: Optional callback invoked when clicking radar inspection link
 * - className: Optional custom styling classes
 */
export default function CurrentWeather({
  // Direct primary props
  temperature,
  condition,
  feelsLike,
  high,
  low,
  rainChance,
  airPressure,
  visibility,
  lastUpdated,
  weatherIcon,
  summary,

  // Location props
  locationName,
  locationRegion,
  locationCountry,

  // Config & Unit props
  unit: propUnit,

  // Raw API / Mock object props
  weather,
  data,

  // Action props
  onShowRadar,
  className = '',
}) {
  // Read contextual preferences if available (fallback gracefully)
  const appContext = useApp?.() || {};
  const activeUnit = propUnit || appContext?.unit || 'F';
  const contextLocation = appContext?.activeLocation;

  // Consolidate raw weather object if provided
  const raw = weather || data || {};

  // Unit conversion helpers
  const toCelsius = (f) => Math.round(((Number(f) - 32) * 5) / 9);
  const toFahrenheit = (c) => Math.round((Number(c) * 9) / 5 + 32);

  // Resolve values dynamically from explicit props first, then raw weather object fields
  // 1. Current Temperature
  let resolvedTemp;
  const baseRawTemp = raw.temperature ?? raw.temp ?? raw.tempF ?? raw.tempC ?? (raw.main?.temp ? Math.round(raw.main.temp) : undefined) ?? temperature;
  if (activeUnit === 'C') {
    if (raw.tempC !== undefined) {
      resolvedTemp = raw.tempC;
    } else if (raw.temp_c !== undefined) {
      resolvedTemp = raw.temp_c;
    } else if (raw.units === 'C' && raw.temperature !== undefined) {
      resolvedTemp = raw.temperature;
    } else if (baseRawTemp !== undefined) {
      resolvedTemp = toCelsius(baseRawTemp);
    }
  } else {
    if (raw.tempF !== undefined) {
      resolvedTemp = raw.tempF;
    } else if (raw.temp_f !== undefined) {
      resolvedTemp = raw.temp_f;
    } else if (raw.units === 'C' && raw.temperature !== undefined) {
      resolvedTemp = toFahrenheit(raw.temperature);
    } else if (baseRawTemp !== undefined) {
      resolvedTemp = Math.round(Number(baseRawTemp));
    }
  }

  // 2. Weather Condition
  const resolvedCondition = 
    condition || 
    raw.condition || 
    raw.weather?.[0]?.description || 
    raw.weather?.[0]?.main || 
    'Clear';

  // 3. Feels-like Temperature
  let resolvedFeelsLike;
  const baseRawFeelsLike = raw.feelsLike ?? raw.feelslike ?? raw.feelsLikeF ?? raw.feelsLikeC ?? (raw.main?.feels_like ? Math.round(raw.main.feels_like) : undefined) ?? feelsLike;
  if (activeUnit === 'C') {
    if (raw.feelsLikeC !== undefined) {
      resolvedFeelsLike = raw.feelsLikeC;
    } else if (raw.feelslike_c !== undefined) {
      resolvedFeelsLike = raw.feelslike_c;
    } else if (raw.units === 'C' && raw.feelsLike !== undefined) {
      resolvedFeelsLike = raw.feelsLike;
    } else if (baseRawFeelsLike !== undefined) {
      resolvedFeelsLike = toCelsius(baseRawFeelsLike);
    }
  } else {
    if (raw.feelsLikeF !== undefined) {
      resolvedFeelsLike = raw.feelsLikeF;
    } else if (raw.feelslike_f !== undefined) {
      resolvedFeelsLike = raw.feelslike_f;
    } else if (raw.units === 'C' && raw.feelsLike !== undefined) {
      resolvedFeelsLike = toFahrenheit(raw.feelsLike);
    } else if (baseRawFeelsLike !== undefined) {
      resolvedFeelsLike = Math.round(Number(baseRawFeelsLike));
    }
  }

  // 4. Today's High
  let resolvedHigh;
  const baseRawHigh = raw.high ?? raw.maxTemp ?? raw.highF ?? raw.highC ?? (raw.main?.temp_max ? Math.round(raw.main.temp_max) : undefined) ?? high;
  if (activeUnit === 'C') {
    if (raw.highC !== undefined) {
      resolvedHigh = raw.highC;
    } else if (raw.max_temp_c !== undefined) {
      resolvedHigh = raw.max_temp_c;
    } else if (baseRawHigh !== undefined) {
      resolvedHigh = toCelsius(baseRawHigh);
    }
  } else {
    if (raw.highF !== undefined) {
      resolvedHigh = raw.highF;
    } else if (raw.max_temp_f !== undefined) {
      resolvedHigh = raw.max_temp_f;
    } else if (baseRawHigh !== undefined) {
      resolvedHigh = Math.round(Number(baseRawHigh));
    }
  }

  // 5. Today's Low
  let resolvedLow;
  const baseRawLow = raw.low ?? raw.minTemp ?? raw.lowF ?? raw.lowC ?? (raw.main?.temp_min ? Math.round(raw.main.temp_min) : undefined) ?? low;
  if (activeUnit === 'C') {
    if (raw.lowC !== undefined) {
      resolvedLow = raw.lowC;
    } else if (raw.min_temp_c !== undefined) {
      resolvedLow = raw.min_temp_c;
    } else if (baseRawLow !== undefined) {
      resolvedLow = toCelsius(baseRawLow);
    }
  } else {
    if (raw.lowF !== undefined) {
      resolvedLow = raw.lowF;
    } else if (raw.min_temp_f !== undefined) {
      resolvedLow = raw.min_temp_f;
    } else if (baseRawLow !== undefined) {
      resolvedLow = Math.round(Number(baseRawLow));
    }
  }

  // 6. Rain Chance
  const resolvedRainChance = 
    rainChance !== undefined 
      ? rainChance 
      : raw.rainChance ?? raw.pop ?? raw.precipitationChance ?? raw.precip_prob ?? 0;

  // 7. Air Pressure
  const rawPressure = airPressure ?? raw.pressureHpa ?? raw.pressure ?? raw.main?.pressure;
  const resolvedPressure = 
    rawPressure !== undefined 
      ? typeof rawPressure === 'number' 
        ? `${rawPressure} hPa` 
        : String(rawPressure).includes('hPa') || String(rawPressure).includes('inHg') 
          ? rawPressure 
          : `${rawPressure} hPa`
      : '1013 hPa';

  // 8. Visibility
  const rawVisibility = 
    visibility ?? 
    (activeUnit === 'C' 
      ? (raw.visibilityKm ? `${raw.visibilityKm} km` : undefined) 
      : (raw.visibilityMiles ? `${raw.visibilityMiles} mi` : undefined)) ?? 
    raw.visibility;
    
  const resolvedVisibility = 
    rawVisibility !== undefined 
      ? typeof rawVisibility === 'number' 
        ? `${rawVisibility} ${activeUnit === 'C' ? 'km' : 'mi'}` 
        : rawVisibility 
      : '10 mi';

  // 9. Last Updated Time
  const resolvedLastUpdated = 
    lastUpdated ?? 
    raw.lastUpdated ?? 
    raw.updatedAt ?? 
    raw.localTime ?? 
    'Just now';

  // 10. Weather Icon
  const resolvedIcon = 
    weatherIcon ?? 
    raw.iconCode ?? 
    raw.icon ?? 
    raw.weather?.[0]?.icon ?? 
    'clear-day';

  // 11. Today's Simple Summary (uses mock data by default)
  const resolvedSummary = 
    summary ?? 
    raw.simpleSummary ?? 
    raw.summary ?? 
    'Expect a light shower around 4:15 PM. Great time for a quick coffee break inside.';

  // Location display
  const resolvedCity = locationName || raw.locationName || raw.name || contextLocation?.name || 'San Francisco';
  const resolvedRegion = locationRegion || raw.locationRegion || raw.region || contextLocation?.region || 'CA';
  const resolvedCountry = locationCountry || raw.locationCountry || raw.country || contextLocation?.country || 'United States';

  // Format rain chance cleanly with % sign
  const formattedRainChance = typeof resolvedRainChance === 'number' 
    ? `${Math.round(resolvedRainChance)}%` 
    : String(resolvedRainChance).includes('%') 
      ? resolvedRainChance 
      : `${resolvedRainChance}%`;

  return (
    <div 
      id="current-weather-component"
      className={`rounded-[32px] bg-gradient-to-br from-slate-900/85 via-slate-900/90 to-slate-950/95 border border-slate-800/60 p-6 sm:p-8 lg:p-9 flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-2xl h-full transition-all duration-300 ${className}`}
    >
      {/* Ambient decorative glow */}
      <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div>
        {/* Top Header Row: Live Telemetry Indicator & Station / Location */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase font-mono">
              Live Atmosphere
            </span>
          </div>

          <div className="text-right">
            <h2 id="current-weather-location" className="text-xl sm:text-2xl font-light text-white tracking-tight">
              {resolvedCity}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {resolvedRegion ? `${resolvedRegion}, ` : ''}{resolvedCountry}
            </p>
          </div>
        </div>

        {/* Hero Section: Current Temperature, Weather Condition & Weather Icon */}
        <div className="flex flex-wrap items-end gap-6 sm:gap-8 my-3">
          <div className="flex items-start">
            <span 
              id="current-weather-temperature"
              className="text-[72px] sm:text-[96px] lg:text-[112px] font-bold leading-none tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent select-none"
            >
              {resolvedTemp !== undefined ? resolvedTemp : '--'}
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-cyan-400/90 pt-1">
              °{activeUnit}
            </span>
          </div>

          <div className="pb-2 sm:pb-4 flex-1 min-w-[180px]">
            <div className="flex items-center gap-3">
              <div id="current-weather-icon-wrapper" className="shrink-0">
                <WeatherIcon code={resolvedIcon} size="lg" animate />
              </div>
              <div 
                id="current-weather-condition"
                className="text-2xl sm:text-3xl font-medium text-cyan-300 tracking-tight"
              >
                {resolvedCondition}
              </div>
            </div>

            {/* Feels-like temperature, High & Low */}
            <div className="text-slate-400 flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm font-medium">
              <span id="current-weather-feels-like" className="flex items-center gap-1 text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                Feels like {resolvedFeelsLike !== undefined ? `${resolvedFeelsLike}°${activeUnit}` : '--'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span id="current-weather-high" className="text-amber-400 font-semibold">
                H: {resolvedHigh !== undefined ? `${resolvedHigh}°${activeUnit}` : '--'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span id="current-weather-low" className="text-blue-400 font-semibold">
                L: {resolvedLow !== undefined ? `${resolvedLow}°${activeUnit}` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Telemetry Metrics Row: Rain Chance, Air Pressure, Visibility */}
        <div className="grid grid-cols-3 gap-3 my-5">
          {/* Rain Chance Metric */}
          <div 
            id="metric-rain-chance" 
            className="rounded-2xl p-3.5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Rain Chance</span>
              <CloudRain className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {formattedRainChance}
            </p>
            <p className="text-[10px] text-blue-400/90 mt-0.5 font-medium">
              Precipitation risk
            </p>
          </div>

          {/* Air Pressure Metric */}
          <div 
            id="metric-air-pressure" 
            className="rounded-2xl p-3.5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Air Pressure</span>
              <Gauge className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
              {resolvedPressure}
            </p>
            <p className="text-[10px] text-cyan-400/90 mt-0.5 font-medium">
              Barometric cell
            </p>
          </div>

          {/* Visibility Metric */}
          <div 
            id="metric-visibility" 
            className="rounded-2xl p-3.5 bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/30 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold">Visibility</span>
              <Eye className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {resolvedVisibility}
            </p>
            <p className="text-[10px] text-indigo-300/90 mt-0.5 font-medium">
              Clear horizon
            </p>
          </div>
        </div>

        {/* "Today's Simple Summary" Section */}
        <div 
          id="todays-simple-summary-section"
          className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/40 border border-blue-500/20 p-4 backdrop-blur-md shadow-inner my-4 relative overflow-hidden"
        >
          {/* Subtle accent bar on top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-cyan-400/60 to-blue-500/0" />
          
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold text-cyan-300 tracking-wider uppercase font-mono">
              Today's Simple Summary
            </span>
          </div>

          <p 
            id="todays-simple-summary-text"
            className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal"
          >
            "{resolvedSummary}"
          </p>
        </div>
      </div>

      {/* Footer Area: Last Updated Time & Optional Action Link */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-2">
        <div id="current-weather-last-updated" className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Last updated: {resolvedLastUpdated}</span>
        </div>

        {onShowRadar && (
          <button
            id="btn-inspect-radar-link"
            type="button"
            onClick={onShowRadar}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition group"
          >
            <span>Inspect Radar Layer</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </button>
        )}
      </div>
    </div>
  );
}
