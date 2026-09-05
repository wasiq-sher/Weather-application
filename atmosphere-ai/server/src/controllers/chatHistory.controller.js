import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import ChatHistory from '../models/chatHistory.model.js';

/**
 * GET /api/chat-history
 * Retrieve chat history for authenticated user
 */
export const getChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  let history = [];

  if (userId) {
    try {
      history = await ChatHistory.find({ userId }).sort({ timestamp: -1 }).limit(50).lean();
    } catch (err) {
      console.warn('[ChatHistory] Fetch error:', err.message);
    }
  }

  return ApiResponse.success(res, { count: history.length, history });
});

/**
 * POST /api/chat-history
 * Save a question & answer prompt pair for authenticated user
 */
export const createChatEntry = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { question, answer } = req.body || {};

  if (!question || !answer) {
    throw ApiError.badRequest('Question and answer are required parameters.', null, 'MISSING_CHAT_DATA');
  }

  let entry = {
    userId,
    question,
    answer,
    timestamp: new Date(),
  };

  if (userId) {
    try {
      entry = await ChatHistory.create({ userId, question, answer });
    } catch (err) {
      console.warn('[ChatHistory] Save warning:', err.message);
    }
  }

  return ApiResponse.created(res, entry);
});

/**
 * DELETE /api/chat-history
 * Clear chat history for authenticated user
 */
export const clearChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (userId) {
    try {
      await ChatHistory.deleteMany({ userId });
    } catch (err) {
      console.warn('[ChatHistory] Delete error:', err.message);
    }
  }

  return ApiResponse.success(res, { message: 'Chat history cleared successfully.' });
});

export default {
  getChatHistory,
  createChatEntry,
  clearChatHistory,
};
