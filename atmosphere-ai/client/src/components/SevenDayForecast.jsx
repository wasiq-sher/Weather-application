import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  Compass,
  Sparkles,
  Gauge,
  Eye,
  CloudRain,
  Shirt,
  Bike,
  AlertTriangle,
  Layers,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useDailyForecastQuery } from '../hooks/useWeatherQuery.js';
import WeatherIcon from './WeatherIcon.jsx';
import Badge from './Badge.jsx';
import { SevenDayForecastModel, ForecastDay } from '../models/forecastModel.js';

/**
 * SevenDayForecast Component
 * 
 * Production-ready, fully responsive 7-Day Forecast component for Atmosphere AI.
 * 
 * Displays:
 * - Day name & formatted date
 * - Weather condition text
 * - High & low temperatures (with responsive scale & week-envelope bar)
 * - Weather icon with condition-based lighting
 * - Rain probability (PoP %)
 * - Wind velocity & direction
 * - Relative humidity (%)
 * 
 * Features:
 * - Interactive accordion day expansion revealing diurnal periods (Morning/Afternoon/Evening/Night),
 *   atmospheric metrics (pressure, dew point, cloud cover, UV), sun times, and AI recommendations.
 * - Backed by the reusable `SevenDayForecastModel`.
 * - Dual view modes: "List Outlook" and "Grid Cards".
 * - Fully responsive with touch-optimized targets.
 */
export default function SevenDayForecast({
  data = null,
  locationId = null,
  unitOverride = null,
  initialExpandedIndex = 0,
  allowMultipleExpanded = false,
  showViewToggle = true,
  className = '',
}) {
  const { unit: appUnit, activeLocation } = useApp();
  const unit = unitOverride || appUnit || 'F';
  const effectiveLocation = locationId || activeLocation || 'san-francisco';
  const effectiveLocationId = typeof effectiveLocation === 'string' ? effectiveLocation : (effectiveLocation?.id || 'active-station');

  // TanStack Query fallback when external data prop is not passed directly
  const {
    data: queryDailyData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDailyForecastQuery(effectiveLocation);

  // View state: 'list' | 'grid'
  const [viewMode, setViewMode] = useState('list');

  // Track expanded indices (supports single or multi-expansion)
  const [expandedIndices, setExpandedIndices] = useState(() => {
    return initialExpandedIndex !== null && initialExpandedIndex !== undefined
      ? [initialExpandedIndex]
      : [];
  });

  // Construct or wrap with the reusable SevenDayForecastModel
  const forecastModel = useMemo(() => {
    const rawData = data || queryDailyData || [];
    if (rawData instanceof SevenDayForecastModel) {
      return rawData;
    }
    return SevenDayForecastModel.fromRawDailyData(rawData, {
      locationId: effectiveLocationId,
      locationName: activeLocation?.name || 'San Francisco',
    });
  }, [data, queryDailyData, effectiveLocationId, activeLocation]);

  // Global weekly statistics for relative temperature envelope bars
  const weekHigh = useMemo(() => forecastModel.getWeekHigh(unit), [forecastModel, unit]);
  const weekLow = useMemo(() => forecastModel.getWeekLow(unit), [forecastModel, unit]);
  const tempRange = Math.max(1, weekHigh - weekLow);

  const toggleDayExpansion = (idx) => {
    setExpandedIndices((prev) => {
      if (allowMultipleExpanded) {
        return prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx];
      }
      return prev.includes(idx) ? [] : [idx];
    });
  };

  const expandAll = () => {
    setExpandedIndices(forecastModel.days.map((_, i) => i));
  };

  const collapseAll = () => {
    setExpandedIndices([]);
  };

  if (isLoading && !data) {
    return (
      <div id="seven-day-loading" className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl text-center space-y-4">
        <div className="w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading 7-day atmospheric forecast model...</p>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div id="seven-day-error" className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl text-center space-y-3">
        <p className="text-rose-300 font-medium">Failed to load extended forecast</p>
        <p className="text-xs text-rose-400/80">{error?.message || 'Synoptic data feed unavailable.'}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors"
        >
          Retry Feed
        </button>
      </div>
    );
  }

  if (!forecastModel.days.length) {
    return null;
  }

  const allExpanded = expandedIndices.length === forecastModel.days.length;

  return (
    <div id="seven-day-forecast-container" className={`space-y-4 ${className}`}>
      {/* Forecast Component Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              7-Day Synoptic Forecast
              <Badge variant="primary">Ensemble Model</Badge>
            </h3>
            <p className="text-xs text-slate-400">
              High/low temperature range, wind vectors, precipitation probability & day expansion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Expand / Collapse All Toggle */}
          <button
            id="btn-toggle-expand-all"
            type="button"
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition-colors"
          >
            {allExpanded ? 'Collapse All' : 'Expand All Details'}
          </button>

          {/* View Mode Toggle: List vs Grid */}
          {showViewToggle && (
            <div className="flex items-center bg-slate-900/60 p-0.5 rounded-xl border border-slate-800/80">
              <button
                id="btn-view-mode-list"
                type="button"
                onClick={() => setViewMode('list')}
                title="List Outlook"
                aria-label="List Outlook"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-view-mode-grid"
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid Cards"
                aria-label="Grid Cards"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Week Summary Micro-Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Week High</span>
          <span className="font-bold text-rose-400">{weekHigh}°{unit}</span>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Week Low</span>
          <span className="font-bold text-blue-400">{weekLow}°{unit}</span>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Wettest Day</span>
          <span className="font-bold text-cyan-400">
            {forecastModel.getWettestDay()?.day || 'N/A'} ({forecastModel.getWettestDay()?.pop || 0}%)
          </span>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Precip Days</span>
          <span className="font-bold text-emerald-400">
            {forecastModel.getRainyDaysCount()} of 7
          </span>
        </div>
      </div>

      {/* Days List / Grid Layout */}
      <div
        id="seven-day-forecast-list"
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3'
            : 'space-y-2.5'
        }
      >
        {forecastModel.days.map((day, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const isToday = idx === 0 || day.day === 'Today';
          const dayHigh = day.getHigh(unit);
          const dayLow = day.getLow(unit);

          // Relative envelope calculations for visual bar
          const leftPercent = Math.max(0, Math.min(95, ((dayLow - weekLow) / tempRange) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((dayHigh - dayLow) / tempRange) * 100));

          return (
            <div
              key={day.id || idx}
              id={`forecast-day-row-${idx}`}
              className={`rounded-2xl border transition-all overflow-hidden backdrop-blur-xl ${
                isExpanded
                  ? 'bg-slate-900/90 border-blue-500/40 shadow-[0_4px_24px_rgba(30,58,138,0.25)] ring-1 ring-blue-400/20'
                  : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/70 hover:border-slate-700/80'
              }`}
            >
              {/* Main Day Summary Trigger Header */}
              <button
                id={`forecast-day-btn-${idx}`}
                type="button"
                onClick={() => toggleDayExpansion(idx)}
                aria-expanded={isExpanded}
                aria-controls={`forecast-day-details-${idx}`}
                className="w-full text-left p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl"
              >
                {/* Day Identifier & Date */}
                <div className="flex items-center gap-3.5 min-w-[130px] sm:min-w-[150px]">
                  <div className="relative">
                    <WeatherIcon code={day.iconCode} size="md" animate={isExpanded} />
                    {isToday && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold tracking-tight ${isToday ? 'text-blue-400' : 'text-white'}`}>
                        {day.day}
                      </span>
                      {isToday && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Now
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium block">
                      {day.date}
                    </span>
                  </div>
                </div>

                {/* Weather Condition Text */}
                <div className="flex-1 min-w-0 sm:px-3 text-left">
                  <span className="text-xs sm:text-sm font-medium text-slate-200 truncate block group-hover:text-white transition-colors">
                    {day.condition}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    {/* Rain probability */}
                    <span className={`flex items-center gap-1 font-medium ${day.pop > 25 ? 'text-cyan-400' : 'text-slate-400'}`}>
                      <Droplets className="w-3 h-3" />
                      {day.getFormattedRainProb()}
                    </span>
                    <span>•</span>
                    {/* Wind */}
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-blue-400" />
                      {day.getFormattedWind(unit)}
                    </span>
                    <span>•</span>
                    {/* Humidity */}
                    <span className="hidden md:inline-flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-indigo-400" />
                      {day.getFormattedHumidity()}
                    </span>
                  </div>
                </div>

                {/* Temperature Envelope Bar & High/Low Readings */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  {/* Visual spectrum bar (visible on tablet and up) */}
                  <div className="hidden sm:flex items-center gap-2 w-32 md:w-40">
                    <span className="text-xs text-slate-400 font-mono w-7 text-right">
                      {dayLow}°
                    </span>
                    <div className="relative flex-1 h-2 rounded-full bg-slate-800/90 overflow-hidden">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-amber-300 to-rose-400 transition-all duration-300"
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white font-mono w-7">
                      {dayHigh}°
                    </span>
                  </div>

                  {/* Mobile compact temps display */}
                  <div className="sm:hidden flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white font-mono">{dayHigh}°</span>
                    <span className="text-sm font-medium text-slate-400 font-mono">{dayLow}°</span>
                  </div>

                  {/* Expand chevron */}
                  <div className={`p-1.5 rounded-lg transition-transform text-slate-400 group-hover:text-white ${isExpanded ? 'rotate-180 text-blue-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Detailed Day Expansion Panel */}
              {isExpanded && (
                <div
                  id={`forecast-day-details-${idx}`}
                  className="px-4.5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 animate-fadeIn"
                >
                  <div className="space-y-4 pt-2">
                    {/* Diurnal Time of Day Progression */}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                        Diurnal Trajectory ({day.dayFull})
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(day.dayParts || []).map((part, pIdx) => {
                          const partTemp = unit === 'C' ? part.tempC : part.tempF;
                          return (
                            <div
                              key={pIdx}
                              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <WeatherIcon code={part.iconCode} size="sm" />
                                <div>
                                  <span className="text-xs font-semibold text-slate-200 block">
                                    {part.part}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    {part.time}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-white">
                                  {partTemp}°
                                </span>
                                {part.pop > 0 && (
                                  <span className="text-[10px] text-cyan-400 font-medium block">
                                    {part.pop}% rain
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed Atmospheric Metric Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {/* Wind & Gusts */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span className="font-medium">Wind & Gusts</span>
                          <Wind className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-sm font-bold text-white block">
                          {day.getFormattedWind(unit)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Gusts to {unit === 'C' ? `${day.windGustKmh} km/h` : `${day.windGustMph} mph`}
                        </span>
                      </div>

                      {/* Humidity & Dew Point */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span className="font-medium">Humidity</span>
                          <Droplets className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-bold text-white block">
                          {day.humidity}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Dew pt: {unit === 'C' ? `${day.dewPointC}°C` : `${day.dewPointF}°F`}
                        </span>
                      </div>

                      {/* Rain Probability & Volume */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span className="font-medium">Precipitation</span>
                          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <span className="text-sm font-bold text-cyan-300 block">
                          {day.pop}% Risk
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Vol: {day.precipitationAmount}
                        </span>
                      </div>

                      {/* UV Exposure Index */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span className="font-medium">UV Index</span>
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="text-sm font-bold text-white block">
                          {day.uvIndex} of 11
                        </span>
                        <span className="text-[10px] text-amber-300">
                          {day.uvRating || 'Moderate'} noon
                        </span>
                      </div>

                      {/* Barometric Pressure */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span className="font-medium">Pressure</span>
                          <Gauge className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-sm font-bold text-white block">
                          {day.pressureHpa} hPa
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {day.pressureHpa >= 1013 ? 'Steady High' : 'Trough Low'}
                        </span>
                      </div>

                      {/* Cloud Cover */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span className="font-medium">Cloud Deck</span>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-sm font-bold text-white block">
                          {day.cloudCover}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {day.cloudCover > 60 ? 'Overcast' : day.cloudCover > 25 ? 'Scattered' : 'Clear Sky'}
                        </span>
                      </div>
                    </div>

                    {/* Solar Cycle & AI Synoptic Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                      {/* Sun Schedule */}
                      <div className="md:col-span-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/5 to-blue-500/5 border border-white/[0.06] flex items-center justify-around">
                        <div className="flex items-center gap-2">
                          <Sunrise className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Sunrise</span>
                            <span className="text-xs font-bold text-white">{day.sunrise}</span>
                          </div>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-800" />
                        <div className="flex items-center gap-2">
                          <Sunset className="w-4 h-4 text-orange-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Sunset</span>
                            <span className="text-xs font-bold text-white">{day.sunset}</span>
                          </div>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-800" />
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium block">Daylight</span>
                            <span className="text-xs font-bold text-white">{day.daylightDuration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Atmosphere AI Synoptic & Recommendation */}
                      <div className="md:col-span-8 p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Atmosphere AI Model Synoptic</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          "{day.summary}"
                        </p>
                        {day.recommendations && (
                          <div className="mt-2 pt-2 border-t border-blue-500/10 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                            {day.recommendations.attire && (
                              <span className="flex items-center gap-1.5">
                                <Shirt className="w-3 h-3 text-blue-400" />
                                <span>{day.recommendations.attire}</span>
                              </span>
                            )}
                            {day.recommendations.advisory && (
                              <span className="flex items-center gap-1.5 text-amber-300">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{day.recommendations.advisory}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
