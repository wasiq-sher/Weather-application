import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import dbService from '../services/db.service.js';
import ENV from '../config/env.js';

export const healthController = {
  /**
   * Health status check endpoint
   */
  getHealth: async (req, res, next) => {
    try {
      const dbHealth = await dbService.checkHealth();

      return ApiResponse.success(res, {
        service: 'Atmosphere AI Backend API',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: ENV.NODE_ENV,
        database: dbHealth,
      }, 'Atmosphere AI service is healthy and operational.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * System telemetry info
   */
  getSystemInfo: async (req, res, next) => {
    try {
      return ApiResponse.success(res, {
        version: '1.0.0',
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
      }, 'System telemetry information.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Controlled error verification endpoint (tests error handling middleware)
   */
  testError: async (req, res, next) => {
    try {
      const { type } = req.query;
      if (type === 'bad_request') {
        throw ApiError.badRequest('Sample validation bad request error', ['City name cannot be empty']);
      }
      if (type === 'unauthorized') {
        throw ApiError.unauthorized('JWT token required to access this resource');
      }
      if (type === 'not_found') {
        throw ApiError.notFound('Requested radar tile was not found');
      }
      // Default to unhandled 500 error
      throw new Error('Simulated internal server failure for testing global error middleware');
    } catch (error) {
      next(error);
    }
  },
};

export default healthController;
