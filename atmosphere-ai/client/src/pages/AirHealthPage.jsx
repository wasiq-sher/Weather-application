import React from 'react';
import { 
  Wind, 
  ShieldCheck, 
  AlertTriangle, 
  HeartPulse, 
  Flower2, 
  Activity, 
  Sun, 
  Droplets,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useAirHealthQuery, useCurrentWeatherQuery } from '../hooks/useWeatherQuery.js';
import WeatherCard from '../components/WeatherCard.jsx';
import MetricCard from '../components/MetricCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TelemetryAlert from '../components/TelemetryAlert.jsx';

/**
 * AirHealthPage - Biometeorology & Air Quality Center
 * Telemetry covering PM2.5/PM10, ozone, respiratory advisory, and pollen forecasts.
 */
export default function AirHealthPage() {
  const { activeLocation } = useApp();
  const locationTarget = activeLocation || 'san-francisco';

  const { data: airHealth, isLoading, isError, error, refetch } = useAirHealthQuery(locationTarget);
  const { data: weather } = useCurrentWeatherQuery(locationTarget);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Analyzing regional biometeorological air quality sensors..." />;
  }

  if (isError) {
    return (
      <TelemetryAlert
        title="Air Quality Telemetry Unavailable"
        message={error?.message || 'Unable to connect to air quality monitoring stations.'}
        onRetry={() => refetch()}
      />
    );
  }

  const aqi = airHealth?.aqi ?? 22;
  const category = airHealth?.category ?? 'Good';

  // AQI color logic
  let aqiColor = 'text-emerald-400';
  let aqiBg = 'bg-emerald-500/15 border-emerald-500/30';
  let aqiBadgeVariant = 'success';

  if (aqi > 50 && aqi <= 100) {
    aqiColor = 'text-amber-400';
    aqiBg = 'bg-amber-500/15 border-amber-500/30';
    aqiBadgeVariant = 'warning';
  } else if (aqi > 100) {
    aqiColor = 'text-rose-400';
    aqiBg = 'bg-rose-500/15 border-rose-500/30';
    aqiBadgeVariant = 'danger';
  }

  const pollutants = [
    { name: 'PM2.5', label: 'Fine Particulate Matter', value: airHealth?.pm25 ?? 8.2, unit: 'µg/m³', status: 'Optimal', max: 35 },
    { name: 'PM10', label: 'Coarse Particulate Matter', value: airHealth?.pm10 ?? 14.5, unit: 'µg/m³', status: 'Optimal', max: 50 },
    { name: 'O₃', label: 'Ground-Level Ozone', value: airHealth?.o3 ?? 24.1, unit: 'ppb', status: 'Low', max: 70 },
    { name: 'NO₂', label: 'Nitrogen Dioxide', value: airHealth?.no2 ?? 9.8, unit: 'ppb', status: 'Good', max: 53 },
    { name: 'CO', label: 'Carbon Monoxide', value: airHealth?.co ?? 0.3, unit: 'ppm', status: 'Optimal', max: 9 },
    { name: 'SO₂', label: 'Sulfur Dioxide', value: airHealth?.so2 ?? 1.2, unit: 'ppb', status: 'Low', max: 75 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <SectionHeader
        title="Air Quality & Biometeorology Health"
        subtitle={`Real-time atmospheric composition and health telemetry for ${activeLocation?.name || 'San Francisco'}`}
        icon={HeartPulse}
        badge={<Badge variant={aqiBadgeVariant} dot>{category} Quality</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Station Sensor:</span>
            <Badge variant="neutral">EPA AirNow API</Badge>
          </div>
        }
      />

      {/* Hero Air Quality Gauge Card */}
      <div className="rounded-[32px] bg-slate-900/40 border border-slate-800/50 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big AQI Number & Spectrum */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Air Quality Index (AQI)
            </span>

            <div className="flex items-baseline gap-4">
              <span className={`text-6xl sm:text-8xl font-black tracking-tight ${aqiColor}`}>
                {aqi}
              </span>
              <div>
                <span className={`text-xl sm:text-2xl font-bold block ${aqiColor}`}>
                  {category}
                </span>
                <span className="text-xs text-slate-400">
                  Dominant Pollutant: {airHealth?.dominantPollutant || 'PM2.5'}
                </span>
              </div>
            </div>

            {/* Gradient Spectrum Bar */}
            <div className="space-y-2 pt-2">
              <div className="h-3 rounded-full bg-slate-800 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-rose-600 rounded-full"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#ffffff] transition-all duration-500"
                  style={{ left: `${Math.min(95, Math.max(5, (aqi / 200) * 100))}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span className="text-emerald-400">0–50 Good</span>
                <span className="text-amber-400">51–100 Mod</span>
                <span className="text-orange-400">101–150 Sensitive</span>
                <span className="text-rose-400">151+ Unhealthy</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              "{airHealth?.healthRecommendation}"
            </p>
          </div>

          {/* Biometeorology Recommendations */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Outdoor Exercise</span>
              </div>
              <p className="text-sm font-semibold text-white">Safe for All Activities</p>
              <p className="text-xs text-slate-400 mt-1">
                Air cleanliness is suitable for running, cycling, and prolonged exertion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-cyan-400 mb-2">
                <Wind className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Ventilation</span>
              </div>
              <p className="text-sm font-semibold text-white">Windows Recommended</p>
              <p className="text-xs text-slate-400 mt-1">
                Fresh ocean maritime air offers natural indoor cooling and ventilation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-blue-400 mb-2">
                <HeartPulse className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Respiratory Risk</span>
              </div>
              <p className="text-sm font-semibold text-white">{airHealth?.respiratoryRisk || 'Clear'}</p>
              <p className="text-xs text-slate-400 mt-1">
                No elevated particulates posing risks to asthma or allergy sufferers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-amber-400 mb-2">
                <Flower2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Pollen Index</span>
              </div>
              <p className="text-sm font-semibold text-white">{airHealth?.pollenGrass || 'Moderate (2/5)'}</p>
              <p className="text-xs text-slate-400 mt-1">
                Grass pollen slightly elevated along coastal parks and hillsides.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Pollutants Telemetry Grid */}
      <SectionHeader
        title="Microscopic Air Pollutant Analysis"
        subtitle="Parts-per-billion & micrograms concentration from regional laser scattering sensors"
        icon={Activity}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pollutants.map((pol) => {
          const pct = Math.min(100, Math.round((pol.value / pol.max) * 100));
          return (
            <div
              key={pol.name}
              className="p-6 rounded-[28px] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/60 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-white tracking-tight">
                    {pol.name}
                  </span>
                  <Badge variant="success" size="sm">
                    {pol.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mb-4">{pol.label}</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {pol.value}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {pol.unit}
                  </span>
                </div>

                {/* Progress ratio */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-blue-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-4 pt-3 border-t border-slate-800/60">
                <span>Safe Threshold: {pol.max} {pol.unit}</span>
                <span>{pct}% of limit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
