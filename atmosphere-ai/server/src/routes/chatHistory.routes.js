import { Router } from 'express';
import {
  getChatHistory,
  createChatEntry,
  clearChatHistory,
} from '../controllers/chatHistory.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all chat history routes
router.use(authenticateToken);

// GET /api/chat-history
router.get('/', getChatHistory);

// POST /api/chat-history
router.post('/', createChatEntry);

// DELETE /api/chat-history
router.delete('/', clearChatHistory);

export default router;
