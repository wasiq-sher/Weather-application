import React from 'react';
import CurrentWeather from './CurrentWeather.jsx';

/**
 * CurrentWeatherCard Component
 * Wraps CurrentWeather for the Atmosphere AI dashboard, supporting both direct telemetry props
 * and composite weather objects.
 */
export default function CurrentWeatherCard(props) {
  return <CurrentWeather {...props} />;
}
