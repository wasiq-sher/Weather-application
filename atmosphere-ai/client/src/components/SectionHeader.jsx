import React from 'react';

/**
 * Reusable SectionHeader Component for Atmosphere AI
 * Consistent section titles across dashboard, radar, forecast, and sub-pages.
 */
export default function SectionHeader({
  title,
  subtitle,
  icon: Icon = null,
  badge = null,
  actions = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
