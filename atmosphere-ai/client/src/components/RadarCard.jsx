import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Compass, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2,
  Plus, 
  Minus, 
  Navigation,
  RotateCw,
  Crosshair,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import RainRadarLayer from './RainRadarLayer.jsx';
import WindLayer from './WindLayer.jsx';
import CloudLayer from './CloudLayer.jsx';

// Stadia Maps API Key provided by user
const STADIA_API_KEY = import.meta.env.VITE_STADIA_MAPS_API_KEY || 'c1610257-cddf-45cb-9a3a-dc91d8603559';

export default function RadarCard() {
  const { radarLayer, setRadarLayer, activeLocation } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [timelineStep, setTimelineStep] = useState(1); // 0: 1 hr ago, 1: NOW, 2: In 1 hr
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // References
  const cardContainerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Exact location coordinates
  const currentLat = Number(activeLocation?.lat ?? activeLocation?.latitude ?? 37.7749);
  const currentLon = Number(activeLocation?.lon ?? activeLocation?.longitude ?? -122.4194);
  const locationName = activeLocation?.name || 'Current Location';

  const [userCoords, setUserCoords] = useState({
    lat: currentLat,
    lon: currentLon,
    name: locationName,
    isGps: false
  });

  const layers = [
    { id: 'rain', label: 'Rain' },
    { id: 'wind', label: 'Wind' },
    { id: 'clouds', label: 'Clouds' },
  ];

  // 1. Initialize Leaflet Map with Stadia Maps Tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [currentLat, currentLon],
      zoom: 11,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Primary basemap: Stadia Maps Alidade Smooth Dark with User API Key
    const stadiaUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`;
    const stadiaLayer = L.tileLayer(stadiaUrl, {
      maxZoom: 20,
      subdomains: '',
    }).addTo(map);

    // Safety fallback: if Stadia Maps key is invalid or reaches quota, load CartoDB Dark Matter
    stadiaLayer.on('tileerror', () => {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);
    });

    // Subtle dark attribution control
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<span style="font-size: 8px; color: #475569;">© Stadia Maps © OpenMapTiles © OSM</span>',
      })
      .addTo(map);

    // Custom Glowing "You Are Here" Marker Icon
    const youAreHereIcon = L.divIcon({
      className: 'you-are-here-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 44px; height: 44px; cursor: pointer;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(56, 189, 248, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 0 16px #38bdf8; display: flex; align-items: center; justify-content: center; z-index: 2;">
            <div style="width: 4px; height: 4px; border-radius: 50%; background: #ffffff;"></div>
          </div>
          <div style="position: absolute; top: 30px; white-space: nowrap; background: rgba(3, 7, 18, 0.94); border: 1px solid rgba(56, 189, 248, 0.6); padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 700; color: #7dd3fc; box-shadow: 0 4px 10px rgba(0,0,0,0.6); pointer-events: none; z-index: 3;">
            You Are Here
          </div>
        </div>
      `,
      iconSize: [44, 48],
      iconAnchor: [22, 22],
      popupAnchor: [0, -20],
    });

    const marker = L.marker([currentLat, currentLon], {
      icon: youAreHereIcon,
      title: 'You Are Here',
      zIndexOffset: 1000,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 160px; color: #0f172a;">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13px; color: #0284c7; margin-bottom: 2px;">
          <span>📍 You Are Here</span>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">
          ${locationName}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-family: monospace;">
          <span>Lat: ${currentLat.toFixed(4)}°</span>
          <span>Lon: ${currentLon.toFixed(4)}°</span>
        </div>
      </div>
    `);

    markerRef.current = marker;
    mapRef.current = map;
    setMapReady(true);

    // Responsive container observer
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // 2. Sync map & marker when active location changes in app
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo([currentLat, currentLon]);

    if (markerRef.current) {
      markerRef.current.setLatLng([currentLat, currentLon]);
      markerRef.current.setPopupContent(`
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 160px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13px; color: #0284c7; margin-bottom: 2px;">
            <span>📍 You Are Here</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">
            ${locationName}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-family: monospace;">
            <span>Lat: ${currentLat.toFixed(4)}°</span>
            <span>Lon: ${currentLon.toFixed(4)}°</span>
          </div>
        </div>
      `);
    }

    setUserCoords({
      lat: currentLat,
      lon: currentLon,
      name: locationName,
      isGps: false
    });
  }, [currentLat, currentLon, locationName]);

  // 3. User GPS Exact Geolocation Action
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;

        setUserCoords({
          lat: latitude,
          lon: longitude,
          name: 'Your GPS Location',
          isGps: true
        });

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
        }

        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          markerRef.current.setPopupContent(`
            <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 170px; color: #0f172a;">
              <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13px; color: #10b981; margin-bottom: 2px;">
                <span>🎯 GPS Verified Location</span>
              </div>
              <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
                You Are Here (Exact GPS)
              </div>
              <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">
                Accuracy: ±${Math.round(accuracy)}m
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #475569; font-family: monospace;">
                <span>Lat: ${latitude.toFixed(4)}°</span>
                <span>Lon: ${longitude.toFixed(4)}°</span>
              </div>
            </div>
          `);
          markerRef.current.openPopup();
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS location request notice:', err.message);
        // Fall back to active location
        if (mapRef.current) {
          mapRef.current.flyTo([currentLat, currentLon], 11, { duration: 1.2 });
          markerRef.current?.openPopup();
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [currentLat, currentLon]);

  // 4. Map Zoom Actions
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const toggleFullscreen = () => {
    if (!cardContainerRef.current) return;
    if (!document.fullscreenElement) {
      cardContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={cardContainerRef}
      className={`rounded-[32px] bg-slate-900/50 border border-slate-800/50 p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl ${
        isFullscreen ? 'h-screen w-screen p-8 bg-slate-950' : 'h-full'
      }`}
    >
      {/* Background dot grid pattern from Immersive UI */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      {/* Header with layer selector */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex items-center justify-center text-slate-950 font-bold">
            <Compass className="w-4 h-4 animate-[spin_20s_linear_infinite]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
              Atmospheric Radar Feed
            </h3>
            <p className="text-[11px] text-slate-400">
              Live Stadia Maps satellite & precipitation telemetry
            </p>
          </div>
        </div>

        {/* Layer tabs as rounded pills */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-full border border-slate-800/80 backdrop-blur-md">
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => setRadarLayer(layer.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                radarLayer === layer.id
                  ? 'bg-blue-500 text-white font-semibold shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real Interactive Map Container */}
      <div className="relative w-full aspect-[16/10] min-h-[280px] rounded-[24px] bg-[#030712] border border-slate-700/50 overflow-hidden flex items-center justify-center my-2 shadow-inner">
        {/* Leaflet DOM Node */}
        <div 
          ref={mapContainerRef} 
          className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
          style={{ background: '#090d16' }}
        />

        {/* Weather Data Overlays */}
        {mapReady && mapRef.current && (
          <>
            {radarLayer === 'rain' && (
              <RainRadarLayer 
                map={mapRef.current} 
                frameIndex={timelineStep * 2 + 1} 
                center={{ lat: userCoords.lat, lon: userCoords.lon }}
                opacity={0.8}
              />
            )}
            {radarLayer === 'wind' && (
              <WindLayer 
                map={mapRef.current} 
                frameIndex={timelineStep * 2 + 1} 
                center={{ lat: userCoords.lat, lon: userCoords.lon }}
              />
            )}
            {radarLayer === 'clouds' && (
              <CloudLayer 
                map={mapRef.current} 
                frameIndex={timelineStep * 2 + 1} 
                center={{ lat: userCoords.lat, lon: userCoords.lon }}
                opacity={0.75}
              />
            )}
          </>
        )}

        {/* Sci-Fi Radar Distance Grid & Crosshairs (Pointer-Events-None) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-64 h-64 border border-blue-500/15 rounded-full" />
          <div className="w-48 h-48 border border-blue-400/25 rounded-full" />
          <div className="w-32 h-32 border border-blue-500/20 rounded-full" />
          <div className="w-16 h-16 border border-cyan-400/30 rounded-full" />

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-blue-500/10" />
          <div className="absolute h-full w-[1px] bg-blue-500/10" />

          {/* Range label */}
          <span className="absolute top-4 text-[10px] font-mono text-blue-400/80 tracking-wider bg-slate-950/70 px-2 py-0.5 rounded-full border border-blue-500/20 backdrop-blur-sm">
            RANGE: 25 MILES
          </span>
        </div>

        {/* Animated Radar Sweep Cone (Pointer-Events-None) */}
        {isPlaying && (
          <div className="absolute w-full h-full flex items-center justify-center pointer-events-none z-10">
            <div className="w-64 h-64 rounded-full overflow-hidden relative animate-[spin_6s_linear_infinite]">
              <div 
                className="w-1/2 h-1/2 absolute right-0 bottom-0 origin-top-left"
                style={{
                  background: 'conic-gradient(from 180deg at 0% 0%, rgba(59, 130, 246, 0.28) 0deg, rgba(56, 189, 248, 0.05) 45deg, transparent 90deg)',
                }}
              />
            </div>
          </div>
        )}

        {/* Wind status badge */}
        <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-700/60 rounded-full px-3 py-1 text-[11px] text-slate-300 flex items-center gap-2 backdrop-blur-md z-20 shadow-lg">
          <Navigation className="w-3 h-3 text-blue-400 rotate-45" />
          <span>Wind: <strong>12 mph NW</strong></span>
          <span className="text-slate-500 hidden sm:inline">• Pacific flow</span>
        </div>

        {/* Live Radar Feed [SF_01] Pill */}
        <div className="absolute bottom-4 left-4 text-[10px] uppercase font-mono text-slate-400 bg-slate-950/80 border border-slate-700/60 px-3 py-1 rounded-full backdrop-blur-md z-20 flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Radar Feed [{userCoords.isGps ? 'GPS_LIVE' : 'SF_01'}]</span>
        </div>

        {/* Interactive Controls: Zoom + / Zoom - / Locate Me / Maximize */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button 
            onClick={handleZoomIn}
            title="Zoom in map"
            className="w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-sm font-semibold text-white hover:bg-blue-600/80 hover:border-blue-400 transition shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleZoomOut}
            title="Zoom out map"
            className="w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-sm font-semibold text-white hover:bg-blue-600/80 hover:border-blue-400 transition shadow-lg"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleLocateMe}
            title="Pinpoint My Exact GPS Location"
            className={`w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-center transition shadow-lg ${
              isLocating ? 'text-cyan-400 animate-spin' : userCoords.isGps ? 'text-emerald-400 border-emerald-500/50' : 'text-slate-300 hover:text-cyan-400 hover:border-cyan-400'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={toggleFullscreen}
            title="Toggle full screen"
            className="w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Intensity Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-700/60 rounded-full px-3 py-1 text-[10px] text-slate-400 flex items-center gap-2 backdrop-blur-md z-20 shadow-lg">
          <span>Light</span>
          <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-rose-500" />
          <span>Heavy Rain</span>
        </div>
      </div>

      {/* Playback timeline slider */}
      <div className="mt-4 flex items-center gap-3 pt-2 z-10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <button 
              onClick={() => setTimelineStep(0)} 
              className={timelineStep === 0 ? 'text-blue-400 font-semibold' : ''}
            >
              1 hr ago (Past)
            </button>
            <button 
              onClick={() => setTimelineStep(1)} 
              className={timelineStep === 1 ? 'text-blue-300 font-bold' : ''}
            >
              NOW (Live Doppler)
            </button>
            <button 
              onClick={() => setTimelineStep(2)} 
              className={timelineStep === 2 ? 'text-blue-400 font-semibold' : ''}
            >
              +1 hr (Forecast)
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={timelineStep}
            onChange={(e) => setTimelineStep(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <button 
          onClick={() => setTimelineStep(1)}
          className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 text-[11px] font-medium text-slate-300 shrink-0 flex items-center gap-1.5 backdrop-blur-md"
        >
          <RotateCw className="w-3 h-3 text-blue-400" />
          <span>Loop</span>
        </button>
      </div>
    </div>
  );
}
