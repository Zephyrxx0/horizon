import { Bot, Sparkles } from 'lucide-react';

export interface FloatingAssistantButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function FloatingAssistantButton({ onClick }: FloatingAssistantButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-[var(--color-indigo-primary)] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group focus-visible:outline-2 focus-visible:outline-[var(--color-saffron-bright)]"
      aria-label="Open Asha AI Visa Assistant"
      title="Chat with Asha — AI Visa Guide"
      data-testid="floating-assistant-btn"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-saffron-bright)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-saffron-bright)]" />
        </span>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold leading-tight flex items-center gap-1">
          Ask Asha <Sparkles className="w-3 h-3 text-[var(--color-saffron-bright)]" />
        </span>
        <span className="text-[10px] text-white/80 leading-none">AI Visa Guide</span>
      </div>
    </button>
  );
}
