import React from 'react';
import { Wind, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import BaseWeatherMetricCard from './BaseWeatherMetricCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAirHealthQuery } from '../hooks/useWeatherQuery.js';
import { MOCK_AIR_HEALTH, MOCK_CURRENT_WEATHER } from '../data/mockWeatherData.js';

/**
 * AirQualityCard Component
 * Displays live Air Quality Index (AQI), status, pollutant concentrations (PM2.5, PM10, O3, NO2, CO),
 * and dynamic spectrum visualization from the backend Air Quality Service.
 * Includes built-in loading and error states.
 */
export default function AirQualityCard({
  title = 'Air Quality',
  value,
  unit,
  status,
  statusVariant,
  description,
  icon: Icon = Wind,
  visualization,
  footer,
  airHealth: propAirHealth,
  weather,
  data,
  isLoading: propIsLoading,
  isError: propIsError,
  error: propError,
  onRetry,
  className = '',
  onClick,
  ...rest
}) {
  const appContext = useApp?.() || {};
  const activeLocation = appContext.activeLocation?.id || 'san-francisco';

  // Self-fetch if airHealth not directly supplied
  const {
    data: fetchedAirHealth,
    isLoading: queryIsLoading,
    isError: queryIsError,
    error: queryError,
    refetch,
  } = useAirHealthQuery(appContext.activeLocation || activeLocation);

  const airHealth = propAirHealth || fetchedAirHealth;
  const isLoading = propIsLoading !== undefined ? propIsLoading : (!propAirHealth && queryIsLoading);
  const isError = propIsError !== undefined ? propIsError : (!propAirHealth && queryIsError);
  const error = propError || queryError;

  const handleRetry = () => {
    if (onRetry) onRetry();
    else refetch?.();
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className={`p-5 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl flex flex-col justify-between min-h-[190px] animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
            <div className="h-4 w-24 bg-slate-800 rounded" />
          </div>
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
        </div>

        <div className="my-3 space-y-2">
          <div className="h-8 w-20 bg-slate-800 rounded" />
          <div className="h-3 w-32 bg-slate-800/70 rounded" />
        </div>

        <div className="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden mt-2" />
        <div className="text-[10px] text-slate-500 mt-2 font-mono flex justify-between">
          <span>Loading backend sensors...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className={`p-5 rounded-3xl bg-slate-900/40 border border-rose-500/30 backdrop-blur-xl flex flex-col justify-between min-h-[190px] ${className}`}>
        <div className="flex items-center justify-between text-rose-400 mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-semibold text-rose-300">Air Quality Error</span>
          </div>
          <button
            onClick={handleRetry}
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition flex items-center gap-1 text-[11px]"
            title="Retry telemetry"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 my-2 line-clamp-2">
          {error?.message || 'Unable to retrieve air quality telemetry from backend.'}
        </p>

        <div className="text-[11px] font-mono text-slate-500 border-t border-slate-800/60 pt-2 flex justify-between items-center">
          <span>Sensor Disconnected</span>
          <span className="text-rose-400 cursor-pointer underline" onClick={handleRetry}>Tap to reconnect</span>
        </div>
      </div>
    );
  }

  // Fallback to centralized mock data if still missing
  const mockAir = MOCK_AIR_HEALTH[activeLocation] || MOCK_AIR_HEALTH['san-francisco'];
  const mockWeather = MOCK_CURRENT_WEATHER[activeLocation] || MOCK_CURRENT_WEATHER['san-francisco'];

  const resolvedValue =
    value !== undefined
      ? value
      : (airHealth?.aqi ?? weather?.aqi ?? data?.aqi ?? mockAir?.aqi ?? mockWeather?.aqi ?? 38);

  const resolvedStatus =
    status !== undefined
      ? status
      : (airHealth?.category ?? airHealth?.status ?? weather?.aqiStatus ?? data?.category ?? mockAir?.category ?? 'Good');

  // Formulate description with key pollutants
  const pm25Val = airHealth?.pm25 ?? airHealth?.pollutants?.pm2_5?.value ?? mockAir?.pm25;
  const pm10Val = airHealth?.pm10 ?? airHealth?.pollutants?.pm10?.value ?? mockAir?.pm10;
  const o3Val = airHealth?.ozone ?? airHealth?.o3 ?? airHealth?.pollutants?.ozone?.value ?? mockAir?.o3;

  const resolvedDescription =
    description !== undefined
      ? description
      : pm25Val !== undefined
        ? `PM2.5: ${pm25Val} µg/m³ • PM10: ${pm10Val || '--'} • O₃: ${o3Val || '--'}`
        : 'Satisfactory air quality with clean particulate levels.';

  const resolvedFooter =
    footer !== undefined
      ? footer
      : (airHealth?.healthRecommendation ?? mockAir?.healthRecommendation);

  // Status variant styling
  let computedVariant = statusVariant || airHealth?.statusVariant;
  if (!computedVariant) {
    const num = Number(resolvedValue) || 38;
    if (num <= 50) computedVariant = 'success';
    else if (num <= 100) computedVariant = 'warning';
    else computedVariant = 'danger';
  }

  // Default spectrum visualization
  const numValue = typeof resolvedValue === 'number' ? resolvedValue : parseInt(resolvedValue, 10) || 38;
  const clampedPercent = Math.min(100, Math.max(8, (numValue / 200) * 100));

  const defaultVisualization = (
    <div>
      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden relative">
        <div
          className="bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
        <span className="text-emerald-400">0 Good</span>
        <span className="text-amber-400">50 Mod</span>
        <span className="text-rose-400">150+ Poor</span>
      </div>
    </div>
  );

  return (
    <BaseWeatherMetricCard
      id="weather-metric-air-quality"
      title={title}
      value={resolvedValue}
      unit={unit}
      status={resolvedStatus}
      statusVariant={computedVariant}
      description={resolvedDescription}
      icon={Icon}
      footer={resolvedFooter}
      visualization={visualization === undefined || visualization === true ? defaultVisualization : visualization}
      className={className}
      onClick={onClick}
      {...rest}
    />
  );
}
