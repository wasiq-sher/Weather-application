import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Info } from 'lucide-react';

/**
 * RadarLegend Component
 * Displays meteorological scale and color gradient corresponding to the active radar layer.
 * 
 * Props:
 * - layer: 'rain' | 'wind' | 'clouds'
 * - unit: 'F' | 'C'
 * - className: string
 */
export default function RadarLegend({ layer = 'rain', unit = 'F', className = '' }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const speedUnit = unit === 'C' ? 'km/h' : 'mph';

  return (
    <div
      id="radar-intensity-legend"
      className={`rounded-2xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-xl p-3 shadow-2xl transition-all duration-300 pointer-events-auto ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {layer === 'rain' && 'Reflectivity (dBZ)'}
            {layer === 'wind' && `Wind Velocity (${speedUnit})`}
            {layer === 'clouds' && 'Satellite Cloud Cover (%)'}
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          title={isCollapsed ? 'Expand legend' : 'Collapse legend'}
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {!isCollapsed && (
        <div className="mt-2.5 space-y-1.5">
          {/* RAIN LEGEND */}
          {layer === 'rain' && (
            <div>
              <div className="w-48 sm:w-60 h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-emerald-400 via-amber-400 via-orange-500 via-red-500 to-purple-600 shadow-inner" />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>10 Light</span>
                <span>25 Mod</span>
                <span>45 Heavy</span>
                <span className="text-purple-400 font-bold">65+ Severe</span>
              </div>
              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                <span>&lt;0.05 in/h</span>
                <span>0.15 in/h</span>
                <span>0.50 in/h</span>
                <span>&gt;1.50 in/h</span>
              </div>
            </div>
          )}

          {/* WIND LEGEND */}
          {layer === 'wind' && (
            <div>
              <div className="w-48 sm:w-60 h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-teal-400 via-amber-400 to-rose-500 shadow-inner" />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>&lt;5 Calm</span>
                <span>15 Breeze</span>
                <span>25 Gusty</span>
                <span className="text-rose-400 font-bold">40+ Gale</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                Vector arrows indicate direction of atmospheric airflow
              </div>
            </div>
          )}

          {/* CLOUDS LEGEND */}
          {layer === 'clouds' && (
            <div>
              <div className="w-48 sm:w-60 h-2.5 rounded-full bg-gradient-to-r from-slate-800 via-slate-500 via-slate-300 to-white shadow-inner" />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                <span>0% Clear</span>
                <span>30% Scattered</span>
                <span>70% Broken</span>
                <span className="text-white font-bold">100% Dense</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                Infrared satellite albedo & marine stratus boundary
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
