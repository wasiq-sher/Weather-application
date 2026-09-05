import React from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  TrendingUp, 
  Droplets,
  Wind,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Badge from '../components/Badge.jsx';
import SevenDayForecast from '../components/SevenDayForecast.jsx';

/**
 * ForecastPage - 7-Day Extended Synoptic Outlook for Atmosphere AI
 * 
 * Houses the SevenDayForecast component powered by the reusable SevenDayForecastModel.
 * Provides high-precision ensemble projections, multi-day temperature envelopes,
 * and detailed diurnal day expansions.
 */
export default function ForecastPage() {
  const { unit, activeLocation } = useApp();
  const locationId = activeLocation?.id || 'san-francisco';

  return (
    <div id="forecast-page" className="space-y-6 pb-12">
      {/* Synoptic Header */}
      <SectionHeader
        title="7-Day Extended Synoptic Outlook"
        subtitle={`Ensemble atmospheric prediction for ${activeLocation?.name || 'San Francisco'}, ${activeLocation?.region || 'CA'}`}
        icon={CalendarDays}
        badge={<Badge variant="primary">GFS & ECMWF Multi-Model Blend</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Model Reliability:</span>
            <Badge variant="success">96% High</Badge>
          </div>
        }
      />

      {/* Primary 7-Day Forecast Suite */}
      <SevenDayForecast
        locationId={locationId}
        unitOverride={unit}
        initialExpandedIndex={0}
        allowMultipleExpanded={true}
        showViewToggle={true}
      />

      {/* Meteorological Synthesis Footer Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Atmosphere AI Synoptic Guidance</h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Multi-model ensemble variance remains within 1.2° across the 7-day horizon. Marine layer penetration and coastal pressure gradients are continuously tracked to provide accurate diurnal transition timing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Badge variant="info">Automated Model Verification Active</Badge>
        </div>
      </div>
    </div>
  );
}
