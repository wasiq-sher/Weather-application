import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
  Zap,
  Radio,
  SlidersHorizontal,
  Menu,
  User,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import LocationSearch from './LocationSearch.jsx';

export default function Header({ onOpenLocationSelector }) {
  const navigate = useNavigate();
  const { 
    unit, 
    setUnit,
    toggleUnit, 
    isRadarLive, 
    setIsRadarLive,
    activeLocation,
    setActiveLocation,
    toggleMobileSidebar,
    user,
    isAuthenticated,
    logout
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const tabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/radar', label: 'Doppler Radar' },
    { path: '/forecast', label: '7-Day Forecast' },
    { path: '/air-health', label: 'Air & Health' },
  ];

  return (
    <header className="h-20 border-b border-slate-800/50 bg-[#020408]/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Location selector and Mobile hamburger */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 z-10">
        {/* Mobile menu trigger */}
        <button
          id="btn-mobile-sidebar-toggle"
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition"
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button 
          id="location-selector-btn"
          onClick={onOpenLocationSelector}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-900/70 border border-slate-700/60 hover:border-blue-500/50 transition text-left backdrop-blur-md group shrink-0"
          title="Switch observation station"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[85px] sm:max-w-[130px]">
                {activeLocation?.name || activeLocation?.city || 'San Francisco'}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline truncate max-w-[80px]">
                • {activeLocation?.region || 'CA'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition shrink-0" />
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline font-mono truncate">
              {activeLocation?.localTime || '12:45 PM PST'} • Online
            </span>
          </div>
        </button>
      </div>

      {/* Center: Global Search & Navigation tabs */}
      <div className="flex items-center justify-center gap-2 xl:gap-4 flex-1 min-w-0 mx-1 sm:mx-2 overflow-hidden">
        {/* Real-time Global Location Search */}
        <div className="w-full max-w-[150px] sm:max-w-[210px] md:max-w-[260px] shrink min-w-[110px]">
          <LocationSearch
            selectedLocationId={activeLocation?.id}
            onSelect={(location) => {
              setActiveLocation(location);
            }}
            placeholder="Search station, city, coords..."
            inputClassName="w-full pl-9 pr-7 py-1.5 sm:py-2 text-xs rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-xl shadow-inner truncate"
          />
        </div>

        {/* Navigation tabs (visible on xl wide displays) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/40 border border-slate-800/60 rounded-full p-1 backdrop-blur-md shrink-0">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-medium rounded-full transition ${
                  isActive
                    ? 'text-white bg-blue-600/30 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right controls & Authentication User Menu */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Live Radar Toggle */}
        <button
          id="toggle-live-radar"
          onClick={() => setIsRadarLive(!isRadarLive)}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition backdrop-blur-md ${
            isRadarLive
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
              : 'bg-slate-900/60 text-slate-400 border-slate-800/60'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isRadarLive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isRadarLive ? 'RADAR LIVE' : 'RADAR PAUSED'}</span>
        </button>

        {/* Temperature unit toggle */}
        <div className="flex items-center bg-slate-900/60 border border-slate-700/50 rounded-full p-0.5 backdrop-blur-md">
          <button
            id="unit-btn-f"
            type="button"
            onClick={() => setUnit('F')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition cursor-pointer ${
              unit === 'F' ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
          <button
            id="unit-btn-c"
            type="button"
            onClick={() => setUnit('C')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition cursor-pointer ${
              unit === 'C' ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
        </div>

        {/* Authentication Menu */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 text-white text-xs transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-xs shadow-inner">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate font-medium text-slate-200">
                  {user?.name || 'Explorer'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl py-2 z-50 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <p className="font-semibold text-white truncate">{user?.name || 'Explorer'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 transition"
                  >
                    <User className="w-4 h-4" />
                    <span>Preferences & Account</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-200 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-semibold shadow-md transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Ask Assistant Action Button */}
        <button
          id="btn-ask-assistant"
          onClick={() => navigate('/assistant')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
}
