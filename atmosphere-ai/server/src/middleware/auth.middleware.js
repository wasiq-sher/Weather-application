import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import ENV from '../config/env.js';

const JWT_SECRET = process.env.JWT_SECRET || ENV.JWT?.SECRET || 'atmosphere_ai_super_secret_jwt_key_2026';

/**
 * JWT Authentication Middleware
 * Validates 'Authorization: Bearer <token>' header and attaches user context to req.
 * Rejects unauthenticated requests with 401 Unauthorized.
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return next(
      ApiError.unauthorized('Authentication required. Please log in to access this resource.', null, 'UNAUTHORIZED')
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(
      ApiError.unauthorized('Invalid or expired authentication token. Please log in again.', null, 'INVALID_TOKEN')
    );
  }
}

/**
 * Optional JWT Authentication Middleware
 * Attaches user context to req if token is present, but allows request to proceed if absent.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
}

export default authenticateToken;

