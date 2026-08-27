import { useState, useCallback, useMemo } from 'react';
import { processChatMessage } from '../../services/ai/engine';
import type { UIMessage } from 'ai';
import type { AttachedImage } from '../../components/ai-elements';

export type ExtendedUIMessage = UIMessage & {
  attachments?: AttachedImage[];
};

export interface AssistantChatState {
  messages: ExtendedUIMessage[];
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  currentToolCalls: Array<{ toolName: string; input: unknown; output: unknown }>;
  sendMessage: (message: { text: string; files?: AttachedImage[] }) => Promise<void>;
  resetChat: () => void;
  contextSuggestions: string[];
}

const INITIAL_GREETING: ExtendedUIMessage = {
  id: 'msg-welcome-0',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: 'Namaste! 🙏 I am **Asha**, your VisaReThink assistant. How can I help with your visa application today? Ask me about visa requirements, document specifications, fee calculations, or tracking your application.',
    },
  ],
};

const STEP_SUGGESTIONS: Record<string, string[]> = {
  'visa-selection': [
    'What visa do I need for USA tourism?',
    'How long does UK visitor visa processing take?',
    'What are the fees for Schengen visa?',
    'What is the difference between single and multiple entry?',
  ],
  'personal-identity': [
    'My passport expires in 5 months, can I apply?',
    'Where is the passport place of issue located on the booklet?',
    'What is Non-ECR vs ECR status?',
  ],
  'personal-contact': [
    'Can I provide my relative’s address in India?',
    'What reference address is required in the destination country?',
  ],
  'personal-details': [
    'What should I write as my primary trip purpose?',
    'Do infants need a separate visa application?',
  ],
  documents: [
    'What are the exact photo specifications and background color?',
    'What file formats and sizes are supported?',
    'Do I need bank statements for tourist visa?',
  ],
  'review-payment': [
    'What payment methods (UPI/Cards) are accepted?',
    'Can I edit my application after payment?',
    'Is there any hidden service fee?',
  ],
  confirmation: [
    'How do I track my Application Reference Number (ARN)?',
    'What documents should I carry for the consular interview?',
  ],
};

export function useAssistantChat(currentStepId: string = 'visa-selection'): AssistantChatState {
  const [messages, setMessages] = useState<ExtendedUIMessage[]>([INITIAL_GREETING]);
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
  const [currentToolCalls, setCurrentToolCalls] = useState<
    Array<{ toolName: string; input: unknown; output: unknown }>
  >([]);

  const contextSuggestions = useMemo(() => {
    return STEP_SUGGESTIONS[currentStepId] || STEP_SUGGESTIONS['visa-selection'];
  }, [currentStepId]);

  const sendMessage = useCallback(
    async ({ text, files }: { text: string; files?: AttachedImage[] }) => {
      const trimmed = text.trim();
      if (!trimmed && (!files || files.length === 0)) return;

      const userMessage: ExtendedUIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        parts: [
          {
            type: 'text',
            text: trimmed || (files?.length ? `[Uploaded ${files.length} attachment(s)]` : ''),
          },
        ],
        attachments: files && files.length > 0 ? files : undefined,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setStatus('streaming');
      try {
        // Small async delay for natural conversation feel in production/dev
        if (import.meta.env.MODE !== 'test') {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        const response = await processChatMessage(updatedMessages, currentStepId, files);

        if (response.toolCalls && response.toolCalls.length > 0) {
          setCurrentToolCalls((prev) => [...prev, ...response.toolCalls!]);
        }

        const assistantMessage: ExtendedUIMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          parts: [{ type: 'text', text: response.content }],
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setStatus('ready');
      } catch (err) {
        console.error('Assistant error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-err-${Date.now()}`,
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text: '⚠️ I encountered an unexpected error processing your request. Please try asking again or check our FAQs.',
              },
            ],
          },
        ]);
        setStatus('error');
      }
    },
    [messages, currentStepId],
  );

  const resetChat = useCallback(() => {
    setMessages([INITIAL_GREETING]);
    setCurrentToolCalls([]);
    setStatus('ready');
  }, []);

  return {
    messages,
    status,
    currentToolCalls,
    sendMessage,
    resetChat,
    contextSuggestions,
  };
}
