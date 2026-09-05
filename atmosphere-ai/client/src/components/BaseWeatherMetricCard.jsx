import React from 'react';
import Badge from './Badge.jsx';

/**
 * Helper to determine badge color variant based on meteorological status keyword
 */
export function getStatusVariant(status) {
  if (!status) return 'primary';
  const s = String(status).toLowerCase();
  
  if (s.includes('good') || s.includes('normal') || s.includes('comfortable') || s.includes('low') || s.includes('clear') || s.includes('optimal') || s.includes('satisfactory')) {
    return 'success';
  }
  if (s.includes('moderate') || s.includes('fair') || s.includes('breezy') || s.includes('dry') || s.includes('humid') || s.includes('medium')) {
    return 'warning';
  }
  if (s.includes('unhealthy') || s.includes('poor') || s.includes('hazardous') || s.includes('extreme') || s.includes('very high') || s.includes('danger') || s.includes('high')) {
    return 'danger';
  }
  if (s.includes('balanced') || s.includes('fresh') || s.includes('calm') || s.includes('info')) {
    return 'info';
  }
  return 'primary';
}

/**
 * BaseWeatherMetricCard Component
 * 
 * Reusable base component for all individual weather metrics.
 * Eliminates markup duplication while providing unified aesthetic, typography,
 * responsive spacing, status badge coloring, and an optional visualization slot.
 * 
 * Props:
 * - title: string (Section label, e.g. "Air Quality", "UV Index", "Wind")
 * - value: string | number (Primary measurement value, e.g. 38, 4, 12, 74%)
 * - unit: string (Unit or secondary scale, e.g. "of 11", "mph NW", "%", "hPa")
 * - status: string (Category / health status, e.g. "Good", "Moderate", "Comfortable", "Normal")
 * - statusVariant: string ('success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral')
 * - description: string (Detailed readout or context sentence)
 * - icon: LucideIcon component
 * - visualization: ReactNode | boolean (Custom visual element or false to hide)
 * - footer: string (Optional secondary advisory at the card base)
 * - children: ReactNode (Alternative visualization slot)
 * - id: string (Unique DOM id)
 * - className: string (Optional styling classes)
 * - onClick: func (Optional click handler)
 */
export default function BaseWeatherMetricCard({
  title,
  value,
  unit,
  status,
  statusVariant,
  description,
  icon: Icon = null,
  visualization,
  footer,
  children,
  id,
  className = '',
  onClick,
}) {
  const resolvedVariant = statusVariant || getStatusVariant(status);
  const hasVisualization = visualization !== false && (visualization !== undefined || children !== undefined);

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-[28px] bg-slate-900/40 border border-slate-800/60 p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/70 transition-all duration-300 group relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:bg-slate-900/60' : ''
      } ${className}`}
    >
      {/* Background ambient lighting accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition duration-500" />

      {/* Top Header Row: Section Label & Ambient Icon Badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 group-hover:text-slate-300 transition">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.15)]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Middle Body: Primary Value, Unit, Status Badge & Description */}
      <div className="my-1.5 flex-1 flex flex-col justify-center">
        <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value !== undefined ? value : '--'}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm text-slate-400 font-medium tracking-normal">
              {unit}
            </span>
          )}
          {status && (
            <Badge variant={resolvedVariant} size="sm" className="ml-auto sm:ml-1">
              {status}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            {description}
          </p>
        )}

        {/* Optional Visualization Slot */}
        {hasVisualization && (
          <div className="mt-3.5">
            {visualization !== true && visualization}
            {children}
          </div>
        )}
      </div>

      {/* Bottom Footer Note (if provided) */}
      {footer && (
        <div className="pt-3 border-t border-slate-800/60 mt-3 text-[11px] text-slate-500 leading-snug font-normal flex items-center justify-between">
          <span>{footer}</span>
        </div>
      )}
    </div>
  );
}
