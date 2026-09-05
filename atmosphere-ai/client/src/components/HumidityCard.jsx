import React from 'react';
import { Droplets } from 'lucide-react';
import BaseWeatherMetricCard from './BaseWeatherMetricCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MOCK_CURRENT_WEATHER } from '../data/mockWeatherData.js';

/**
 * HumidityCard Component
 * Displays Relative Humidity percentage, comfort index status, dew point, and moisture level bar.
 * 
 * Example:
 *   Humidity: 74% Comfortable
 */
export default function HumidityCard({
  title = 'Humidity',
  value,
  unit,
  status,
  statusVariant,
  description,
  icon: Icon = Droplets,
  visualization,
  footer,
  weather,
  data,
  className = '',
  onClick,
  ...rest
}) {
  const appContext = useApp?.() || {};
  const activeUnit = appContext.unit || 'F';
  const activeLocation = appContext.activeLocation?.id || 'san-francisco';
  const mockWeather = MOCK_CURRENT_WEATHER[activeLocation] || MOCK_CURRENT_WEATHER['san-francisco'];

  const raw = weather || data || mockWeather;
  const rawHumidity = raw?.humidity ?? 74;

  const rawDewPoint = activeUnit === 'C'
    ? `${raw?.dewPointC ?? 8}°C`
    : `${raw?.dewPointF ?? 46}°F`;

  // Format value: if value is provided as number, append % or handle string
  const resolvedValue = 
    value !== undefined 
      ? (typeof value === 'number' ? `${value}%` : value)
      : `${rawHumidity}%`;

  const numHumidity = typeof rawHumidity === 'number' ? rawHumidity : parseInt(rawHumidity, 10) || 74;

  const resolvedStatus = 
    status !== undefined 
      ? status 
      : (numHumidity < 30 ? 'Dry' : numHumidity <= 75 ? 'Comfortable' : 'High Moisture');

  const resolvedDescription = 
    description !== undefined 
      ? description 
      : `Dew point estimated at ${rawDewPoint}`;

  const resolvedFooter = 
    footer !== undefined 
      ? footer 
      : (numHumidity <= 65 
          ? 'Comfortable respiratory index with clear air.' 
          : 'Moist atmospheric moisture profile across the area.');

  const defaultVisualization = (
    <div>
      <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden relative mt-1">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(5, numHumidity))}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
        <span>0% Dry</span>
        <span>50% Balanced</span>
        <span>100% Humid</span>
      </div>
    </div>
  );

  return (
    <BaseWeatherMetricCard
      id="weather-metric-humidity"
      title={title}
      value={resolvedValue}
      unit={unit}
      status={resolvedStatus}
      statusVariant={statusVariant}
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
