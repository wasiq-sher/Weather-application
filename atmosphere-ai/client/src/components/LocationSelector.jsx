import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Check, 
  Plus, 
  Compass, 
  Star, 
  Trash2, 
  Navigation, 
  Loader2, 
  Globe, 
  Clock, 
  AlertCircle,
  Radio
} from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import AddLocationModal from './AddLocationModal.jsx';
import useLocation from '../hooks/useLocation.js';

/**
 * LocationSelector Component
 * 
 * Complete location management suite for Atmosphere AI.
 * Implements:
 * - Current location detection (GPS & Reverse Geocoding)
 * - City search and station filtering
 * - Selecting active location
 * - Adding new locations (via AddLocationModal)
 * - Removing saved locations
 * - Saving/toggling favorite locations
 * 
 * Displays and persists the 5 core attributes:
 * 1. city
 * 2. country
 * 3. latitude
 * 4. longitude
 * 5. timezone
 */
export default function LocationSelector({
  isOpen,
  onClose,
  currentLocationId,
  onSelectLocation,
}) {
  const {
    locations,
    activeLocation,
    favorites,
    isDetecting,
    detectionError,
    setDetectionError,
    detectLocation,
    selectLocation,
    removeLocation,
    toggleFavorite,
  } = useLocation();

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [gpsSuccessNotice, setGpsSuccessNotice] = useState('');

  // Filter locations by search term and tab
  const displayedLocations = locations.filter((loc) => {
    // Tab filter
    if (filterTab === 'favorites' && !loc.isFavorite) {
      return false;
    }

    // Search filter
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const city = (loc.city || loc.name || '').toLowerCase();
    const country = (loc.country || '').toLowerCase();
    const region = (loc.region || '').toLowerCase();
    const tz = (loc.timezone || '').toLowerCase();

    return (
      city.includes(term) ||
      country.includes(term) ||
      region.includes(term) ||
      tz.includes(term)
    );
  });

  const handleSelect = (location) => {
    selectLocation(location);
    if (onSelectLocation) {
      onSelectLocation(location);
    }
    onClose();
  };

  const handleGpsDetect = async () => {
    setGpsSuccessNotice('');
    setDetectionError(null);

    const res = await detectLocation({ addAndSelect: true });
    if (res.success && res.location) {
      setGpsSuccessNotice(`Switched to ${res.location.city || 'detected coordinates'}`);
      if (onSelectLocation) {
        onSelectLocation(res.location);
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleToggleFav = (e, locId) => {
    e.stopPropagation();
    toggleFavorite(locId);
  };

  const handleRemove = (e, locId, city) => {
    e.stopPropagation();
    if (locations.length <= 1) {
      alert('You must keep at least one meteorological location.');
      return;
    }
    removeLocation(locId);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Atmospheric Stations & Coordinates"
        description="Select an active meteorological observation hub, detect your position, or manage saved stations."
        size="lg"
      >
        <div className="space-y-4">
          {/* Quick GPS Location Detection Action Bar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60 border border-blue-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-500/30 flex items-center justify-center shrink-0">
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    Detect Current Location
                  </span>
                  <Badge variant="primary" size="sm">
                    GPS Auto-Sync
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instantly acquire coordinates and query localized radar & weather models.
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
              {isDetecting ? 'Acquiring GPS...' : 'Use Current Position'}
            </Button>
          </div>

          {/* Feedback banners */}
          {detectionError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="flex-1">{detectionError}</span>
              <button
                onClick={() => setDetectionError(null)}
                className="text-xs text-red-400 hover:text-red-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {gpsSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{gpsSuccessNotice}</span>
            </div>
          )}

          {/* Search and Tabs Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="location-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter saved stations by city, country, or timezone..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            {/* Filter Tabs (All vs Favorites) */}
            <div className="flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                id="tab-all-locations"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  filterTab === 'all'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>All Stations</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {locations.length}
                </span>
              </button>

              <button
                type="button"
                id="tab-favorite-locations"
                onClick={() => setFilterTab('favorites')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  filterTab === 'favorites'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Favorites</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {favorites.length}
                </span>
              </button>
            </div>
          </div>

          {/* Locations List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {displayedLocations.map((loc) => {
              const effectiveId = loc.id;
              const isSelected = effectiveId === (activeLocation?.id || currentLocationId);
              const latNum = loc.latitude !== undefined ? loc.latitude : loc.lat;
              const lonNum = loc.longitude !== undefined ? loc.longitude : loc.lon;

              return (
                <div
                  key={effectiveId}
                  id={`loc-option-${effectiveId}`}
                  onClick={() => handleSelect(loc)}
                  className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/40 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Station Pin Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                          : 'bg-slate-800/60 text-slate-400 group-hover:text-blue-400'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    {/* Location Metadata: City, Country, Lat, Lon, Timezone */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white truncate">
                          {loc.city || loc.name}
                        </span>
                        {loc.region && (
                          <span className="text-xs text-slate-400 truncate">
                            • {loc.region}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 truncate">
                          {loc.country}
                        </span>

                        {isSelected && (
                          <Badge variant="primary" size="sm">
                            Active Station
                          </Badge>
                        )}
                        {loc.isDefault && (
                          <Badge variant="outline" size="sm">
                            Default
                          </Badge>
                        )}
                      </div>

                      {/* Explicit coordinates & timezone display */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono flex-wrap">
                        <span>
                          {typeof latNum === 'number' ? latNum.toFixed(2) : latNum}°
                          {latNum >= 0 ? 'N' : 'S'},{' '}
                          {typeof lonNum === 'number' ? Math.abs(lonNum).toFixed(2) : lonNum}°
                          {lonNum >= 0 ? 'E' : 'W'}
                        </span>
                        <span>•</span>
                        <span className="text-cyan-400/80 truncate">
                          {loc.timezone || 'UTC'}
                        </span>
                        {loc.localTime && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">{loc.localTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Right: Star Favorite + Select / Checkmark + Remove */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {/* Favorite Star Button */}
                    <button
                      type="button"
                      id={`btn-fav-${effectiveId}`}
                      onClick={(e) => handleToggleFav(e, effectiveId)}
                      title={loc.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                      className={`p-1.5 rounded-lg border transition ${
                        loc.isFavorite
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-amber-300'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          loc.isFavorite ? 'fill-amber-400' : ''
                        }`}
                      />
                    </button>

                    {/* Remove button (enabled for non-default or if more than 1 location exists) */}
                    {locations.length > 1 && (
                      <button
                        type="button"
                        id={`btn-remove-${effectiveId}`}
                        onClick={(e) => handleRemove(e, effectiveId, loc.city || loc.name)}
                        title="Remove location"
                        className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-slate-500 hover:text-red-400 hover:border-red-500/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Active status indicator or Select action */}
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_10px_#38bdf8]">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition font-medium hidden sm:inline">
                        Switch
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {displayedLocations.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <Compass className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-300">
                  {filterTab === 'favorites'
                    ? 'No favorite locations saved yet.'
                    : 'No matching atmospheric stations found.'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {filterTab === 'favorites'
                    ? 'Click the star icon on any station to save it to your favorites.'
                    : 'Click "Add Location" below to register new meteorological coordinates.'}
                </p>
              </div>
            )}
          </div>

          {/* Add New Location CTA */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {displayedLocations.length} of {locations.length} tracked locations
            </span>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Location
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLocationAdded={(loc, selected) => {
          if (selected && onSelectLocation) {
            onSelectLocation(loc);
            onClose();
          }
        }}
      />
    </>
  );
}
