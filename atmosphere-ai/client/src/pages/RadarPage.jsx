import React, { useState } from 'react';
import { 
  Radio, 
  RotateCcw, 
  Wind, 
  CloudRain, 
  Cloud,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import RadarMap from '../components/RadarMap.jsx';

/**
 * RadarPage - Dedicated Full-Featured Radar Viewport
 * High-resolution Doppler simulation, multi-layer overlays, and storm cell telemetry.
 */
export default function RadarPage() {
  const { isRadarLive, setIsRadarLive, activeLocation } = useApp();
  const [radarKey, setRadarKey] = useState(0);

  const handleReset = () => {
    setRadarKey((k) => k + 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <SectionHeader
        title="High-Resolution Doppler Radar & Satellite"
        subtitle={`Live regional sweep centered on ${activeLocation?.name || 'San Francisco'} basin`}
        icon={Radio}
        badge={
          <Badge variant={isRadarLive ? 'info' : 'neutral'} dot={isRadarLive}>
            {isRadarLive ? 'Doppler Sweep Live' : 'Sweep Paused'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={isRadarLive ? 'glass' : 'secondary'}
              size="sm"
              onClick={() => setIsRadarLive(!isRadarLive)}
            >
              {isRadarLive ? 'Live Stream Active' : 'Resume Live'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
            >
              Reset View
            </Button>
          </div>
        }
      />

      {/* Main Interactive RadarMap Component */}
      <RadarMap key={radarKey} height="580px" />

      {/* Storm Cell Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <WeatherCard
          title="Pacific Frontal Swell"
          subtitle="Cell Delta-01 • Tracking Inbound"
          badge={<Badge variant="info">Approaching</Badge>}
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Estimated Arrival</span>
              <span className="text-white font-semibold">4:45 PM PST (~42 min)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Peak Reflectivity</span>
              <span className="text-cyan-400 font-mono">28 dBZ (Light Marine Rain)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Precipitation Accumulation</span>
              <span className="text-white">0.05 in / hr</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Marine surge carrying coastal advection fog into the Golden Gate Strait with reduced visibility.
            </p>
          </div>
        </WeatherCard>

        <WeatherCard
          title="Diablo Mountain Waves"
          subtitle="Cell Alpha-02 • Stationary"
          badge={<Badge variant="success">Dissipating</Badge>}
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Echo Top</span>
              <span className="text-white font-semibold">14,200 ft</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Wind Shear Risk</span>
              <span className="text-emerald-400 font-medium">Minimal (&lt; 5 kt)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Ground Rain Probability</span>
              <span className="text-white font-mono">0%</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Dry thermal boundary dissipating over Mt. Tamalpais under steady northwesterly flow.
            </p>
          </div>
        </WeatherCard>

        <WeatherCard
          title="Satellite Optical Summary"
          subtitle="GOES-18 Pacific Sector"
          badge={<Badge variant="primary">GOES-West</Badge>}
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Cloud Layer Classification</span>
              <span className="text-white font-semibold">Stratocumulus / Fog</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Cloud Base Height</span>
              <span className="text-white font-mono">850 ft AGL</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/40">
              <span className="text-slate-400">Albedo Index</span>
              <span className="text-blue-300 font-mono">0.68 (High Marine Stratus)</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Satellite imagery confirms continuous stratus deck banked against coastal mountain ridges.
            </p>
          </div>
        </WeatherCard>
      </div>
    </div>
  );
}
