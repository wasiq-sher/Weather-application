import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Reusable Telemetry Alert Component for Atmosphere AI
 * Clear visual representation of data failures, connectivity interruptions,
 * and retry functionality for TanStack Query.
 */
export default function TelemetryAlert({
  title = 'Atmospheric Telemetry Unavailable',
  message = 'Unable to establish live connection with meteorological data feeds. Please check network connectivity or try again.',
  onRetry = null,
  retryLabel = 'Retry Connection',
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`rounded-[28px] bg-slate-900/50 border border-rose-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center max-w-xl mx-auto my-6 ${className}`}
    >
      {/* Background ambient warning glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
          {title}
        </h4>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
          {message}
        </p>

        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={onRetry}
            className="border-rose-500/40 text-rose-300 hover:text-white hover:bg-rose-500/20"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
