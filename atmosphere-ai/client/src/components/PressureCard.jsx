import React from 'react';
import { Gauge } from 'lucide-react';
import BaseWeatherMetricCard from './BaseWeatherMetricCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MOCK_CURRENT_WEATHER } from '../data/mockWeatherData.js';

/**
 * PressureCard Component
 * Displays Barometric Pressure in hPa, atmospheric stability status, and pressure scale.
 * 
 * Example:
 *   Pressure: 1014 hPa Normal
 */
export default function PressureCard({
  title = 'Pressure',
  value,
  unit = 'hPa',
  status,
  statusVariant,
  description,
  icon: Icon = Gauge,
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

  const raw = weather || data || mockWeather;
  const rawPressure = raw?.pressureHpa ?? 1014;

  const resolvedValue = value !== undefined ? value : rawPressure;
  const numPressure = typeof resolvedValue === 'number' ? resolvedValue : parseInt(resolvedValue, 10) || 1014;

  const resolvedStatus = 
    status !== undefined 
      ? status 
      : (raw?.pressureStatus || (numPressure < 1005 ? 'Low' : numPressure <= 1022 ? 'Normal' : 'High'));

  const resolvedDescription = 
    description !== undefined 
      ? description 
      : numPressure >= 1013 
        ? 'Stable regional high-pressure cell'
        : 'Approaching low-pressure trough system';

  const resolvedFooter = 
    footer !== undefined 
      ? footer 
      : 'No impending rapid pressure fluctuations detected.';

  // Standard barometric range: 970 hPa (very low) to 1040 hPa (very high)
  // Standard normal sea-level pressure is ~1013.25 hPa
  const normalizedPercent = Math.min(95, Math.max(5, ((numPressure - 970) / (1040 - 970)) * 100));

  const defaultVisualization = (
    <div>
      <div className="w-full h-2 rounded-full bg-slate-800/80 relative mt-1 overflow-hidden">
        {/* Pressure range gradient */}
        <div className="h-full w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full opacity-70" />
      </div>

      {/* Indicator line pointer */}
      <div className="relative w-full h-1 mt-1">
        <div
          className="absolute -top-3 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] border border-slate-950 transition-all duration-500"
          style={{ left: `${normalizedPercent}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
        <span>980 Low</span>
        <span className="text-cyan-400/80 font-semibold">1013 Normal</span>
        <span>1040 High</span>
      </div>
    </div>
  );

  return (
    <BaseWeatherMetricCard
      id="weather-metric-pressure"
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
