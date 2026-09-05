import React, { useState, useRef } from 'react';
import { 
  Clock, 
  Droplets, 
  ChevronLeft, 
  ChevronRight, 
  CloudRain, 
  SunMedium, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import WeatherIcon from './WeatherIcon.jsx';
import { MOCK_HOURLY_FORECAST } from '../data/mockWeatherData.js';

/**
 * Reusable HourlyForecast Component
 * 
 * Features:
 * - Displays the next 24 hours by default, with toggles for 48 Hours and Rain Only.
 * - Each hourly card displays:
 *     1. Time (e.g. "Now", "1 PM", "2 PM")
 *     2. Weather Icon
 *     3. Temperature (supports °F and °C)
 *     4. Precipitation Probability (%)
 *     5. Weather Condition description
 * - Visual highlight for the current hour ("Now" / `isNow: true` badge and luminous glow).
 * - Smooth horizontal scrolling on smaller and wider screens with scroll buttons and touch swipe.
 * - Forecast modes: 'Next 24 Hours', '48 Hours', 'Rain Only'.
 * - Centralized mock data integration with full backend API readiness (normalizes props data).
 * 
 * Props:
 * - hourlyData: Array of hourly items (optional; falls back to centralized mock data).
 * - unit: Temperature unit ('F' | 'C', optional).
 * - defaultMode: Initial mode ('24h' | '48h' | 'rain', default: '24h').
 * - mode: Controlled mode override ('24h' | '48h' | 'rain', optional).
 * - onModeChange: Callback when forecast mode changes (optional).
 * - onHourClick: Callback when an hour card is selected (optional).
 * - className: Optional custom container styling classes.
 */
export default function HourlyForecast({
  hourlyData,
  unit: propUnit,
  defaultMode = '24h',
  mode: controlledMode,
  onModeChange,
  onHourClick,
  className = '',
}) {
  const appContext = useApp?.() || {};
  const activeUnit = propUnit || appContext.unit || 'F';
  const activeLocation = appContext.activeLocation?.id || 'san-francisco';

  // Internal state for forecast mode if uncontrolled
  const [internalMode, setInternalMode] = useState(defaultMode);
  const activeMode = controlledMode !== undefined ? controlledMode : internalMode;

  const handleModeSelect = (newMode) => {
    if (controlledMode === undefined) {
      setInternalMode(newMode);
    }
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  // Scroll container ref for smooth horizontal navigation buttons
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Resolve raw source data: provided prop -> centralized mock for active location -> default mock
  const rawData = (hourlyData && hourlyData.length > 0)
    ? hourlyData
    : MOCK_HOURLY_FORECAST[activeLocation] || MOCK_HOURLY_FORECAST['san-francisco'] || [];

  // Normalize data items with useMemo to prevent unnecessary calculations on every re-render
  const normalizedData = React.useMemo(() => {
    return rawData.map((item, index) => {
      // Resolve Temperature
      let resolvedTemp;
      if (activeUnit === 'C') {
        resolvedTemp = item.tempC ?? (item.tempF !== undefined ? Math.round(((item.tempF - 32) * 5) / 9) : (item.temp ? Math.round(item.temp) : 20));
      } else {
        resolvedTemp = item.tempF ?? (item.tempC !== undefined ? Math.round((item.tempC * 9) / 5 + 32) : (item.temp ? Math.round(item.temp) : 68));
      }

      // Resolve Precipitation Probability
      const pop = item.precipitationProbability ?? item.pop ?? item.rainChance ?? item.precip_prob ?? 0;

      // Resolve Condition & Icon
      const condition = item.condition || item.weather?.[0]?.description || item.weather?.[0]?.main || 'Clear';
      const iconCode = item.iconCode || item.icon || item.weather?.[0]?.icon || 'clear-day';

      // Resolve Time label
      const time = item.time || (item.hour24 !== undefined ? `${item.hour24 % 12 || 12} ${item.hour24 >= 12 ? 'PM' : 'AM'}` : `H+${index}`);
      const isNow = item.isNow ?? (index === 0);

      return {
        raw: item,
        time,
        isNow,
        temp: resolvedTemp,
        pop: typeof pop === 'number' ? Math.round(pop) : parseInt(pop, 10) || 0,
        condition,
        iconCode,
        precipitationType: item.precipitationType || (pop >= 30 ? 'rain' : 'none'),
        dayOffset: item.dayOffset ?? 0,
      };
    });
  }, [rawData, activeUnit]);

  // Apply forecast mode filter with useMemo
  const displayItems = React.useMemo(() => {
    if (activeMode === '24h') {
      return normalizedData.slice(0, 24);
    } else if (activeMode === '48h') {
      return normalizedData.slice(0, 48);
    } else if (activeMode === 'rain') {
      const rainyOnly = normalizedData.slice(0, 48).filter((item) => item.pop > 15);
      return rainyOnly;
    }
    return normalizedData.slice(0, 24);
  }, [normalizedData, activeMode]);

  return (
    <div 
      id="hourly-forecast-component"
      className={`rounded-[32px] bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-950/95 border border-slate-800/60 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-32 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Row: Title, Mode Toggles, and Scroll Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Hourly Forecast
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {activeMode === '24h' ? '24 Hours' : activeMode === '48h' ? '48 Hours' : 'Rain Only'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Atmospheric trajectory and precipitation timeline
            </p>
          </div>
        </div>

        {/* Forecast Mode Selector & Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Mode Segmented Control */}
          <div 
            id="hourly-mode-selector"
            className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800/90 backdrop-blur-md text-xs font-medium"
          >
            <button
              id="mode-btn-24h"
              type="button"
              onClick={() => handleModeSelect('24h')}
              className={`px-3 py-1.5 rounded-xl transition duration-150 flex items-center gap-1.5 ${
                activeMode === '24h'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-[0_0_14px_rgba(56,189,248,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Next 24 Hours</span>
            </button>

            <button
              id="mode-btn-48h"
              type="button"
              onClick={() => handleModeSelect('48h')}
              className={`px-3 py-1.5 rounded-xl transition duration-150 flex items-center gap-1.5 ${
                activeMode === '48h'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-[0_0_14px_rgba(56,189,248,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>48 Hours</span>
            </button>

            <button
              id="mode-btn-rain"
              type="button"
              onClick={() => handleModeSelect('rain')}
              className={`px-3 py-1.5 rounded-xl transition duration-150 flex items-center gap-1.5 ${
                activeMode === 'rain'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-[0_0_14px_rgba(56,189,248,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain Only</span>
            </button>
          </div>

          {/* Desktop horizontal scroll arrows */}
          <div className="hidden sm:flex items-center gap-1 pl-1">
            <button
              id="btn-scroll-hourly-left"
              type="button"
              onClick={() => scroll('left')}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              aria-label="Scroll hourly cards left"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="btn-scroll-hourly-right"
              type="button"
              onClick={() => scroll('right')}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
              aria-label="Scroll hourly cards right"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      {displayItems.length === 0 ? (
        // Empty state for Rain Only when no precipitation is projected
        <div className="py-12 px-6 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center flex flex-col items-center justify-center">
          <SunMedium className="w-10 h-10 text-amber-400 mb-2.5 animate-pulse" />
          <h4 className="text-sm font-semibold text-white">No Rain Projected</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Precipitation probabilities remain under 15% for the next 48 hours. Clear skies and dry atmospheric conditions expected.
          </p>
          <button
            type="button"
            onClick={() => handleModeSelect('24h')}
            className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
          >
            Switch to Next 24 Hours
          </button>
        </div>
      ) : (
        <div
          id="hourly-scroll-container"
          ref={scrollContainerRef}
          className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth focus:outline-none select-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {displayItems.map((item, index) => {
            const isHighlighted = item.isNow;
            const isHighRainRisk = item.pop >= 40;
            const hasRainChance = item.pop > 0;

            return (
              <div
                key={index}
                id={isHighlighted ? 'hourly-card-current' : `hourly-card-${index}`}
                onClick={() => onHourClick && onHourClick(item.raw)}
                className={`flex-shrink-0 w-[108px] sm:w-[114px] rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-between transition-all duration-200 cursor-pointer group relative ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-blue-600/25 via-cyan-500/15 to-slate-900/90 border-2 border-cyan-400/80 shadow-[0_0_24px_rgba(56,189,248,0.3)] ring-1 ring-cyan-400/50'
                    : isHighRainRisk
                    ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900/80 border border-blue-500/40 hover:border-blue-400/70 hover:bg-slate-800/60'
                    : 'bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Visual Current Hour "NOW" Badge */}
                {isHighlighted && (
                  <div className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-cyan-400 text-[#020408] text-[9px] font-black tracking-widest uppercase shadow-[0_0_10px_#38bdf8]">
                    NOW
                  </div>
                )}

                {/* 1. Time */}
                <div className="text-center w-full">
                  <span 
                    className={`text-xs font-bold tracking-tight block truncate ${
                      isHighlighted ? 'text-cyan-300 font-extrabold' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {item.time}
                  </span>
                  {item.dayOffset > 0 && (
                    <span className="text-[9px] text-slate-500 font-medium block">
                      Tomorrow
                    </span>
                  )}
                </div>

                {/* 2. Weather Icon */}
                <div className="my-2.5 relative flex items-center justify-center h-10 w-10">
                  {isHighlighted && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse" />
                  )}
                  <WeatherIcon 
                    code={item.iconCode} 
                    size="sm" 
                    animate={isHighlighted} 
                  />
                </div>

                {/* 3. Temperature */}
                <div className="text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {item.temp}°
                  </span>
                </div>

                {/* 4. Condition Label */}
                <div className="w-full text-center my-1 px-0.5">
                  <span 
                    title={item.condition}
                    className="text-[10px] text-slate-400 font-medium truncate block max-w-full group-hover:text-slate-200 transition"
                  >
                    {item.condition}
                  </span>
                </div>

                {/* 5. Precipitation Probability */}
                <div className="w-full pt-1.5 border-t border-slate-800/60 mt-1 flex items-center justify-center">
                  <div 
                    className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isHighRainRisk
                        ? 'bg-blue-500/25 text-cyan-300 border border-blue-500/40'
                        : hasRainChance
                        ? 'bg-blue-950/50 text-blue-300'
                        : 'text-slate-500'
                    }`}
                  >
                    <Droplets className={`w-3 h-3 ${hasRainChance ? 'text-cyan-400' : 'text-slate-600'}`} />
                    <span>{item.pop}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile swipe hint */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 text-[10px] text-slate-500 mt-2">
        <span>← Swipe horizontally to explore hourly timeline →</span>
      </div>
    </div>
  );
}
