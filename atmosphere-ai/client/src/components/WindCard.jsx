import React from 'react';
import { Compass, Navigation } from 'lucide-react';
import BaseWeatherMetricCard from './BaseWeatherMetricCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MOCK_CURRENT_WEATHER } from '../data/mockWeatherData.js';

// Map cardinal wind direction to angle in degrees
const DIRECTION_ANGLES = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};

/**
 * WindCard Component
 * Displays wind speed, velocity unit, direction, gusts, and an interactive compass dial.
 * 
 * Example:
 *   Wind: 12 mph NW
 */
export default function WindCard({
  title = 'Wind',
  value,
  unit,
  status,
  statusVariant,
  description,
  icon: Icon = Compass,
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

  // Resolve speed & direction
  const rawDirection = raw?.windDirection || 'NW';
  const rawSpeed = activeUnit === 'C' ? (raw?.windKmh ?? 19) : (raw?.windMph ?? 12);
  const defaultUnitLabel = activeUnit === 'C' ? 'km/h' : 'mph';
  const rawGust = activeUnit === 'C' 
    ? `${Math.round((raw?.windGustMph ?? 19) * 1.609)} km/h` 
    : `${raw?.windGustMph ?? 19} mph`;

  // Resolved value: e.g. "12 mph NW" or numeric 12
  const resolvedValue = value !== undefined ? value : `${rawSpeed} ${defaultUnitLabel} ${rawDirection}`;
  const resolvedUnit = unit !== undefined ? unit : undefined;
  const resolvedStatus = status !== undefined ? status : `${rawDirection} Flow`;

  const resolvedDescription = description !== undefined 
    ? description 
    : `Gusts reaching ${rawGust}`;

  const resolvedFooter = footer !== undefined 
    ? footer 
    : 'Steady airflow maintaining atmospheric dispersion.';

  // Determine compass arrow rotation based on direction
  const rotationDegrees = DIRECTION_ANGLES[rawDirection] !== undefined 
    ? DIRECTION_ANGLES[rawDirection] 
    : 315;

  const defaultVisualization = (
    <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
      <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
        <Navigation 
          className="w-3.5 h-3.5 text-cyan-400" 
          style={{ transform: `rotate(${rotationDegrees}deg)` }} 
        />
        <span>{rawDirection} Vector</span>
      </div>

      {/* Mini Compass Rose Dial */}
      <div className="w-9 h-9 rounded-full border border-slate-700/60 bg-slate-950/80 flex items-center justify-center relative shadow-inner">
        <span className="absolute top-0.5 text-[7px] font-bold text-slate-500 font-mono">N</span>
        <span className="absolute bottom-0.5 text-[7px] font-bold text-slate-600 font-mono">S</span>
        <span className="absolute left-1 text-[7px] font-bold text-slate-600 font-mono">W</span>
        <span className="absolute right-1 text-[7px] font-bold text-slate-600 font-mono">E</span>
        <div 
          className="w-4 h-0.5 bg-cyan-400 origin-center rounded-full shadow-[0_0_8px_#38bdf8] transition-transform duration-700"
          style={{ transform: `rotate(${rotationDegrees - 90}deg)` }}
        />
      </div>
    </div>
  );

  return (
    <BaseWeatherMetricCard
      id="weather-metric-wind"
      title={title}
      value={resolvedValue}
      unit={resolvedUnit}
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
