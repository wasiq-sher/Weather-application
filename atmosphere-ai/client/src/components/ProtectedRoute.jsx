import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import authService from '../services/authService.js';

/**
 * ProtectedRoute Component
 * Guards routes requiring user authentication. Redirects unauthenticated traffic to /login.
 */
export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
