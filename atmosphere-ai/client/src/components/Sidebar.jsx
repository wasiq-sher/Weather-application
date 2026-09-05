import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Radio, 
  Wind, 
  CalendarDays, 
  Sun, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

/**
 * Sidebar component for Atmosphere AI
 * Features:
 * - Atmosphere AI logo/name
 * - Add Location button
 * - Navigation links: Today, Rain Radar, Air & Health, 7-Day Forecast, Sun & Moon, Weather Assistant
 * - Radar status widget
 * - Settings link
 * - Active route highlighting
 * - React Router navigation
 * - Responsive behavior & Mobile drawer with backdrop
 * - Collapse/Expand capability with smooth animation
 * - Lucide icons with custom styling
 * - Sleek floating tooltips in collapsed mode
 */
export default function Sidebar({ onOpenSettings, onOpenLocationSelector }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Connect to context if available
  const appContext = useApp();
  const isCollapsed = appContext?.isSidebarCollapsed || false;
  const toggleCollapse = appContext?.toggleSidebarCollapse || (() => {});
  const isMobileOpen = appContext?.isMobileSidebarOpen || false;
  const closeMobile = appContext?.closeMobileSidebar || (() => {});
  const activeLocation = appContext?.activeLocation;
  const isRadarLive = appContext?.isRadarLive ?? true;

  // Ordered navigation items as required
  const navItems = [
    { 
      path: '/dashboard', 
      aliases: ['/', '/dashboard'],
      label: 'Today', 
      icon: Calendar 
    },
    { 
      path: '/radar', 
      aliases: ['/radar'],
      label: 'Rain Radar', 
      icon: Radio 
    },
    { 
      path: '/air-health', 
      aliases: ['/air-health'],
      label: 'Air & Health', 
      icon: Wind 
    },
    { 
      path: '/forecast', 
      aliases: ['/forecast'],
      label: '7-Day Forecast', 
      icon: CalendarDays 
    },
    { 
      path: '/sun-moon', 
      aliases: ['/sun-moon'],
      label: 'Sun & Moon', 
      icon: Sun 
    },
    { 
      path: '/assistant', 
      aliases: ['/assistant'],
      label: 'Weather Assistant', 
      icon: Bot, 
      badge: 'AI' 
    },
  ];

  const handleLinkClick = (path) => {
    closeMobile();
    navigate(path);
  };

  const handleAddLocationClick = () => {
    closeMobile();
    if (onOpenLocationSelector) {
      onOpenLocationSelector();
    }
  };

  const handleSettingsClick = () => {
    closeMobile();
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  /**
   * Reusable sidebar content renderer for both desktop and mobile drawer
   */
  const renderSidebarContent = (mobile = false) => {
    const collapsed = !mobile && isCollapsed;

    return (
      <div className="flex flex-col justify-between h-full select-none overflow-hidden">
        {/* Top Header & Brand Area */}
        <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar ${collapsed ? 'p-2.5 space-y-2.5' : 'p-4 space-y-4'}`}>
          {/* Logo & Expand/Collapse Row */}
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={() => handleLinkClick('/dashboard')}
              className={`flex items-center gap-3 cursor-pointer group rounded-xl p-1 transition ${
                collapsed ? 'justify-center w-full' : ''
              }`}
              title="Atmosphere AI Dashboard"
            >
              {/* Futuristic orb logo with glowing pulse */}
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.5)] flex items-center justify-center group-hover:scale-105 transition duration-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                </div>
                <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-sm pointer-events-none animate-pulse" />
              </div>

              {/* Brand Title (hidden when collapsed) */}
              {!collapsed && (
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-wider text-white">
                      ATMOSPHERE
                    </span>
                    <span className="text-xs font-black tracking-widest text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      AI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase truncate">
                    Atmospheric Intelligence
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            {mobile && (
              <button
                id="btn-close-mobile-sidebar"
                onClick={closeMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Desktop Collapse / Expand Toggle Button */}
            {!mobile && !collapsed && (
              <button
                id="btn-collapse-sidebar"
                onClick={toggleCollapse}
                className="p-1.5 rounded-xl text-slate-500 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Expand Button when collapsed */}
          {!mobile && collapsed && (
            <div className="flex justify-center pt-1">
              <button
                id="btn-expand-sidebar"
                onClick={toggleCollapse}
                className="relative group p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-slate-800/80 transition"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-medium whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                  Expand sidebar
                </div>
              </button>
            </div>
          )}

          {/* Add Location CTA */}
          <div className="pt-1">
            <button
              id="btn-add-location"
              onClick={handleAddLocationClick}
              className={`w-full group relative flex items-center justify-center transition duration-200 ${
                collapsed 
                  ? 'h-10 w-10 mx-auto rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 hover:text-cyan-300' 
                  : 'py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 hover:from-blue-600/30 hover:to-cyan-500/20 border border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-white text-xs font-semibold gap-2 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
              }`}
              title="Add Location"
            >
              <Plus className={`shrink-0 transition-transform group-hover:scale-110 text-cyan-400 ${
                collapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'
              }`} />
              {!collapsed && <span>Add Location</span>}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 flex items-center gap-1.5">
                  <span>Add Location</span>
                </div>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-2" />

          {/* Primary Navigation items */}
          <nav className="space-y-1 pt-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.aliases.includes(location.pathname);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => closeMobile()}
                  id={`sidebar-link-${item.path.replace('/', '')}`}
                  className={`group relative w-full flex items-center rounded-xl transition duration-150 ${
                    collapsed 
                      ? 'justify-center h-10 w-10 mx-auto' 
                      : 'justify-between px-3.5 py-2.5 text-xs font-medium'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/25 via-cyan-500/15 to-transparent text-white border border-blue-500/40 shadow-[0_0_18px_rgba(56,189,248,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                    <Icon className={`shrink-0 transition-colors ${
                      collapsed ? 'w-4 h-4' : 'w-4 h-4'
                    } ${
                      isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {/* Badges / Active Indicators in expanded mode */}
                  {!collapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                          {item.badge}
                        </span>
                      )}
                      {isActive && !item.badge && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                      )}
                    </div>
                  )}

                  {/* Tooltip in collapsed mode */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 text-white text-xs font-medium whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 flex items-center gap-2 transform translate-x-1 group-hover:translate-x-0">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyan-500 text-black">
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-700/80 rotate-45" />
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Radar Status & Settings */}
        <div className={`shrink-0 ${collapsed ? 'p-2.5 space-y-2' : 'p-4 space-y-2.5'} border-t border-slate-800/60 bg-[#020408]/60 backdrop-blur-md`}>
          {/* Radar Status Widget */}
          <div 
            onClick={() => handleLinkClick('/radar')}
            className={`group relative rounded-xl border transition cursor-pointer ${
              collapsed 
                ? 'p-2 flex justify-center bg-slate-900/40 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80' 
                : 'p-3 bg-gradient-to-br from-slate-900/80 to-slate-950/90 border-slate-800/80 hover:border-cyan-500/30 backdrop-blur-sm'
            }`}
            title="Radar status: Active telemetry stream"
          >
            {collapsed ? (
              <div className="relative flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isRadarLive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400'}`} />
                {/* Collapsed Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 text-white text-xs font-medium whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 flex items-center gap-2 transform translate-x-1 group-hover:translate-x-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Radar Status: {isRadarLive ? 'LIVE' : 'STANDBY'}</span>
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-700/80 rotate-45" />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {isRadarLive && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isRadarLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Radar Status
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {isRadarLive ? 'LIVE' : 'PAUSED'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                  <span className="truncate max-w-[130px] font-medium text-slate-200">
                    {activeLocation?.name || 'San Francisco'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    2.4 GHz
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Settings Link */}
          <NavLink
            to="/settings"
            onClick={handleSettingsClick}
            id="sidebar-link-settings"
            className={({ isActive }) =>
              `group relative w-full flex items-center rounded-xl transition duration-150 ${
                collapsed 
                  ? 'justify-center h-10 w-10 mx-auto' 
                  : 'px-3.5 py-2.5 text-xs font-medium gap-3'
              } ${
                isActive || location.pathname === '/settings'
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`
            }
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:rotate-45" />
            {!collapsed && <span>Settings</span>}

            {/* Tooltip for collapsed mode */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 text-white text-xs font-medium whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 flex items-center gap-2 transform translate-x-1 group-hover:translate-x-0">
                <span>Settings</span>
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-700/80 rotate-45" />
              </div>
            )}
          </NavLink>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside 
        id="atmosphere-desktop-sidebar"
        className={`hidden lg:flex flex-col border-r border-slate-800/60 bg-[#020408]/95 backdrop-blur-2xl shrink-0 h-full relative z-20 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div 
          id="atmosphere-mobile-sidebar-overlay"
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside 
            id="atmosphere-mobile-sidebar"
            className="relative z-10 w-72 max-w-[85vw] h-full bg-[#020408]/98 border-r border-slate-800/80 shadow-2xl flex flex-col transition-transform duration-300 ease-out"
          >
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
