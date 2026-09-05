import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Lazy loaded page components for optimal JavaScript bundle splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const RadarPage = lazy(() => import('./pages/RadarPage.jsx'));
const ForecastPage = lazy(() => import('./pages/ForecastPage.jsx'));
const AirHealthPage = lazy(() => import('./pages/AirHealthPage.jsx'));
const SunMoonPage = lazy(() => import('./pages/SunMoonPage.jsx'));
const AssistantPage = lazy(() => import('./pages/AssistantPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const Login = lazy(() => import('./components/Login.jsx'));
const Register = lazy(() => import('./components/Register.jsx'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute.jsx'));

// Initialize TanStack Query Client with sensible caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner size="lg" message="Loading Atmosphere module..." />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* Public Weather Endpoints & Views */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/radar" element={<RadarPage />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/air-health" element={<AirHealthPage />} />
                <Route path="/sun-moon" element={<SunMoonPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected User Routes */}
                <Route
                  path="/assistant"
                  element={
                    <ProtectedRoute>
                      <AssistantPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/settings" element={<SettingsPage />} />

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
