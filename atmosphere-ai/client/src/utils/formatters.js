/**
 * Atmosphere AI - Formatting Utilities
 */

export function formatTemperature(temp, unit = 'F') {
  if (temp === undefined || temp === null) return '--°';
  return `${Math.round(temp)}°${unit}`;
}

export function formatPercent(value) {
  if (value === undefined || value === null) return '0%';
  return `${Math.round(value)}%`;
}

export function formatPressure(hpa) {
  if (!hpa) return '1013 hPa';
  return `${hpa} hPa`;
}

export function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 min ago';
  return `${minutes} mins ago`;
}
