import React from 'react';

/**
 * Reusable WeatherCard Component for Atmosphere AI
 * Core container component implementing the signature Immersive UI glassmorphism:
 * 32px corner radius, slate border, backdrop blur, and selective ambient glow.
 */
export default function WeatherCard({
  title,
  subtitle,
  icon: Icon = null,
  badge = null,
  actions = null,
  children,
  glow = 'blue',
  padding = 'normal',
  className = '',
  id,
  onClick,
}) {
  const glowMap = {
    blue: 'from-blue-600/10 to-transparent',
    purple: 'from-purple-600/10 to-transparent',
    cyan: 'from-cyan-600/10 to-transparent',
    amber: 'from-amber-600/10 to-transparent',
    emerald: 'from-emerald-600/10 to-transparent',
    none: '',
  };

  const paddingMap = {
    none: 'p-0',
    tight: 'p-4 sm:p-5',
    normal: 'p-6 lg:p-8',
    spacious: 'p-8 lg:p-10',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-[32px] bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-slate-700/80 hover:bg-slate-900/50 active:scale-[0.99]' : ''
      } ${className}`}
    >
      {/* Ambient gradient glow in corner */}
      {glow !== 'none' && (
        <div
          className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${glowMap[glow] || glowMap.blue} rounded-full blur-3xl pointer-events-none opacity-60`}
        />
      )}

      <div className={`relative z-10 ${paddingMap[padding] || paddingMap.normal}`}>
        {/* Header if title, icon, or actions provided */}
        {(title || Icon || badge || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/40">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  {title && (
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                      {title}
                    </h3>
                  )}
                  {badge}
                </div>
                {subtitle && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>
        )}

        {/* Content body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
