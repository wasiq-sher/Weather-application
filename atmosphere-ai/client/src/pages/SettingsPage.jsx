import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  SlidersHorizontal, 
  Check, 
  Zap, 
  ShieldCheck, 
  Bell, 
  Globe, 
  Radio, 
  Cpu,
  Sun,
  Moon,
  Wind,
  Thermometer,
  MapPin,
  Sparkles,
  Search,
  Database,
  Cloud,
  Loader2,
  CheckCircle2,
  UserCheck,
  UserX
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import ArchitectureInspector from '../components/ArchitectureInspector.jsx';
import locationService, { DEFAULT_PRESET_LOCATIONS } from '../services/locationService.js';

export default function SettingsPage() {
  const { 
    unit, 
    setUnit, 
    preferences, 
    updatePreferences, 
    activeLocation, 
    setActiveLocation, 
    isAuthenticated,
    user 
  } = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Local state initialized from AppContext preferences
  const [tempUnit, setTempUnit] = useState(preferences.temperatureUnit || unit || 'F');
  const [windUnit, setWindUnit] = useState(preferences.windUnit || 'mph');
  const [theme, setTheme] = useState(preferences.theme || 'dark');
  const [notifications, setNotifications] = useState(
    preferences.notificationsEnabled !== undefined ? preferences.notificationsEnabled : true
  );
  
  // Default Location
  const [defaultLoc, setDefaultLoc] = useState(() => {
    return preferences.defaultLocation || activeLocation;
  });

  // AI Assistant Preferences
  const [aiStyle, setAiStyle] = useState(
    preferences.aiAssistantPreferences?.responseStyle || 'concise'
  );
  const [aiFocus, setAiFocus] = useState(
    preferences.aiAssistantPreferences?.focusArea || 'general'
  );
  const [aiGrounded, setAiGrounded] = useState(
    preferences.aiAssistantPreferences?.enforceGroundedData !== false
  );

  // Location search state for default location picker
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync state if context preferences change
  useEffect(() => {
    if (preferences) {
      if (preferences.temperatureUnit) setTempUnit(preferences.temperatureUnit);
      if (preferences.windUnit) setWindUnit(preferences.windUnit);
      if (preferences.theme) setTheme(preferences.theme);
      if (preferences.notificationsEnabled !== undefined) setNotifications(preferences.notificationsEnabled);
      if (preferences.defaultLocation) setDefaultLoc(preferences.defaultLocation);
      if (preferences.aiAssistantPreferences) {
        if (preferences.aiAssistantPreferences.responseStyle) setAiStyle(preferences.aiAssistantPreferences.responseStyle);
        if (preferences.aiAssistantPreferences.focusArea) setAiFocus(preferences.aiAssistantPreferences.focusArea);
        if (preferences.aiAssistantPreferences.enforceGroundedData !== undefined) setAiGrounded(preferences.aiAssistantPreferences.enforceGroundedData);
      }
    }
  }, [preferences]);

  const handleSearchLocations = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await locationService.search(q);
      setSearchResults(results.slice(0, 5));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDefaultLocation = (loc) => {
    setDefaultLoc(loc);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);

    const newPrefs = {
      temperatureUnit: tempUnit,
      windUnit: windUnit,
      theme: theme,
      notificationsEnabled: notifications,
      defaultLocation: defaultLoc,
      aiAssistantPreferences: {
        responseStyle: aiStyle,
        focusArea: aiFocus,
        enforceGroundedData: aiGrounded,
      },
    };

    try {
      await updatePreferences(newPrefs);
      if (tempUnit !== unit) {
        setUnit(tempUnit);
      }
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (err) {
      console.error('[SettingsPage] Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <SectionHeader
        title="Atmosphere System Preferences"
        subtitle="Manage measurement units, theme, default station, and AI assistant behavior"
        icon={Settings}
        badge={
          saveToast ? (
            <Badge variant="success" dot>
              Preferences Saved & Synced
            </Badge>
          ) : isAuthenticated ? (
            <Badge variant="info">
              <Database className="w-3 h-3 text-cyan-400 mr-1" />
              MongoDB Synced ({user?.email || 'User'})
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Cloud className="w-3 h-3 text-amber-400 mr-1" />
              Guest Mode (Local Storage)
            </Badge>
          )
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Zap}
              onClick={() => setIsInspectorOpen(true)}
            >
              Inspect Stack
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={isSaving ? Loader2 : Check}
              onClick={handleSaveAll}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        }
      />

      {/* Persistence Notification Bar */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xl transition ${
        isAuthenticated
          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            isAuthenticated ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {isAuthenticated ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
          </div>
          <div>
            <strong className="block font-semibold">
              {isAuthenticated ? 'MongoDB User Account Connected' : 'Guest Temporary Session'}
            </strong>
            <p className="text-[11px] opacity-80">
              {isAuthenticated
                ? 'Your preferences are stored in MongoDB Cloud and automatically synchronized across all your devices.'
                : 'Preferences are saved locally in your browser. Log in anytime to synchronize these settings with your MongoDB account!'}
            </p>
          </div>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Updated successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Measurement Units, Theme & Notifications */}
        <div className="lg:col-span-6 space-y-6">
          {/* Temperature & Wind Units */}
          <WeatherCard
            title="Measurement Units"
            subtitle="Choose temperature and wind velocity formats"
            icon={SlidersHorizontal}
          >
            <div className="space-y-5">
              {/* Temperature Unit */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2.5">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <span>Temperature Scale</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTempUnit('F')}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      tempUnit === 'F'
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>Fahrenheit (°F)</span>
                    {tempUnit === 'F' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnit('C')}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      tempUnit === 'C'
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>Celsius (°C)</span>
                    {tempUnit === 'C' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2.5">
                  <Wind className="w-4 h-4 text-blue-400" />
                  <span>Wind Velocity Scale</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'mph', label: 'Miles per hour (mph)' },
                    { id: 'km/h', label: 'Kilometers per hour (km/h)' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWindUnit(w.id)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                        windUnit === w.id
                          ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{w.label}</span>
                      {windUnit === w.id && <Check className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </WeatherCard>

          {/* Visual Theme Selection */}
          <WeatherCard
            title="Appearance & Theme"
            subtitle="Switch between dark atmospheric canvas and high-contrast light mode"
            icon={Sun}
          >
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Interface Color Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-cyan-400 text-white ring-2 ring-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-950 text-cyan-400 border border-slate-800">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Dark Atmosphere</span>
                    <span className="text-[10px] text-slate-400">Deep midnight slate</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-xs font-semibold transition flex items-center gap-3 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-800 border-amber-400 text-white ring-2 ring-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Light Canvas</span>
                    <span className="text-[10px] text-slate-300">Clean high-contrast</span>
                  </div>
                </button>
              </div>
            </div>
          </WeatherCard>

          {/* Notifications Toggle */}
          <WeatherCard
            title="Severe Alerts & Notifications"
            subtitle="Toggle daily AI briefings and severe weather telemetry notifications"
            icon={Bell}
          >
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Enable Weather & AI Briefing Notifications
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Receive alerts for sudden rain, UV spikes, and daily morning AI weather updates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 cursor-pointer ${
                  notifications ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </WeatherCard>
        </div>

        {/* Right Column (6 cols): Default Location & AI Assistant Preferences */}
        <div className="lg:col-span-6 space-y-6">
          {/* Default Location Settings */}
          <WeatherCard
            title="Default Station Location"
            subtitle="Set your default meteorological observation station for app startup"
            icon={MapPin}
          >
            <div className="space-y-4">
              {/* Current Default Display */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                      Active Default Station
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {typeof defaultLoc === 'object' ? defaultLoc.name || defaultLoc.city : defaultLoc}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {typeof defaultLoc === 'object'
                        ? `${defaultLoc.region || defaultLoc.country || ''} (${defaultLoc.latitude || 37.77}°, ${defaultLoc.longitude || -122.41}°)`
                        : defaultLoc}
                    </p>
                  </div>
                </div>

                <Badge variant="cyan">Primary</Badge>
              </div>

              {/* Quick Action: Set Active Location as Default */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSelectDefaultLocation(activeLocation)}
                >
                  Set Current Active Station ({activeLocation.name}) as Default
                </Button>
              </div>

              {/* Location Search Bar */}
              <div className="relative">
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Change Default Location
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchLocations}
                    placeholder="Search city, region or country..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  {isSearching && (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-3" />
                  )}
                </div>

                {/* Dropdown search results */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-20 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                    {searchResults.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handleSelectDefaultLocation(loc)}
                        className="w-full px-4 py-2.5 text-left text-xs text-slate-200 hover:bg-slate-800/80 flex items-center justify-between transition border-b border-slate-800/60 last:border-0 cursor-pointer"
                      >
                        <span className="font-medium">{loc.name}, {loc.country}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular preset list */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Or select from popular stations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_PRESET_LOCATIONS.slice(0, 5).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectDefaultLocation(p)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                        (typeof defaultLoc === 'object' && defaultLoc.id === p.id) ||
                        (typeof defaultLoc === 'string' && defaultLoc.includes(p.name))
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </WeatherCard>

          {/* AI Assistant Preferences */}
          <WeatherCard
            title="AI Assistant Preferences"
            subtitle="Configure Atmosphere AI reasoning depth, output style, and focus areas"
            icon={Sparkles}
          >
            <div className="space-y-4">
              {/* Response Style */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  AI Response Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'concise', label: 'Concise (Direct Insights)', desc: 'Short bullet points' },
                    { id: 'detailed', label: 'Detailed (Comprehensive)', desc: 'In-depth analysis' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAiStyle(s.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        aiStyle === s.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold text-slate-100">{s.label}</span>
                      <span className="text-[10px] text-slate-400">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Area */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Primary AI Focus Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'general', label: 'General' },
                    { id: 'clothing', label: 'Outfit & Wear' },
                    { id: 'outdoor', label: 'Exercise' },
                    { id: 'commute', label: 'Commute' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAiFocus(f.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                        aiFocus === f.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Telemetry Grounding Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Strict Telemetry Grounding
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Mandate AI answers rely strictly on live sensor streams
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiGrounded(!aiGrounded)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                    aiGrounded ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      aiGrounded ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </WeatherCard>
        </div>
      </div>

      <ArchitectureInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
}
