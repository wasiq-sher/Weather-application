import React from 'react';
import Badge from './Badge.jsx';

/**
 * Reusable MetricCard Component for Atmosphere AI
 * Displays individual telemetry data points (UV, Wind, AQI, Humidity, Pressure)
 * with standardized typography, visual indicator bars, and insight notes.
 */
export default function MetricCard({
  title,
  icon: Icon = null,
  value,
  unit,
  badgeText,
  badgeVariant = 'primary',
  description,
  children,
  footer,
  className = '',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[28px] bg-slate-900/40 border border-slate-800/50 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/60 transition group relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:bg-slate-900/50' : ''
      } ${className}`}
    >
      {/* Top row: Section Label & Icon Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span className="font-semibold uppercase tracking-wider text-xs">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:text-cyan-300 transition shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Main value display */}
      <div className="my-2">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-3xl font-bold text-white tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-slate-400 font-medium">
              {unit}
            </span>
          )}
          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-xs text-slate-400 leading-snug">
            {description}
          </p>
        )}

        {/* Custom gauges or visualization children */}
        {children && <div className="mt-3">{children}</div>}
      </div>

      {/* Bottom informational note */}
      {footer && (
        <p className="text-xs text-slate-400 pt-3 border-t border-slate-800/60 mt-3">
          {footer}
        </p>
      )}
    </div>
  );
}
