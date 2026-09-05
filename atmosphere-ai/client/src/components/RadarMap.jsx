import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext.jsx';
import radarService from '../services/radarService.js';
import RadarControls from './RadarControls.jsx';
import RadarTimeline from './RadarTimeline.jsx';
import RadarLegend from './RadarLegend.jsx';
import RainRadarLayer from './RainRadarLayer.jsx';
import WindLayer from './WindLayer.jsx';
import CloudLayer from './CloudLayer.jsx';

/**
 * RadarMap Component
 * Interactive Leaflet weather radar map with live & forecast Doppler sweeps,
 * wind vector streamlines, satellite clouds, timeline animation, and "You Are Here" locator.
 */
export default function RadarMap({
  initialLayer = 'rain',
  centerLocation = null,
  height = '560px',
  className = '',
  showHeader = true,
}) {
  const { activeLocation, unit } = useApp();

  // Root container ref for fullscreen & Leaflet mount
  const containerRef = useRef(null);
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Map state
  const [activeLayer, setActiveLayer] = useState(initialLayer); // 'rain' | 'wind' | 'clouds'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [opacity, setOpacity] = useState(0.85);
  const [mapReady, setMapReady] = useState(false);

  // Timeline state
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(5); // Default to Live (index 5)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Current center coordinates memoized to prevent unnecessary object reference changes
  const resolvedCenter = React.useMemo(() => ({
    lat: centerLocation?.lat ?? activeLocation?.lat ?? 37.7749,
    lon: centerLocation?.lon ?? activeLocation?.lon ?? -122.4194,
    name: centerLocation?.name ?? activeLocation?.name ?? 'San Francisco',
  }), [centerLocation?.lat, centerLocation?.lon, centerLocation?.name, activeLocation?.lat, activeLocation?.lon, activeLocation?.name]);

  const [userCoords, setUserCoords] = useState(resolvedCenter);

  // 1. Fetch radar timeline frames on mount
  useEffect(() => {
    let mounted = true;
    async function loadFrames() {
      const timelineFrames = await radarService.getFrames();
      if (mounted && timelineFrames) {
        setFrames(timelineFrames);
      }
    }
    loadFrames();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Playback animation loop
  useEffect(() => {
    let timer;
    if (isPlaying && frames.length > 0) {
      const intervalMs = Math.round(1300 / playbackSpeed);
      timer = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev >= frames.length - 1 ? 0 : prev + 1));
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, frames.length]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    // Create Leaflet map instance
    const map = L.map(mapElementRef.current, {
      center: [resolvedCenter.lat, resolvedCenter.lon],
      zoom: 10,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false, // Handled by custom RadarControls
      attributionControl: false,
    });

    // Stadia Maps API Key provided by user
    const STADIA_API_KEY = import.meta.env.VITE_STADIA_MAPS_API_KEY || 'c1610257-cddf-45cb-9a3a-dc91d8603559';
    const stadiaUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`;

    // Primary dark basemap: Stadia Alidade Smooth Dark
    const basemapLayer = L.tileLayer(stadiaUrl, {
      maxZoom: 20,
      subdomains: '',
    }).addTo(map);

    // Keyless fallback to Esri World Dark Gray if Stadia tile loading fails
    basemapLayer.on('tileerror', () => {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      }).addTo(map);
    });

    // Subtle dark attribution control in corner
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<span style="font-size: 9px; color: #475569;">© Stadia Maps © OpenStreetMap © Esri</span>',
      })
      .addTo(map);

    // Create custom "You Are Here" Marker Icon with glowing pulse
    const youAreHereIcon = L.divIcon({
      className: 'you-are-here-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(56, 189, 248, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 0 14px #38bdf8; display: flex; align-items: center; justify-content: center;">
            <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    const marker = L.marker([resolvedCenter.lat, resolvedCenter.lon], {
      icon: youAreHereIcon,
      title: 'You Are Here',
      zIndexOffset: 1000,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 4px; min-width: 160px; color: #0f172a;">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13px; color: #0284c7; margin-bottom: 2px;">
          <span>📍 You Are Here</span>
        </div>
        <div style="font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">
          ${resolvedCenter.name}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-family: monospace;">
          <span>Lat: ${resolvedCenter.lat.toFixed(4)}°</span>
          <span>Lon: ${resolvedCenter.lon.toFixed(4)}°</span>
        </div>
      </div>
    `);

    userMarkerRef.current = marker;
    mapRef.current = map;
    setMapReady(true);

    // Initial size invalidation to ensure tiles fit container dimensions
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // ResizeObserver to ensure map properly adapts to container layout changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapElementRef.current) {
      resizeObserver.observe(mapElementRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update map center & marker when active location changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo([resolvedCenter.lat, resolvedCenter.lon]);
    }
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([resolvedCenter.lat, resolvedCenter.lon]);
      userMarkerRef.current.setPopupContent(`
        <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 4px; min-width: 160px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13px; color: #0284c7; margin-bottom: 2px;">
            <span>📍 You Are Here</span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">
            ${resolvedCenter.name}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-family: monospace;">
            <span>Lat: ${resolvedCenter.lat.toFixed(4)}°</span>
            <span>Lon: ${resolvedCenter.lon.toFixed(4)}°</span>
          </div>
        </div>
      `);
    }
    setUserCoords(resolvedCenter);
  }, [resolvedCenter.lat, resolvedCenter.lon, resolvedCenter.name]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isFs);
      if (mapRef.current) {
        setTimeout(() => mapRef.current.invalidateSize(), 150);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Map action callbacks
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  }, []);

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const newCoords = { lat: latitude, lon: longitude, name: 'Current GPS Location' };
        setUserCoords(newCoords);

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 12, { duration: 1.5 });
        }

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
          userMarkerRef.current.setPopupContent(`
            <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 4px; min-width: 160px; color: #0f172a;">
              <div style="font-weight: 800; font-size: 13px; color: #0284c7; margin-bottom: 2px;">
                📍 GPS Verified Location
              </div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
                Accuracy: ±${Math.round(pos.coords.accuracy)} meters
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; font-family: monospace;">
                <span>Lat: ${latitude.toFixed(4)}°</span>
                <span>Lon: ${longitude.toFixed(4)}°</span>
              </div>
            </div>
          `);
          userMarkerRef.current.openPopup();
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation lookup notice:', err.message);
        // Fallback to active location if user denies or geolocation is restricted in iframe
        if (mapRef.current) {
          mapRef.current.flyTo([resolvedCenter.lat, resolvedCenter.lon], 11, { duration: 1.2 });
          userMarkerRef.current?.openPopup();
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [resolvedCenter]);

  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fallback to CSS fullscreen if iframe denies requestFullscreen
        setIsFullscreen((prev) => !prev);
        if (mapRef.current) {
          setTimeout(() => mapRef.current.invalidateSize(), 150);
        }
      });
    } else {
      document.exitFullscreen().catch(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="radar-map-container"
      className={`rounded-[32px] bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none p-4 bg-[#020408]' : ''
      } ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : height }}
    >
      {/* 1. Header & Layer Controls Row */}
      <div className="relative z-20 mb-3">
        <RadarControls
          activeLayer={activeLayer}
          onChangeLayer={setActiveLayer}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocateUser={handleLocateUser}
          isLocating={isLocating}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          opacity={opacity}
          onChangeOpacity={setOpacity}
        />
      </div>

      {/* 2. Interactive Leaflet Viewport Container */}
      <div className="relative flex-1 w-full min-h-[420px] rounded-2xl border border-slate-800/90 overflow-hidden shadow-inner bg-[#040812]">
        {/* Leaflet DOM Node */}
        <div ref={mapElementRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" style={{ background: '#040812' }} />

        {/* Dynamic Separated Weather Layers */}
        {mapReady && mapRef.current && (
          <>
            {activeLayer === 'rain' && (
              <RainRadarLayer
                map={mapRef.current}
                frameIndex={currentFrameIndex}
                currentFrame={frames[currentFrameIndex]}
                center={userCoords}
                opacity={opacity}
              />
            )}

            {activeLayer === 'wind' && (
              <WindLayer
                map={mapRef.current}
                frameIndex={currentFrameIndex}
                center={userCoords}
                opacity={opacity}
                unit={unit === 'C' ? 'km/h' : 'mph'}
              />
            )}

            {activeLayer === 'clouds' && (
              <CloudLayer
                map={mapRef.current}
                frameIndex={currentFrameIndex}
                center={userCoords}
                opacity={opacity}
              />
            )}
          </>
        )}

        {/* Floating Top-Left Status HUD */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white uppercase">{activeLayer} LAYER</span>
            <span className="text-slate-500">•</span>
            <span>{resolvedCenter.name}</span>
          </div>
        </div>

        {/* Floating Weather Intensity Legend */}
        <div className="absolute bottom-3 left-3 z-20">
          <RadarLegend layer={activeLayer} unit={unit} />
        </div>
      </div>

      {/* 3. Radar Timeline Bar at Base */}
      <div className="relative z-20 mt-3">
        <RadarTimeline
          frames={frames}
          currentIndex={currentFrameIndex}
          onSelectFrame={setCurrentFrameIndex}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
        />
      </div>
    </div>
  );
}
