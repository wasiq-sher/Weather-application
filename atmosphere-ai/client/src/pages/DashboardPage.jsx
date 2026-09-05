import React from 'react';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { 
  useCurrentWeatherQuery, 
  useHourlyForecastQuery, 
  useAirHealthQuery, 
  useSunMoonQuery,
  useAlertsQuery
} from '../hooks/useWeatherQuery.js';
import CurrentWeatherCard from '../components/CurrentWeatherCard.jsx';
import RadarCard from '../components/RadarCard.jsx';
import HourlyForecast from '../components/HourlyForecast.jsx';
import MetricsGrid from '../components/MetricsGrid.jsx';
import AssistantCard from '../components/AssistantCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TelemetryAlert from '../components/TelemetryAlert.jsx';
import Badge from '../components/Badge.jsx';

/**
 * DashboardPage - Primary Atmospheric Telemetry Overview
 * Connects centralized TanStack Query hooks with modular UI components.
 */
export default function DashboardPage() {
  const { activeLocation } = useApp();
  const locationTarget = activeLocation || 'san-francisco';

  // TanStack Query hooks for real-time telemetry caching
  const { 
    data: weather, 
    isLoading: isWeatherLoading, 
    isError: isWeatherError,
    error: weatherError,
    refetch: refetchWeather 
  } = useCurrentWeatherQuery(locationTarget);

  const { data: hourly = [] } = useHourlyForecastQuery(locationTarget);
  const { data: airHealth } = useAirHealthQuery(locationTarget);
  const { data: sunMoon } = useSunMoonQuery(locationTarget);
  const { data: alerts = [] } = useAlertsQuery(locationTarget);

  const scrollToRadar = () => {
    const el = document.getElementById('radar-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isWeatherLoading) {
    return <LoadingSpinner fullPage message={`Connecting to ${activeLocation?.name || 'San Francisco'} meteorological hub...`} />;
  }

  if (isWeatherError) {
    return (
      <TelemetryAlert
        title="Atmospheric Stream Interrupted"
        message={weatherError?.message || 'Failed to acquire sensor feeds for the designated location.'}
        onRetry={() => refetchWeather()}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Real-time Severe Weather / Advisory Banner if alerts exist */}
      {alerts.length > 0 && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  {alerts[0].event}
                </span>
                <Badge variant="warning" size="sm">
                  Active Advisory
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {alerts[0].headline}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80 self-start sm:self-auto shrink-0">
            Valid until {alerts[0].expires}
          </span>
        </div>
      )}

      {/* Row 1: Hero Weather Telemetry & Live Interactive Radar Scope */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <CurrentWeatherCard weather={weather} onShowRadar={scrollToRadar} />
        </div>
        <div id="radar-section" className="lg:col-span-7">
          <RadarCard />
        </div>
      </div>

      {/* Row 2: 24-Hour Atmosphere Trajectory Timeline */}
      <div>
        <HourlyForecast hourlyData={hourly} />
      </div>

      {/* Row 3: Biometeorology & Environmental Grid + Atmosphere AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MetricsGrid weather={weather} airHealth={airHealth} sunMoon={sunMoon} />
        </div>
        <div className="lg:col-span-4">
          <AssistantCard />
        </div>
      </div>
    </div>
  );
}
