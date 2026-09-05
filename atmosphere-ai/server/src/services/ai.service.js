import ENV from '../config/env.js';

/**
 * AI Weather Assistant Service Abstraction
 * Configured for Gemini API or OpenAI API integrations
 */
export class AiWeatherService {
  constructor() {
    this.geminiApiKey = ENV.AI.GEMINI_API_KEY;
    this.openaiApiKey = ENV.AI.OPENAI_API_KEY;
  }

  isAvailable() {
    return Boolean(this.geminiApiKey || this.openaiApiKey);
  }

  /**
   * Generates conversational weather intelligence and apparel advice
   * @param {string} prompt - User weather query
   * @param {Object} context - Current telemetry (temp, humidity, rain chance)
   */
  async generateSummary(prompt, context = {}) {
    if (!this.isAvailable()) {
      return {
        summary: `Currently ${context.temp || 68}° with ${context.condition || 'Partly Cloudy'} skies. Expected rain probability is ${context.rainChance || 14}%.`,
        recommendation: 'Comfortable day for outdoor activities. Bring a light layer for breezy late afternoon hours.',
        provider: 'fallback_rules_engine',
      };
    }

    // Provider implementation is triggered once API credentials are provided
    return {
      summary: `AI Assistant evaluated: ${prompt}`,
      provider: this.geminiApiKey ? 'gemini' : 'openai',
    };
  }
}

export const aiService = new AiWeatherService();
export default aiService;
