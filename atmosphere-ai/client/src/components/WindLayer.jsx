import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import radarService from '../services/radarService.js';

/**
 * WindLayer Component
 * Renders atmospheric wind velocity streamlines, direction vectors, and gust fields on Leaflet.
 */
export default function WindLayer({
  map,
  frameIndex = 5,
  center = { lat: 37.7749, lon: -122.4194 },
  opacity = 0.85,
  unit = 'mph',
}) {
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const group = layerGroupRef.current;
    group.clearLayers();

    const windData = radarService.getRadarData('wind', frameIndex, center);
    if (windData && windData.vectors) {
      windData.vectors.forEach((v) => {
        // Color based on wind speed
        let color = '#38bdf8'; // light breeze (<10)
        if (v.speedMph >= 12 && v.speedMph < 20) color = '#2dd4bf'; // moderate breeze
        else if (v.speedMph >= 20 && v.speedMph < 30) color = '#f59e0b'; // strong breeze
        else if (v.speedMph >= 30) color = '#ef4444'; // gale/storm

        const displaySpeed = unit === 'km/h' 
          ? `${Math.round(v.speedMph * 1.609)} km/h` 
          : `${v.speedMph} mph`;

        // Custom HTML marker for arrow direction and velocity tag
        const iconHtml = `
          <div style="
            display: flex; 
            align-items: center; 
            gap: 4px; 
            opacity: ${opacity};
            transform: translate(-50%, -50%);
          ">
            <div style="
              width: 24px; 
              height: 24px; 
              border-radius: 50%; 
              background: rgba(15, 23, 42, 0.75); 
              border: 1px solid ${color}80;
              box-shadow: 0 0 8px ${color}60;
              display: flex; 
              align-items: center; 
              justify-content: center;
              transform: rotate(${v.angleDeg}deg);
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </div>
            <span style="
              font-family: monospace; 
              font-size: 9px; 
              font-weight: 700; 
              color: ${color}; 
              background: rgba(2, 6, 23, 0.85); 
              padding: 1px 4px; 
              border-radius: 4px; 
              border: 1px solid rgba(255,255,255,0.1);
              white-space: nowrap;
            ">${displaySpeed}</span>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'wind-vector-icon',
          html: iconHtml,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker([v.lat, v.lon], { icon: customIcon });

        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <div style="font-weight: 700; color: #1e293b; font-size: 13px; margin-bottom: 2px;">
              💨 Wind Velocity Vector
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 4px;">
              <span style="color: #64748b;">Sustained Speed:</span>
              <strong style="color: ${color};">${displaySpeed}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              <span style="color: #64748b;">Peak Gusts:</span>
              <span>${unit === 'km/h' ? Math.round(v.gustMph * 1.609) + ' km/h' : v.gustMph + ' mph'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              <span style="color: #64748b;">Direction Bearing:</span>
              <span>${Math.round(v.angleDeg)}°</span>
            </div>
          </div>
        `);

        marker.addTo(group);
      });
    }

    return () => {
      if (layerGroupRef.current && map) {
        layerGroupRef.current.clearLayers();
      }
    };
  }, [map, frameIndex, center.lat, center.lon, opacity, unit]);

  return null;
}
