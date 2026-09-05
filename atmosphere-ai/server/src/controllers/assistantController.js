import assistantService from '../services/assistantService.js';
import ChatHistory from '../models/chatHistory.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Controller handler for AI assistant queries
 */
export const askQuestion = async (req, res, next) => {
  try {
    // Extract prompt from any common property name
    const prompt = req.body.prompt || req.body.question || req.body.message || '';
    const context = req.body.context || req.body.telemetry || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid question or prompt is required.',
      });
    }

    // Call the OpenRouter AI service
    const rawAiResponse = await assistantService.askAssistant(prompt, context);

    // Format AI response as string
    const answerText = typeof rawAiResponse === 'string'
      ? rawAiResponse
      : (rawAiResponse?.content || rawAiResponse?.answer || JSON.stringify(rawAiResponse));

    // Save history if user is authenticated
    try {
      const userId = req.user?._id || req.user?.id;
      if (userId) {
        await ChatHistory.create({
          userId: userId,
          question: prompt,
          answer: answerText,
        });
      }
    } catch (historyErr) {
      console.warn('[AssistantController] Chat history save warning:', historyErr.message);
    }

    // Return response in format frontend expects
    return ApiResponse.success(
      res,
      {
        question: prompt,
        answer: answerText,
        response: answerText,
        message: answerText,
      },
      'AI response generated successfully.'
    );
  } catch (error) {
    next(error);
  }
};

// Export askAssistant alias for route compatibility
export const askAssistant = askQuestion;

export default {
  askQuestion,
  askAssistant,
};