import React from 'react';
import { 
  CloudRain, 
  Wind, 
  Cloud, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  Sliders,
  Layers
} from 'lucide-react';

/**
 * RadarControls Component
 * Manages layer switching (Rain, Wind, Clouds), map navigation controls
 * (Zoom In, Zoom Out, Locate User, Fullscreen), and radar layer opacity.
 */
export default function RadarControls({
  activeLayer = 'rain',
  onChangeLayer,
  onZoomIn,
  onZoomOut,
  onLocateUser,
  isLocating = false,
  isFullscreen = false,
  onToggleFullscreen,
  opacity = 0.8,
  onChangeOpacity,
  className = '',
}) {
  const layers = [
    { id: 'rain', label: 'Rain Doppler', icon: CloudRain, color: 'text-blue-400' },
    { id: 'wind', label: 'Wind Velocity', icon: Wind, color: 'text-teal-400' },
    { id: 'clouds', label: 'Satellite Clouds', icon: Cloud, color: 'text-slate-300' },
  ];

  return (
    <div
      id="radar-controls-bar"
      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl ${className}`}
    >
      {/* 1. Layer Switching Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1 px-2 text-slate-500 text-xs hidden sm:flex">
          <Layers className="w-3.5 h-3.5" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">Layers</span>
        </div>
        {layers.map((l) => {
          const Icon = l.icon;
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              id={`radar-control-layer-${l.id}`}
              onClick={() => onChangeLayer(l.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : l.color}`} />
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Map Action Controls (Locate User, Zoom In, Zoom Out, Fullscreen) */}
      <div className="flex items-center gap-2">
        {/* Layer Opacity Slider */}
        {onChangeOpacity && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
            <Sliders className="w-3 h-3 text-slate-500" />
            <span className="text-[11px]">Opacity</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              title={`Layer Opacity: ${Math.round(opacity * 100)}%`}
            />
            <span className="text-[10px] font-mono text-slate-500">{Math.round(opacity * 100)}%</span>
          </div>
        )}

        {/* Locate User Button */}
        <button
          id="radar-locate-user-btn"
          onClick={onLocateUser}
          disabled={isLocating}
          title="Center on My Location ('You Are Here')"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800/60 transition shadow-sm"
        >
          <Crosshair className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
          <span className="text-xs font-semibold hidden sm:inline">You Are Here</span>
        </button>

        {/* Zoom In Button */}
        <button
          id="radar-zoom-in-btn"
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out Button */}
        <button
          id="radar-zoom-out-btn"
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          id="radar-fullscreen-toggle-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className={`p-2 rounded-xl border transition ${
            isFullscreen
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
