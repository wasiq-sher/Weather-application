import React from 'react';
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Compass, 
  Sparkles, 
  Camera, 
  Clock, 
  Calendar 
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useSunMoonQuery } from '../hooks/useWeatherQuery.js';
import WeatherCard from '../components/WeatherCard.jsx';
import MetricCard from '../components/MetricCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import TelemetryAlert from '../components/TelemetryAlert.jsx';

/**
 * SunMoonPage - Astronomical Ephemeris & Solar/Lunar Tracking
 * Interactive solar trajectory, twilight bounds, and moon phase illumination.
 */
export default function SunMoonPage() {
  const { activeLocation } = useApp();
  const locationId = activeLocation?.id || 'san-francisco';

  const { data: astro, isLoading, isError, error, refetch } = useSunMoonQuery(locationId);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Computing solar elevation and celestial orbital coordinates..." />;
  }

  if (isError) {
    return (
      <TelemetryAlert
        title="Astronomical Ephemeris Unavailable"
        message={error?.message || 'Unable to compute solar and lunar trajectories.'}
        onRetry={() => refetch()}
      />
    );
  }

  const sunrise = astro?.sunrise || '6:32 AM';
  const sunset = astro?.sunset || '7:45 PM';
  const daylight = astro?.daylightDuration || '13h 13m';
  const solarNoon = astro?.solarNoon || '1:08 PM';
  const sunAlt = astro?.sunAltitudeDeg || 54.2;

  const moonPhase = astro?.moonPhase || 'Waxing Gibbous';
  const moonIllum = astro?.moonIlluminationPct || 78;
  const moonrise = astro?.moonrise || '4:18 PM';
  const moonset = astro?.moonset || '3:45 AM';

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <SectionHeader
        title="Solar Arc & Lunar Astronomy"
        subtitle={`Celestial coordinates and twilight ephemeris for ${activeLocation?.name || 'San Francisco'}`}
        icon={Sun}
        badge={<Badge variant="warning">Solar Noon {solarNoon}</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Daylight:</span>
            <Badge variant="primary">{daylight}</Badge>
          </div>
        }
      />

      {/* Hero Solar Arc Card */}
      <div className="rounded-[32px] bg-slate-900/40 border border-slate-800/50 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Diurnal Solar Cycle
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Sun Altitude: {sunAlt}° Elevation
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono bg-slate-950/60 px-3 py-1.5 rounded-full border border-slate-800">
              Azimuth: 198° SSW • Civil Twilight Active
            </div>
          </div>

          {/* Interactive Visual Solar Arc Curve */}
          <div className="py-6 flex flex-col items-center">
            <div className="relative w-full max-w-xl h-44 sm:h-52 overflow-hidden flex items-end justify-center">
              {/* Horizon baseline */}
              <div className="absolute bottom-0 w-full h-[1px] bg-slate-700/80" />

              {/* The semi-circle solar arc path */}
              <div className="w-[500px] sm:w-[620px] h-[500px] sm:h-[620px] rounded-full border-2 border-dashed border-amber-400/30 absolute bottom-0" />

              {/* Sun indicator positioned along the arc */}
              <div
                className="absolute w-8 h-8 rounded-full bg-amber-400 border-4 border-slate-950 shadow-[0_0_25px_#f59e0b] flex items-center justify-center transition-all duration-700"
                style={{ left: '55%', bottom: '58%' }}
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>

              {/* Left label: Sunrise */}
              <div className="absolute left-4 bottom-2 text-left">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Sunrise className="w-4 h-4" />
                  <span>Sunrise</span>
                </div>
                <span className="text-sm font-semibold text-white">{sunrise}</span>
              </div>

              {/* Center label: Solar Noon */}
              <div className="absolute bottom-2 text-center">
                <span className="text-xs text-slate-400 font-medium">Solar Noon</span>
                <span className="text-sm font-semibold text-amber-300 block">{solarNoon}</span>
              </div>

              {/* Right label: Sunset */}
              <div className="absolute right-4 bottom-2 text-right">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs justify-end">
                  <Sunset className="w-4 h-4" />
                  <span>Sunset</span>
                </div>
                <span className="text-sm font-semibold text-white">{sunset}</span>
              </div>
            </div>
          </div>

          {/* Twilight & Photography Windows (Golden / Blue Hour) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/60">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Evening Golden Hour</span>
              </div>
              <p className="text-sm font-semibold text-white">{astro?.goldenHourEvening || '7:05 PM – 7:45 PM'}</p>
              <p className="text-[11px] text-slate-400 mt-1">Warm soft direct light with minimal shadow harshness.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evening Blue Hour</span>
              </div>
              <p className="text-sm font-semibold text-white">{astro?.blueHourEvening || '7:45 PM – 8:02 PM'}</p>
              <p className="text-[11px] text-slate-400 mt-1">Deep indigo skylight optimal for architectural exposures.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Dusk & Nightfall</span>
              </div>
              <p className="text-sm font-semibold text-white">{astro?.dusk || '8:12 PM'}</p>
              <p className="text-[11px] text-slate-400 mt-1">Sun sinks 6° below horizon; complete astronomical darkness.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lunar Cycle & Moon Phase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Moon Phase Visual */}
        <div className="lg:col-span-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Current Lunar Phase
              </span>
              <Badge variant="primary">{moonIllum}% Illumination</Badge>
            </div>

            <div className="flex items-center gap-6 my-6">
              {/* Moon glowing visual orb */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-400 shadow-[0_0_35px_rgba(226,232,240,0.35)] relative overflow-hidden shrink-0 border-2 border-slate-300/40">
                {/* Simulated shadow crescent for waxing gibbous */}
                <div className="absolute inset-0 bg-slate-950/75 rounded-full -left-6" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              </div>

              <div>
                <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {moonPhase}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Moon Age: {astro?.moonAgeDays || 10.4} days into 29.5-day synodic cycle
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] text-slate-300 font-medium">Next Phase: Full Moon in 4 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-slate-400 block mb-1">Moonrise Today</span>
              <span className="text-sm font-semibold text-white">{moonrise}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <span className="text-slate-400 block mb-1">Moonset Tomorrow</span>
              <span className="text-sm font-semibold text-white">{moonset}</span>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Celestial Calendar */}
        <div className="lg:col-span-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Astronomical Calendar
              </span>
              <Badge variant="neutral">2026 Lunar Cycle</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-xs shadow-md">
                    🌕
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">Harvest Full Moon</span>
                    <p className="text-xs text-slate-400">100% illumination • Peak night sky brightness</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-blue-300 font-semibold">{astro?.nextFullMoonDate || 'Sep 8, 2026'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    🌑
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">Equinox New Moon</span>
                    <p className="text-xs text-slate-400">0% illumination • Ideal for deep-sky stargazing</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{astro?.nextNewMoonDate || 'Sep 23, 2026'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs">
                    ☀️
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">Autumnal Equinox</span>
                    <p className="text-xs text-slate-400">Equal day & night (12h 00m)</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-300">Sep 22, 2026</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-4 border-t border-slate-800/60 mt-4">
            Stargazing conditions for tonight: <strong>Excellent</strong>. Minimal cloud cover and low regional light interference along coastal bluffs.
          </p>
        </div>
      </div>
    </div>
  );
}
