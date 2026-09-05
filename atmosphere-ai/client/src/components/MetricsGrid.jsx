import React from 'react';
import AirQualityCard from './AirQualityCard.jsx';
import UVIndexCard from './UVIndexCard.jsx';
import WindCard from './WindCard.jsx';
import HumidityCard from './HumidityCard.jsx';
import SunriseSunsetCard from './SunriseSunsetCard.jsx';
import PressureCard from './PressureCard.jsx';

/**
 * MetricsGrid Component
 * Six telemetry metrics: Air Quality Index, UV Radiation, Wind Velocity,
 * Relative Humidity, Solar Arc path, and Atmospheric Pressure.
 * Implemented using modular, reusable metric cards without duplicated markup.
 */
export default function MetricsGrid({ weather, airHealth, sunMoon }) {
  return (
    <div id="metrics-telemetry-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* 1. Air Quality */}
      <AirQualityCard 
        weather={weather} 
        airHealth={airHealth} 
      />

      {/* 2. UV Index */}
      <UVIndexCard 
        weather={weather} 
      />

      {/* 3. Wind Velocity */}
      <WindCard 
        weather={weather} 
      />

      {/* 4. Relative Humidity */}
      <HumidityCard 
        weather={weather} 
      />

      {/* 5. Sunrise & Sunset */}
      <SunriseSunsetCard 
        weather={weather} 
        sunMoon={sunMoon} 
      />

      {/* 6. Atmospheric Pressure */}
      <PressureCard 
        weather={weather} 
      />
    </div>
  );
}
