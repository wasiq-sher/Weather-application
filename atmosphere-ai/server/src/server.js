import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import ENV from './config/env.js';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { globalApiRateLimiter } from './middleware/rateLimiter.js';
import apiRouter from './routes/index.js';
import db from './config/db.js';

/**
 * Atmosphere AI - Express Application Setup
 */
const app = express();

// 1. Security HTTP Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Managed by Vite dev server in development
}));

// 2. CORS Handling
app.use(corsMiddleware);

// 3. Request Logging
if (ENV.IS_DEVELOPMENT) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Body Parsers with strict size limits
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// 5. Sanitize request data against MongoDB Operator Injection ($ and . keys)
app.use(mongoSanitize());

// 6. Global API Rate Limiting
app.use('/api', globalApiRateLimiter);

// 7. Mount API Routes
app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

// 6. Root fallback
app.get('/', (req, res) => {
  res.json({
    app: 'Atmosphere AI Server',
    status: 'online',
    health: '/api/health',
  });
});

// 7. 404 Route Catch-All
app.use(notFoundHandler);

// 8. Global Centralized Error Handling
app.use(errorHandler);

/**
 * Server Lifecycle Manager
 */
const startServer = async () => {
  try {
    // Attempt MongoDB connection
    await db.connect();

    const server = app.listen(ENV.PORT, () => {
      console.log(`
      ╔═══════════════════════════════════════════════╗
      ║             ATMOSPHERE AI SERVER              ║
      ║═══════════════════════════════════════════════║
      ║  Port:          ${ENV.PORT.toString().padEnd(30)}║
      ║  Environment:   ${ENV.NODE_ENV.padEnd(30)}║
      ║  Health Check:  http://localhost:${ENV.PORT}/api/health ║
      ╚═══════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down Atmosphere AI server...`);
      server.close(async () => {
        await db.disconnect();
        console.log('HTTP server closed.');
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('Fatal error during Atmosphere AI server bootstrap:', error);
    process.exit(1);
  }
};

// Start the standalone HTTP server if executed directly
if (process.env.STANDALONE_SERVER === 'true' || (process.argv[1] && process.argv[1].endsWith('server.js'))) {
  startServer();
}

export { app, startServer };
export default app;
