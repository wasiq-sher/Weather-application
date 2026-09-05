import { ApiError } from '../utils/apiError.js';
import ENV from '../config/env.js';

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  const err = new ApiError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`);
  next(err);
}

/**
 * Centralized API Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Handle Mongoose CastError (bad ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation Error';
    details = Object.values(err.errors || {}).map(e => e.message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please log in again.';
  }

  // Format response matching standard structure { success: false, data: null, error: { message, code, details } }
  const errorObj = {
    message,
    code: err.code && typeof err.code === 'string' ? err.code : (err.status || 'ERROR'),
    ...(details && { details }),
    ...(ENV.IS_DEVELOPMENT && err.stack ? { stack: err.stack } : {}),
  };

  // Log non-operational (server crash) errors
  if (statusCode >= 500) {
    console.error('💥 Unhandled Server Exception:', err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: errorObj,
  });
}

export default errorHandler;
