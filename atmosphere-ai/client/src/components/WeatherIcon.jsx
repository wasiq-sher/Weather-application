import React, { memo } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Snowflake,
  Wind,
  Droplets,
} from 'lucide-react';

/**
 * Reusable Weather Icon Component for Atmosphere AI
 * Maps standardized meteorological condition codes to styled Lucide icons
 * with optional ambient glow and dynamic sizing.
 */
function WeatherIcon({
  code = 'clear-day',
  size = 'md',
  animate = false,
  className = '',
}) {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const normalized = (code || '').toLowerCase().trim();

  // Determine icon and theme styling based on normalized condition code
  let IconComponent = Sun;
  let colorClass = 'text-amber-400';
  let glowColor = 'shadow-[0_0_12px_rgba(251,191,36,0.5)]';

  if (normalized.includes('clear-day') || normalized.includes('sunny')) {
    IconComponent = Sun;
    colorClass = 'text-amber-400';
    glowColor = 'shadow-[0_0_15px_rgba(251,191,36,0.6)]';
  } else if (normalized.includes('clear-night') || normalized.includes('moon')) {
    IconComponent = Moon;
    colorClass = 'text-blue-300';
    glowColor = 'shadow-[0_0_15px_rgba(147,197,253,0.5)]';
  } else if (normalized.includes('partly-cloudy-night')) {
    IconComponent = CloudMoon;
    colorClass = 'text-blue-200';
    glowColor = 'shadow-[0_0_12px_rgba(191,219,254,0.4)]';
  } else if (normalized.includes('partly-cloudy') || normalized.includes('sun &')) {
    IconComponent = CloudSun;
    colorClass = 'text-amber-300';
    glowColor = 'shadow-[0_0_12px_rgba(252,211,77,0.4)]';
  } else if (normalized.includes('lightning') || normalized.includes('thunder')) {
    IconComponent = CloudLightning;
    colorClass = 'text-violet-400';
    glowColor = 'shadow-[0_0_15px_rgba(167,139,250,0.6)]';
  } else if (normalized.includes('rain') || normalized.includes('shower')) {
    IconComponent = CloudRain;
    colorClass = 'text-blue-400';
    glowColor = 'shadow-[0_0_15px_rgba(96,165,250,0.5)]';
  } else if (normalized.includes('drizzle') || normalized.includes('mist')) {
    IconComponent = CloudDrizzle;
    colorClass = 'text-cyan-300';
    glowColor = 'shadow-[0_0_12px_rgba(103,232,249,0.4)]';
  } else if (normalized.includes('fog')) {
    IconComponent = CloudFog;
    colorClass = 'text-slate-300';
    glowColor = 'shadow-[0_0_10px_rgba(203,213,225,0.3)]';
  } else if (normalized.includes('snow') || normalized.includes('ice') || normalized.includes('frost')) {
    IconComponent = Snowflake;
    colorClass = 'text-sky-200';
    glowColor = 'shadow-[0_0_15px_rgba(186,230,253,0.6)]';
  } else if (normalized.includes('wind') || normalized.includes('breeze')) {
    IconComponent = Wind;
    colorClass = 'text-teal-300';
    glowColor = 'shadow-[0_0_12px_rgba(94,234,212,0.4)]';
  } else if (normalized.includes('cloud')) {
    IconComponent = Cloud;
    colorClass = 'text-slate-300';
    glowColor = 'shadow-[0_0_10px_rgba(203,213,225,0.3)]';
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {animate && (
        <div
          className={`absolute inset-0 rounded-full blur-sm opacity-60 ${glowColor}`}
        />
      )}
      <IconComponent className={`${currentSize} ${colorClass} relative z-10`} />
    </div>
  );
}

export default memo(WeatherIcon);
