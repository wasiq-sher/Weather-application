import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import radarService from '../services/radarService.js';

/**
 * RainRadarLayer Component
 * Renders radar reflectivity echoes (dBZ spectrum) and precipitation storm cells on Leaflet.
 * Supports both tile layers (e.g. RainViewer) and high-resolution vector storm cells.
 */
export default function RainRadarLayer({
  map,
  frameIndex = 5,
  currentFrame = null,
  center = { lat: 37.7749, lon: -122.4194 },
  opacity = 0.8,
  showSweep = true,
}) {
  const layerGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Initialize or clear layer group on Leaflet map
  useEffect(() => {
    if (!map) return;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const group = layerGroupRef.current;
    group.clearLayers();

    // 1. Check for tile layer from radar service
    const tileUrl = radarService.getTileUrl('rain', currentFrame);
    if (tileUrl) {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      tileLayerRef.current = L.tileLayer(tileUrl, {
        opacity: opacity,
        zIndex: 10,
      }).addTo(map);
    } else if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    // 2. Render Doppler radar vector cells and reflectivity contours
    const radarData = radarService.getRadarData('rain', frameIndex, center);
    if (radarData && radarData.cells) {
      radarData.cells.forEach((cell) => {
        // Outer dissipation halo
        const outerCircle = L.circle([cell.lat, cell.lon], {
          radius: cell.radiusKm * 1000,
          color: cell.color,
          weight: 1,
          opacity: opacity * 0.4,
          fillColor: cell.color,
          fillOpacity: opacity * 0.25,
        });

        // High-reflectivity convective core
        const coreCircle = L.circle([cell.lat, cell.lon], {
          radius: cell.coreRadiusKm * 1000,
          color: cell.color,
          weight: 1.5,
          opacity: opacity * 0.8,
          fillColor: cell.color,
          fillOpacity: opacity * 0.55,
        });

        // Interactive popup on cell hover/click
        coreCircle.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <div style="font-weight: 700; color: #1e293b; font-size: 13px; margin-bottom: 2px;">
              🌧️ ${cell.category}
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 4px;">
              <span style="color: #64748b;">Reflectivity:</span>
              <strong style="color: ${cell.color};">${cell.intensityDbz} dBZ</strong>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              <span style="color: #64748b;">Cell Radius:</span>
              <span>${cell.radiusKm} km</span>
            </div>
            <div style="margin-top: 4px; font-size: 10px; color: #94a3b8; font-style: italic;">
              Tracking East-Northeast at 18 kt
            </div>
          </div>
        `);

        outerCircle.addTo(group);
        coreCircle.addTo(group);
      });
    }

    return () => {
      if (layerGroupRef.current && map) {
        layerGroupRef.current.clearLayers();
      }
      if (tileLayerRef.current && map) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
    };
  }, [map, frameIndex, currentFrame, center.lat, center.lon, opacity]);

  return null;
}
