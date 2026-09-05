import React from 'react';
import { Sun } from 'lucide-react';
import BaseWeatherMetricCard from './BaseWeatherMetricCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MOCK_CURRENT_WEATHER } from '../data/mockWeatherData.js';

/**
 * UVIndexCard Component
 * Displays Solar UV Radiation scale, category, and peak hours.
 * 
 * Example:
 *   UV: 4 of 11 Moderate
 */
export default function UVIndexCard({
  title = 'UV Index',
  value,
  unit = 'of 11',
  status,
  statusVariant,
  description,
  icon: Icon = Sun,
  visualization,
  footer,
  weather,
  data,
  className = '',
  onClick,
  ...rest
}) {
  const appContext = useApp?.() || {};
  const activeLocation = appContext.activeLocation?.id || 'san-francisco';
  const mockWeather = MOCK_CURRENT_WEATHER[activeLocation] || MOCK_CURRENT_WEATHER['san-francisco'];

  const resolvedValue = 
    value !== undefined 
      ? value 
      : (weather?.uvIndex ?? data?.uvIndex ?? mockWeather?.uvIndex ?? 4);

  const numValue = typeof resolvedValue === 'number' ? resolvedValue : parseFloat(resolvedValue) || 4;

  const resolvedStatus = 
    status !== undefined 
      ? status 
      : (weather?.uvLevel ?? data?.uvLevel ?? (
          numValue <= 2 ? 'Low' : numValue <= 5 ? 'Moderate' : numValue <= 7 ? 'High' : 'Very High'
        ));

  const resolvedDescription = 
    description !== undefined 
      ? description 
      : 'Peak intensity between 12:00 PM – 2:00 PM';

  const resolvedFooter = 
    footer !== undefined 
      ? footer 
      : (numValue <= 2 
          ? 'Minimal solar risk; no special protection needed.' 
          : 'Standard UV protection recommended during midday hours.');

  // Default UV gauge line visualization
  const clampedPercent = Math.min(95, Math.max(5, (numValue / 11) * 100));

  const defaultVisualization = (
    <div>
      <div className="w-full h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 relative mt-1">
        <div
          className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-950 shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-500"
          style={{ left: `${clampedPercent}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
        <span>0 Low</span>
        <span>6 High</span>
        <span>11+ Ext</span>
      </div>
    </div>
  );

  return (
    <BaseWeatherMetricCard
      id="weather-metric-uv-index"
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
