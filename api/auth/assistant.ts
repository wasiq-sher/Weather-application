import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        message: 'OPENAI_API_KEY is missing in Vercel environment variables.',
      });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON request payload.' });
      }
    }

    const userMessage = body?.message || body?.prompt || 'Hello';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Atmosphere AI weather assistant.' },
        { role: 'user', content: userMessage },
      ],
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('AI Function Error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to generate AI response.',
    });
  }
}