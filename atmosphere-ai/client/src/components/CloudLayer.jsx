import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import radarService from '../services/radarService.js';

/**
 * CloudLayer Component
 * Renders satellite infrared and visible cloud deck coverage on Leaflet.
 */
export default function CloudLayer({
  map,
  frameIndex = 5,
  center = { lat: 37.7749, lon: -122.4194 },
  opacity = 0.7,
}) {
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const group = layerGroupRef.current;
    group.clearLayers();

    const cloudData = radarService.getRadarData('clouds', frameIndex, center);
    if (cloudData && cloudData.patches) {
      cloudData.patches.forEach((patch) => {
        // Outer diffuse cloud canopy
        const cloudCircle = L.circle([patch.lat, patch.lon], {
          radius: patch.radiusKm * 1000,
          color: '#cbd5e1',
          weight: 0.5,
          opacity: opacity * 0.3,
          fillColor: '#f8fafc',
          fillOpacity: opacity * patch.opacity * 0.45,
        });

        // Dense inner condensation deck
        const denseDeck = L.circle([patch.lat, patch.lon], {
          radius: (patch.radiusKm * 0.6) * 1000,
          color: '#94a3b8',
          weight: 1,
          opacity: opacity * 0.5,
          fillColor: '#e2e8f0',
          fillOpacity: opacity * patch.opacity * 0.7,
        });

        denseDeck.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <div style="font-weight: 700; color: #1e293b; font-size: 13px; margin-bottom: 2px;">
              ☁️ ${patch.type} Deck
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 4px;">
              <span style="color: #64748b;">Cloud Coverage:</span>
              <strong>${Math.round(patch.opacity * 100)}% Dense</strong>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              <span style="color: #64748b;">Deck Span:</span>
              <span>${patch.radiusKm} km radius</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              <span style="color: #64748b;">Estimated Ceiling:</span>
              <span>1,200 ft AGL</span>
            </div>
          </div>
        `);

        cloudCircle.addTo(group);
        denseDeck.addTo(group);
      });
    }

    return () => {
      if (layerGroupRef.current && map) {
        layerGroupRef.current.clearLayers();
      }
    };
  }, [map, frameIndex, center.lat, center.lon, opacity]);

  return null;
}
