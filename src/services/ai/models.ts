import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import type { AIProviderConfig, AIProviderName } from './types';

/**
 * Reads AI provider configuration from environment variables or defaults.
 */
export function getAIConfig(): AIProviderConfig {
  const envProvider = (import.meta.env.VITE_AI_PROVIDER as AIProviderName) || 'google';
  const defaultModel = envProvider === 'openai' ? 'gpt-4o-mini' : 'gemini-2.5-flash';
  const modelName = import.meta.env.VITE_AI_MODEL || defaultModel;

  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    import.meta.env.VITE_AI_GATEWAY_API_KEY;

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

  // If no API key is set, we use our deterministic in-app mock engine
  if (!config.apiKey && config.provider !== 'mock') {
    return {
      model: null,
      provider: 'mock',
      modelName: `${config.modelName} (Offline Simulation)`,
      isLive: false,
    };
  }

  try {
    if (config.provider === 'google') {
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
    console.warn('Failed to initialize live AI provider, falling back to in-app simulation:', err);
  }

  return {
    model: null,
    provider: 'mock',
    modelName: `${config.modelName} (Fallback)`,
    isLive: false,
  };
}
