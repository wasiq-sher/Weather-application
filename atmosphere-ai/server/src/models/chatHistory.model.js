import mongoose from 'mongoose';

/**
 * Chat History Schema Definition for Atmosphere AI Assistant
 * Fields:
 * - userId
 * - question
 * - answer
 * - timestamp
 */
const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    question: {
      type: String,
      required: [true, 'Question prompt is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'AI answer response is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user's chat history in chronological order
chatHistorySchema.index({ userId: 1, timestamp: -1 });

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
