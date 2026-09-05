import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import weatherRoutes from './weather.routes.js';
import locationRoutes from './location.routes.js';
import airQualityRoutes from './airQualityRoutes.js';
import preferencesRoutes from './preferences.routes.js';
import chatHistoryRoutes from './chatHistory.routes.js';
import assistantRoutes from './assistantRoutes.js';

const apiRouter = Router();

// Unauthenticated / Public API Sub-routers
apiRouter.use('/', healthRoutes);
apiRouter.use('/weather', weatherRoutes);
apiRouter.use('/air-quality', airQualityRoutes);
apiRouter.use('/airquality', airQualityRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/assistant', assistantRoutes);

// Protected API Sub-routers (Require valid Authorization: Bearer <token>)
apiRouter.use('/locations', locationRoutes);
apiRouter.use('/preferences', preferencesRoutes);
apiRouter.use('/chat-history', chatHistoryRoutes);
apiRouter.use('/chathistory', chatHistoryRoutes);

// Root API welcome endpoint
apiRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'Atmosphere AI Backend API',
      version: '1.0.0',
      status: 'online',
      publicEndpoints: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/weather/current',
        'GET /api/weather/hourly',
        'GET /api/weather/daily',
        'GET /api/weather/air-quality',
        'GET /api/air-quality',
        'GET /api/health',
      ],
      protectedEndpoints: [
        'GET /api/auth/me',
        'GET /api/locations',
        'POST /api/locations',
        'DELETE /api/locations/:id',
        'GET /api/preferences',
        'PUT /api/preferences',
        'GET /api/chat-history',
        'POST /api/chat-history',
        'DELETE /api/chat-history',
      ],
    },
    error: null,
  });
});

export default apiRouter;
