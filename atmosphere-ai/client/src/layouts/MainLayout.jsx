import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import LocationSelector from '../components/LocationSelector.jsx';
import { useApp } from '../context/AppContext.jsx';

/**
 * MainLayout - Centralized Application Shell
 * Encapsulates Sidebar, Header (Top Navigation), and Responsive Main Content Area.
 */
export default function MainLayout({ children }) {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const { activeLocation, setActiveLocation } = useApp();
  const mainContentRef = useRef(null);
  const location = useLocation();

  // Ensure view resets scroll position to top whenever navigating between pages
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#020408] text-slate-200 overflow-hidden font-sans relative">
      {/* Immersive UI Ambient Atmospheric Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Fixed Sidebar */}
      <div className="relative z-10 h-full">
        <Sidebar 
          onOpenLocationSelector={() => setIsLocationSelectorOpen(true)}
        />
      </div>

      {/* Main Content Viewport */}
      <div 
        ref={mainContentRef}
        className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-10"
      >
        {/* Top Navigation Bar */}
        <Header 
          onOpenLocationSelector={() => setIsLocationSelectorOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children || <Outlet />}
        </main>
      </div>

      {/* Reusable Location Selector Modal */}
      <LocationSelector
        isOpen={isLocationSelectorOpen}
        onClose={() => setIsLocationSelectorOpen(false)}
        currentLocationId={activeLocation?.id || 'san-francisco'}
        onSelectLocation={(loc) => setActiveLocation(loc)}
      />
    </div>
  );
}
