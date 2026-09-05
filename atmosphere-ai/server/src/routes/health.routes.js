import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router = Router();

router.get('/health', healthController.getHealth);
router.get('/system', healthController.getSystemInfo);
router.get('/test-error', healthController.testError);

export default router;
