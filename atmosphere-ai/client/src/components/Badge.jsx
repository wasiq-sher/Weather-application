import React from 'react';

/**
 * Reusable Badge Component for Atmosphere AI
 * Compact pill badge with colored atmospheric glow and optional status pulse.
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  icon: Icon = null,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3.5 py-1.5 gap-2',
  };

  const variantStyles = {
    primary: 'bg-blue-500/15 border-blue-500/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    danger: 'bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    info: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    purple: 'bg-purple-500/15 border-purple-500/30 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    neutral: 'bg-slate-800/60 border-slate-700/60 text-slate-300',
    ai: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-blue-400/30',
  };

  const dotColors = {
    primary: 'bg-blue-400 shadow-[0_0_6px_#38bdf8]',
    success: 'bg-emerald-400 shadow-[0_0_6px_#34d399]',
    warning: 'bg-amber-400 shadow-[0_0_6px_#fbbf24]',
    danger: 'bg-rose-400 shadow-[0_0_6px_#f43f5e]',
    info: 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]',
    purple: 'bg-purple-400 shadow-[0_0_6px_#c084fc]',
    neutral: 'bg-slate-400 shadow-[0_0_6px_#94a3b8]',
    ai: 'bg-white shadow-[0_0_6px_#ffffff]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border backdrop-blur-md whitespace-nowrap select-none ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant] || dotColors.primary}`}
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{children}</span>
    </span>
  );
}
