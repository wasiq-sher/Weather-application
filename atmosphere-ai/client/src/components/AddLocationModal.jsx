import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  Check, 
  Loader2, 
  Globe, 
  Clock, 
  Compass, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import LocationSearch from './LocationSearch.jsx';
import useLocation from '../hooks/useLocation.js';
import { COUNTRY_STATION_PRESETS } from '../services/locationService.js';

/**
 * AddLocationModal Component
 * 
 * Allows users to add a new meteorological station to their tracked locations.
 * Features:
 * - One-click GPS location detection
 * - Global city search powered by LocationSearch
 * - Explicit storage of the 5 required parameters:
 *   1. city
 *   2. country
 *   3. latitude
 *   4. longitude
 *   5. timezone
 * - Option to save as favorite upon addition
 * - Flexible actions: "Add & Switch" or "Add to Saved"
 */
export default function AddLocationModal({
  isOpen,
  onClose,
  onLocationAdded,
}) {
  const { addLocation, detectLocation, isDetecting, detectionError } = useLocation();

  // Form State storing all required fields
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    region: '',
    latitude: '',
    longitude: '',
    timezone: 'UTC',
    isFavorite: false,
  });

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'manual'
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Preset quick adds
  const quickPicks = [
    { city: 'Paris', country: 'France', region: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
    { city: 'Berlin', country: 'Germany', region: 'Berlin', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
    { city: 'Singapore', country: 'Singapore', region: 'Central', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
    { city: 'Toronto', country: 'Canada', region: 'ON', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
    { city: 'Dubai', country: 'United Arab Emirates', region: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  ];

  const handleSelectFromSearch = (location) => {
    setFormData({
      city: location.city || location.name,
      country: location.country,
      region: location.region || '',
      latitude: location.latitude !== undefined ? location.latitude : location.lat,
      longitude: location.longitude !== undefined ? location.longitude : location.lon,
      timezone: location.timezone || 'UTC',
      isFavorite: formData.isFavorite,
    });
    setErrorMessage('');
  };

  const handleGpsDetect = async () => {
    setErrorMessage('');
    setSuccessNotice('');
    const result = await detectLocation({ addAndSelect: false });

    if (result.success && result.location) {
      const loc = result.location;
      setFormData({
        city: loc.city || loc.name,
        country: loc.country,
        region: loc.region || '',
        latitude: loc.latitude !== undefined ? loc.latitude : loc.lat,
        longitude: loc.longitude !== undefined ? loc.longitude : loc.lon,
        timezone: loc.timezone || 'UTC',
        isFavorite: formData.isFavorite,
      });
      setSuccessNotice(`Detected coordinates for ${loc.city || 'your area'}`);
    } else {
      setErrorMessage(result.error || 'Unable to detect GPS position.');
    }
  };

  const handleSubmit = (selectImmediately = true) => {
    // Validate required fields: city, country, latitude, longitude, timezone
    if (!formData.city.trim()) {
      setErrorMessage('Please specify a city name.');
      return;
    }
    if (!formData.country.trim()) {
      setErrorMessage('Please specify a country.');
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setErrorMessage('Latitude must be a valid number between -90 and 90.');
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setErrorMessage('Longitude must be a valid number between -180 and 180.');
      return;
    }

    const newLocation = {
      city: formData.city.trim(),
      name: formData.city.trim(),
      country: formData.country.trim(),
      region: formData.region.trim(),
      latitude: lat,
      longitude: lon,
      lat: lat,
      lon: lon,
      timezone: formData.timezone.trim() || 'UTC',
      isFavorite: formData.isFavorite,
    };

    const { saved } = addLocation(newLocation, {
      selectImmediately,
      isFavorite: formData.isFavorite,
    });

    if (onLocationAdded) {
      onLocationAdded(saved, selectImmediately);
    }

    // Reset and close
    setFormData({
      city: '',
      country: '',
      region: '',
      latitude: '',
      longitude: '',
      timezone: 'UTC',
      isFavorite: false,
    });
    setErrorMessage('');
    setSuccessNotice('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Meteorological Location"
      description="Incorporate new station coordinates or detect your active position into Atmosphere AI."
      size="lg"
    >
      <div className="space-y-5">
        {/* GPS Quick Detection Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-blue-900/30 border border-blue-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-500/30 flex items-center justify-center shrink-0">
              {isDetecting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Detect Current Position
                </h4>
                <Badge variant="primary" size="sm">
                  GPS Auto
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Acquire device sensor coordinates and reverse-geocode to atmospheric hub.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="xs"
            onClick={handleGpsDetect}
            disabled={isDetecting}
            icon={isDetecting ? Loader2 : Compass}
            className="w-full sm:w-auto"
          >
            {isDetecting ? 'Acquiring GPS...' : 'Detect Location'}
          </Button>
        </div>

        {/* Feedback notices */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {detectionError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{detectionError}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'search'
                ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Search City Database
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'manual'
                ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Coordinate Entry
          </button>
        </div>

        {/* Search City Section */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                City, Territory, or Coordinate Search
              </label>
              <LocationSearch
                onSelect={handleSelectFromSearch}
                onAdd={(loc) => {
                  handleSelectFromSearch(loc);
                  handleSubmit(false);
                }}
                autoFocus
              />
            </div>

            {/* Country & Regional Stations Preset Bar */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  Regional Country Presets:
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="text-xs bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                >
                  {Object.keys(COUNTRY_STATION_PRESETS).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {(COUNTRY_STATION_PRESETS[selectedCountry] || []).map((station) => (
                  <button
                    key={`${station.city}-${station.country}`}
                    type="button"
                    onClick={() => handleSelectFromSearch(station)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/70 hover:bg-blue-600/30 border border-slate-700/60 hover:border-blue-500/40 text-slate-200 hover:text-cyan-300 transition flex items-center gap-1"
                  >
                    <span>{station.city}</span>
                    <span className="text-[10px] text-slate-400">({station.region})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Pick Presets */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                Popular Global Hubs:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickPicks.map((pick) => (
                  <button
                    key={pick.city}
                    type="button"
                    onClick={() => handleSelectFromSearch(pick)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 transition flex items-center gap-1.5"
                  >
                    <span>{pick.city}</span>
                    <span className="text-[10px] text-slate-500">• {pick.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Attributes Details (The 5 Required Fields) */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Location Attributes (Stored Parameters)
            </span>
            <Badge variant="outline" size="sm">
              5 Core Metrics
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. City */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                City / Station Name <span className="text-cyan-400">*</span>
              </label>
              <input
                id="input-city-name"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Barcelona"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 2. Country */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Country <span className="text-cyan-400">*</span>
              </label>
              <input
                id="input-country-name"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. Spain"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 3. Latitude */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Latitude (-90 to 90) <span className="text-cyan-400">*</span>
              </label>
              <input
                id="input-latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g. 41.3879"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* 4. Longitude */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Longitude (-180 to 180) <span className="text-cyan-400">*</span>
              </label>
              <input
                id="input-longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g. 2.1699"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* 5. Timezone */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Timezone Identifier <span className="text-cyan-400">*</span>
              </label>
              <input
                id="input-timezone"
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="e.g. Europe/Madrid or UTC"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Favorite Toggle Option */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <label
              htmlFor="toggle-favorite-option"
              className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300"
            >
              <div
                onClick={() => setFormData({ ...formData, isFavorite: !formData.isFavorite })}
                className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                  formData.isFavorite
                    ? 'bg-amber-500 border-amber-400 text-slate-950'
                    : 'bg-slate-800 border-slate-700 text-transparent'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="flex items-center gap-1.5">
                <Star
                  className={`w-3.5 h-3.5 ${
                    formData.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                  }`}
                />
                Mark as Favorite Location
              </span>
            </label>

            <span className="text-[11px] text-slate-500">
              Saved to browser storage
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSubmit(false)}
            disabled={!formData.city.trim()}
            icon={Plus}
            className="w-full sm:w-auto"
          >
            Add to Saved
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSubmit(true)}
            disabled={!formData.city.trim()}
            icon={Check}
            className="w-full sm:w-auto"
          >
            Add & Switch
          </Button>
        </div>
      </div>
    </Modal>
  );
}
