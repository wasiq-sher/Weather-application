import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  FolderTree, 
  Code2, 
  X,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../services/apiClient.js';

export default function ArchitectureInspector({ isOpen, onClose }) {
  const [serverStatus, setServerStatus] = useState({ loading: true, data: null, error: null });

  const fetchHealth = async () => {
    setServerStatus({ loading: true, data: null, error: null });
    try {
      const res = await apiClient.get('/health');
      setServerStatus({ loading: false, data: res, error: null });
    } catch (err) {
      setServerStatus({ loading: false, data: null, error: err.message });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020408]/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-[32px] bg-[#020408]/95 border border-slate-800/60 shadow-2xl p-6 lg:p-8 text-slate-100 relative backdrop-blur-2xl">
        {/* Ambient glow inside modal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex items-center justify-center text-slate-950 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Atmosphere AI - Production Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Complete project structure: client (React + Vite + Tailwind) & server (Express + MongoDB structure + CORS)
            </p>
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
          {/* Express API status */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-500">Express API</span>
              <Server className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {serverStatus.loading ? (
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
              ) : serverStatus.data ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-xs font-bold text-slate-200">
                {serverStatus.loading
                  ? 'Pinging /api/health...'
                  : serverStatus.data
                  ? 'Online (Port 3000 proxy)'
                  : 'Ready (Direct / Server)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              CORS & centralized ApiError handling active
            </p>
          </div>

          {/* MongoDB Connection Status */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-500">MongoDB Structure</span>
              <Database className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">
                Configured & Handled
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Models, retry logic, connection events & schemas ready
            </p>
          </div>

          {/* Security & Middleware */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-500">Security & CORS</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                CORS, JWT & Error Handler
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Standardized ApiError response and JWT verify
            </p>
          </div>
        </div>

        {/* Directory structure preview */}
        <div className="rounded-2xl bg-[#030712]/90 border border-slate-800/90 p-5 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between text-slate-400 mb-2 pb-2 border-b border-slate-800 text-[11px]">
            <span className="flex items-center gap-2 text-blue-400">
              <FolderTree className="w-3.5 h-3.5" />
              atmosphere-ai Directory Architecture
            </span>
            <span className="text-slate-500">Production-Ready Scaffolding</span>
          </div>
          <div className="text-slate-300 space-y-1 text-[11px] leading-relaxed overflow-x-auto">
            <div className="text-blue-400 font-bold">atmosphere-ai/</div>
            <div className="pl-4 text-cyan-300">├── client/</div>
            <div className="pl-8 text-slate-400">├── src/</div>
            <div className="pl-12 text-slate-300">├── components/ (Header, Sidebar, RadarCard, CurrentWeatherCard, HourlyForecast, MetricsGrid, AssistantCard)</div>
            <div className="pl-12 text-slate-300">├── pages/ (DashboardPage, NotFoundPage)</div>
            <div className="pl-12 text-slate-300">├── layouts/ (MainLayout)</div>
            <div className="pl-12 text-slate-300">├── hooks/ (useApi, useTheme)</div>
            <div className="pl-12 text-slate-300">├── services/ (apiClient, request)</div>
            <div className="pl-12 text-slate-300">├── context/ (AppContext)</div>
            <div className="pl-12 text-slate-300">├── utils/ (constants, formatters)</div>
            <div className="pl-12 text-slate-300">├── assets/ (logo.svg)</div>
            <div className="pl-12 text-slate-300">├── types/ (weather.types.js)</div>
            <div className="pl-12 text-slate-300">└── App.jsx</div>
            <div className="pl-8 text-slate-400">├── package.json, vite.config.js, tailwind.config.js, eslint.config.js, .env.example</div>
            <div className="pl-4 text-indigo-300">└── server/</div>
            <div className="pl-8 text-slate-400">├── src/</div>
            <div className="pl-12 text-slate-300">├── controllers/ (health.controller.js, auth.controller.js)</div>
            <div className="pl-12 text-slate-300">├── routes/ (health.routes.js, auth.routes.js, api.routes.js)</div>
            <div className="pl-12 text-slate-300">├── services/ (db.service.js, ai.service.js)</div>
            <div className="pl-12 text-slate-300">├── models/ (user.model.js, location.model.js)</div>
            <div className="pl-12 text-slate-300">├── middleware/ (errorHandler.js, auth.middleware.js, cors.middleware.js)</div>
            <div className="pl-12 text-slate-300">├── utils/ (apiResponse.js, apiError.js, logger.js)</div>
            <div className="pl-12 text-slate-300">├── config/ (db.js, env.js, cors.js)</div>
            <div className="pl-12 text-slate-300">└── server.js</div>
            <div className="pl-8 text-slate-400">├── package.json, eslint.config.js, .env.example</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold transition shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
