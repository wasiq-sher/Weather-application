import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, Globe, Compass, Plus, Check } from 'lucide-react';
import locationService from '../services/locationService.js';
import Badge from './Badge.jsx';

/**
 * LocationSearch Component
 * 
 * High-precision meteorological location search interface.
 * Features:
 * - Debounced search queries
 * - Instant suggestions with City, Country, Lat/Lon coordinates, and Timezone
 * - Direct Selection and Quick Add triggers
 * - Keyboard navigation (Arrows, Enter, Escape)
 */
export default function LocationSearch({
  onSelect,
  onAdd,
  selectedLocationId,
  placeholder = 'Search city, country, or coordinates (e.g. Paris, 37.77, -122.41)...',
  autoFocus = false,
  showDropdown = true,
  className = '',
  inputClassName = '',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const matches = await locationService.search(query);
        setResults(matches);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (location) => {
    if (onSelect) onSelect(location);
    setIsOpen(false);
    setQuery(location.city);
  };

  const handleQuickAdd = (e, location) => {
    e.stopPropagation();
    if (onAdd) onAdd(location);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          id="location-search-field"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={inputClassName || "w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-slate-900/80 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-xl shadow-inner"}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Suggestions Dropdown */}
      {showDropdown && isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#020617]/95 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-1.5 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Coordinates & Cities ({results.length})</span>
                <span>Press ↵ to select</span>
              </div>

              {results.map((loc, idx) => {
                const isSelected = loc.id === selectedLocationId;
                const isHighlighted = idx === activeIndex;

                return (
                  <div
                    key={loc.id || `${loc.city}-${idx}`}
                    id={`search-result-${loc.id}`}
                    onClick={() => handleSelect(loc)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full p-3 rounded-xl text-left cursor-pointer transition flex items-center justify-between gap-3 group ${
                      isHighlighted
                        ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800/60 text-slate-400 group-hover:text-blue-400'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-white truncate">
                            {loc.city}
                          </span>
                          {loc.region && (
                            <span className="text-xs text-slate-400 truncate">
                              • {loc.region}
                            </span>
                          )}
                          <span className="text-xs text-slate-500 truncate">
                            {loc.country}
                          </span>
                        </div>

                        {/* Coordinates & Timezone details */}
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          <span>
                            {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                          </span>
                          <span>•</span>
                          <span className="truncate">{loc.timezone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onAdd && (
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, loc)}
                          title="Save to My Locations"
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700/60 hover:border-blue-500/40 transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Compass className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs font-medium text-slate-300">
                No matching atmospheric coordinates located.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Try searching for another city or enter coordinates directly like "37.77, -122.41".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
