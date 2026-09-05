import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button Component for Atmosphere AI
 * Follows the Immersive UI design language: pill shapes, glow accents, and responsive micro-interactions.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon = null,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  className = '',
  id,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-blue-400/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeStyles = {
    xs: 'text-[10px] px-2.5 py-1 gap-1.5',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] border border-blue-400/20',
    secondary: 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-slate-600 shadow-md backdrop-blur-md',
    outline: 'bg-transparent hover:bg-white/[0.06] text-blue-400 hover:text-blue-300 border border-blue-500/40 hover:border-blue-400/70 shadow-[0_0_12px_rgba(59,130,246,0.1)]',
    ghost: 'bg-transparent hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-transparent',
    glass: 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    danger: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
}
