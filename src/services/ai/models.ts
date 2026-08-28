import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import type { AIProviderConfig, AIProviderName } from './types';

/**
 * Reads AI provider configuration from environment variables or defaults.
 */
export function getAIConfig(): AIProviderConfig {
  const envProvider = (import.meta.env.VITE_AI_PROVIDER as AIProviderName) || 'google';
  const defaultModel = envProvider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash';
  const modelName = import.meta.env.VITE_AI_MODEL || defaultModel;

  const rawKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_AI_GATEWAY_API_KEY;

  // Clean trailing spaces or quotes if pasted with wrappers
  const apiKey = rawKey
    ? String(rawKey)
        .trim()
        .replace(/^["']|["']$/g, '')
    : undefined;

  return {
    provider: envProvider,
    modelName,
    apiKey,
  };
}

/**
 * Factory to instantiate the selected LanguageModel provider.
 * Supports Google Gemini (default), OpenAI (production swap), and mock fallback.
 */
export function resolveLanguageModel(): {
  model: LanguageModel | null;
  provider: AIProviderName;
  modelName: string;
  isLive: boolean;
} {
  const config = getAIConfig();

  // If in test environment, no API key is set, or mock is requested, we use our deterministic in-app mock engine
  if (import.meta.env.MODE === 'test' || !config.apiKey || config.provider === 'mock') {
    if (import.meta.env.MODE !== 'test') {
      console.info(
        `%c[VisaAI] ⚠️ No API key found in environment (VITE_GEMINI_API_KEY / VITE_OPENAI_API_KEY). Running in offline simulated mode.`,
        'color: #f59e0b; font-weight: bold;',
      );
    }
    return {
      model: null,
      provider: 'mock',
      modelName: `${config.modelName} (Offline Simulation)`,
      isLive: false,
    };
  }

  const maskedKey = config.apiKey
    ? `${config.apiKey.slice(0, 6)}...${config.apiKey.slice(-4)}`
    : 'none';

  try {
    if (config.provider === 'google') {
      console.info(
        `%c[VisaAI] 🤖 Live Google Gemini initialized: model="${config.modelName}", key=${maskedKey}`,
        'color: #10b981; font-weight: bold;',
      );
      const googleProvider = createGoogleGenerativeAI({
        apiKey: config.apiKey,
      });
      return {
        model: googleProvider(config.modelName),
        provider: 'google',
        modelName: config.modelName,
        isLive: true,
      };
    }

    if (config.provider === 'openai') {
      console.info(
        `%c[VisaAI] 🤖 Live OpenAI initialized: model="${config.modelName}", key=${maskedKey}`,
        'color: #10b981; font-weight: bold;',
      );
      const openaiProvider = createOpenAI({
        apiKey: config.apiKey,
      });
      return {
        model: openaiProvider(config.modelName),
        provider: 'openai',
        modelName: config.modelName,
        isLive: true,
      };
    }
  } catch (err) {
    console.error(
      '[VisaAI] ❌ Failed to initialize live AI provider, falling back to simulation:',
      err,
    );
  }

  return {
    model: null,
    provider: 'mock',
    modelName: `${config.modelName} (Fallback)`,
    isLive: false,
  };
}
