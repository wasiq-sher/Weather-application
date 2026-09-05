import React from 'react';

/**
 * Reusable Loading Spinner Component for Atmosphere AI
 * Double-ring orbital spinner with atmospheric pulse and optional telemetry label.
 */
export default function LoadingSpinner({
  size = 'md',
  message = 'Synchronizing atmospheric telemetry...',
  fullPage = false,
  className = '',
}) {
  const sizeMap = {
    sm: { ring: 'w-6 h-6 border-2', pulse: 'w-2 h-2', text: 'text-xs' },
    md: { ring: 'w-10 h-10 border-2', pulse: 'w-3 h-3', text: 'text-xs sm:text-sm' },
    lg: { ring: 'w-16 h-16 border-3', pulse: 'w-4 h-4', text: 'text-sm sm:text-base' },
    xl: { ring: 'w-24 h-24 border-4', pulse: 'w-6 h-6', text: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3.5 text-center p-6 ${className}`}>
      {/* Orbital animated rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div
          className={`${currentSize.ring} rounded-full border-blue-500/20 border-t-blue-400 animate-spin`}
        />
        {/* Counter-rotating inner glow ring */}
        <div
          className={`absolute ${currentSize.ring} rounded-full border-cyan-400/10 border-b-cyan-400 animate-spin [animation-duration:1.5s] [animation-direction:reverse]`}
        />
        {/* Central pulsing core */}
        <div
          className={`absolute ${currentSize.pulse} rounded-full bg-blue-400 animate-ping opacity-75 shadow-[0_0_12px_#38bdf8]`}
        />
      </div>

      {message && (
        <div className="space-y-1 max-w-xs">
          <p className={`${currentSize.text} font-medium text-slate-300 tracking-tight`}>
            {message}
          </p>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            LIVE ORBITAL LINK
          </p>
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
