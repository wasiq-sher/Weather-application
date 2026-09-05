import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Configurations to Prevent API Abuse & Brute-Force Attacks
 */

// 1. Strict Limiter for Authentication Endpoints (Login / Register)
// Allows 15 authentication attempts per 15-minute window per IP
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});

// 2. Rate Limiter for AI Weather Assistant Endpoint
// Allows 30 AI queries per 15-minute window per IP to protect Gemini API quota
export const assistantRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      message: 'AI Assistant rate limit reached. Please wait a few minutes before asking another question.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

// 3. Rate Limiter for Location Search & Geocoding Endpoints
// Allows 100 search queries per 15-minute window per IP
export const locationSearchRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      message: 'Location search rate limit reached. Please slow down your requests.',
      code: 'SEARCH_RATE_LIMIT_EXCEEDED',
    },
  },
});

// 4. General Global API Rate Limiter
// Allows 300 requests per 15-minute window per IP for standard API usage
export const globalApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      message: 'Too many requests sent to Atmosphere AI API. Please try again later.',
      code: 'GLOBAL_RATE_LIMIT_EXCEEDED',
    },
  },
});

export default {
  authRateLimiter,
  assistantRateLimiter,
  locationSearchRateLimiter,
  globalApiRateLimiter,
};
