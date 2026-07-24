import { mmkvStorage } from './mmkvStorage';

// Key for storage
const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

// Default / fallback API key if not set in MMKV.
// Developers can paste their API key here for quick local testing.
export const HARDCODED_API_KEY = process.env.GEMINI_API_KEY || '';

export type AIPromptContext =
  | 'appreciation'
  | 'certainty'
  | 'promise'
  | 'memory'
  | 'frustration_reframe'
  | 'general';

/**
 * Gets the current Gemini API key from MMKV storage or the hardcoded fallback.
 */
export const getGeminiApiKey = (): string => {
  try {
    const storedKey = mmkvStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) as string | null;
    return storedKey || HARDCODED_API_KEY || '';
  } catch (error) {
    console.error('[GoogleAI] Error reading API key from MMKV:', error);
    return HARDCODED_API_KEY || '';
  }
};

/**
 * Saves the Gemini API key to MMKV storage.
 */
export const setGeminiApiKey = (key: string): void => {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      mmkvStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, trimmed);
    } else {
      mmkvStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    }
  } catch (error) {
    console.error('[GoogleAI] Error writing API key to MMKV:', error);
  }
};

/**
 * Checks if a Gemini API key is configured.
 */
export const hasGeminiApiKey = (): boolean => {
  return getGeminiApiKey().length > 0;
};

/**
 * Validates an API key by making a minimal test call to Gemini.
 */
export const validateApiKey = async (key: string): Promise<boolean> => {
  if (!key.trim()) return false;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with "OK".' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    return response.ok;
  } catch (e) {
    console.error('[GoogleAI] API key validation failed:', e);
    return false;
  }
};

const CONTEXT_DESCRIPTIONS: Record<AIPromptContext, string> = {
  appreciation: 'expressing heartfelt appreciation for a kind, small, or lovely thing the partner did recently.',
  certainty: 'expressing a deep certainty, security, or foundational strength in the relationship.',
  promise: 'making a constructive, positive commitment or promise to improve the relationship.',
  memory: 'sharing a warm, nostalgic, or affectionate memory with the partner.',
  frustration_reframe: 'expressing a raw frustration or irritation. It needs to be reframed into a constructive, vulnerability-first communication using "I" statements, expressing the underlying need or vulnerability instead of blaming the partner.',
  general: 'reflecting on relationship experiences, feelings, and goals.',
};

interface EnhanceTextOptions {
  text: string;
  context: AIPromptContext;
  maxLength: number;
  question?: string;
}

/**
 * Sends a request to Google Gemini API to enhance/rewrite a user's journal entry.
 */
export const enhanceTextWithAI = async (options: EnhanceTextOptions): Promise<string> => {
  const { text, context, maxLength, question } = options;
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('API key is missing. Please configure your Gemini API Key first.');
  }

  if (!text.trim()) {
    throw new Error('Please enter some text before clicking Enhance AI.');
  }

  const contextDesc = CONTEXT_DESCRIPTIONS[context] || CONTEXT_DESCRIPTIONS.general;

  // Build a highly tailored prompt designed to get a high-quality single-string response
  const prompt = `You are a warm relationship counselor helping a user improve the phrasing of their journal entry.
${question ? `The user is responding to the following prompt/question on their screen:
"${question}"\n` : ''}
The user is writing an entry for: ${contextDesc}

Here is the user's raw input:
"${text}"

Your task:
Rewrite the user's input to be a more emotionally resonant, warm, and constructive response${question ? ' to the question asked' : ''}, while preserving their core details, authentic voice, and specific situation.
Avoid inventing new details or facts. Do not write generic poetry. Keep it grounded, sincere, and natural.

CRITICAL RULES:
1. Do NOT exceed ${maxLength} characters in total (including spaces and punctuation).
2. Output ONLY the rewritten text itself. Do not wrap it in quotes, and do not add any conversational filler, explanations, or labels (like "Reframing:").

Rewrite:`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: Math.max(100, Math.ceil(maxLength * 0.7)),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `HTTP ${response.status}`;
      throw new Error(`Gemini API error: ${errorMsg}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Gemini returned an empty response.');
    }

    let cleanedText = generatedText.trim();
    // Strip surrounding quotes if the model ignored instructions and added them
    if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
      cleanedText = cleanedText.slice(1, -1).trim();
    }
    if (cleanedText.startsWith("'") && cleanedText.endsWith("'")) {
      cleanedText = cleanedText.slice(1, -1).trim();
    }

    // Double check character limit safety
    if (cleanedText.length > maxLength) {
      cleanedText = cleanedText.slice(0, maxLength);
    }

    return cleanedText;
  } catch (error: any) {
    console.error('[GoogleAI] Error in enhanceTextWithAI:', error);
    throw new Error(error?.message || 'Failed to connect to Google AI. Please check your internet connection.');
  }
};
