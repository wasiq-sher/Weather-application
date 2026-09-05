import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import BaseWeatherMetricCard from './BaseWeatherMetricCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { MOCK_SUN_MOON, MOCK_CURRENT_WEATHER } from '../data/mockWeatherData.js';

/**
 * SunriseSunsetCard Component
 * Displays astronomical timeline: Sunrise time, Sunset time, daylight duration, and solar arc curve.
 * 
 * Example:
 *   Sunrise: 6:32 AM (Sunset: 7:45 PM)
 *   Status: 13h Daylight
 */
export default function SunriseSunsetCard({
  title = 'Sunrise & Sunset',
  value,
  unit,
  status,
  statusVariant,
  description,
  icon: Icon = Sunrise,
  visualization,
  footer,
  sunMoon,
  weather,
  data,
  className = '',
  onClick,
  ...rest
}) {
  const appContext = useApp?.() || {};
  const activeLocation = appContext.activeLocation?.id || 'san-francisco';
  const mockSun = MOCK_SUN_MOON[activeLocation] || MOCK_SUN_MOON['san-francisco'];
  const mockWeather = MOCK_CURRENT_WEATHER[activeLocation] || MOCK_CURRENT_WEATHER['san-francisco'];

  const rawSun = sunMoon || data || mockSun;
  const rawWeather = weather || mockWeather;

  const sunrise = rawSun?.sunrise || rawWeather?.sunrise || '6:32 AM';
  const sunset = rawSun?.sunset || rawWeather?.sunset || '7:45 PM';
  const daylight = rawSun?.daylightDuration || '13h 13m';

  const resolvedValue = value !== undefined ? value : sunrise;
  const resolvedUnit = unit !== undefined ? unit : `– ${sunset}`;
  const resolvedStatus = status !== undefined ? status : `${daylight} Daylight`;

  const resolvedDescription = description !== undefined 
    ? description 
    : 'Golden hour begins 40 minutes before dusk';

  const resolvedFooter = footer !== undefined 
    ? footer 
    : 'Clear twilight horizon projected for this evening.';

  // Default Solar Arc Visualization
  const defaultVisualization = (
    <div className="pt-2 flex flex-col items-center">
      <div className="relative w-48 h-16 overflow-hidden">
        {/* Arc Path */}
        <div className="w-48 h-48 rounded-full border border-dashed border-amber-400/40 absolute top-0 left-0" />
        
        {/* Sun Disc on Arc */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] border-2 border-slate-950 transition-all duration-700"
          style={{ left: '46%', top: '12%' }}
        />

        {/* Horizon Baseline */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-700" />
      </div>

      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
        <span className="flex items-center gap-1 text-amber-400/90">
          <Sunrise className="w-3 h-3" />
          {sunrise}
        </span>
        <span className="flex items-center gap-1 text-rose-400/90">
          <Sunset className="w-3 h-3" />
          {sunset}
        </span>
      </div>
    </div>
  );

  return (
    <BaseWeatherMetricCard
      id="weather-metric-sunrise-sunset"
      title={title}
      value={resolvedValue}
      unit={resolvedUnit}
      status={resolvedStatus}
      statusVariant={statusVariant || 'primary'}
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
