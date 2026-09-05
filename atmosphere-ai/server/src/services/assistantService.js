import OpenAI from 'openai';

// Initialize OpenAI client configured for OpenRouter
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Optional site URL
    'X-Title': 'Atmosphere AI',               // Optional app name
  },
});

// Priority list: Primary Gemma 4 model with fallback backup models
const MODELS = [
  'qwen/qwen-2.5-coder-32b-instruct',
];

/**
 * Generates an AI response using google/gemma-4-31b-it:free
 * @param {string} prompt - User message
 * @param {object} context - Current weather telemetry data
 */
export async function askAssistant(prompt, context = {}) {
  let lastError;

  for (const model of MODELS) {
    try {
      const response = await openrouter.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are Atmosphere AI, an expert meteorologist and weather assistant. Telemetry context: ${JSON.stringify(context)}`,
          },
          {
            role: 'user',
            content: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        extra_body: {
          reasoning: { enabled: true }, // Enables reasoning for models supporting thinking tokens
        },
      });

      const reply = response.choices[0]?.message?.content;
      if (reply) {
        return reply;
      }
    } catch (error) {
      console.warn(
        `[OpenRouter Notice] Model ${model} returned an error (${error.status || error.message}). Attempting next model...`
      );
      lastError = error;
    }
  }

  console.error('[OpenRouter Error]: All model attempts failed.', lastError?.message);
  throw lastError || new Error('Failed to generate response from OpenRouter.');
}

// Named and default exports for project compatibility
export const generateAssistantResponse = askAssistant;

export const assistantService = {
  askAssistant,
  generateAssistantResponse,
};

export default assistantService;