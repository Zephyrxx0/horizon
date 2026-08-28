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
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 pl-3.5 pr-4.5 py-2.5 rounded-full bg-[#1a2a44] dark:bg-[#22334e] text-white border border-[#2a3c5a] dark:border-[#384b69] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group focus-visible:outline-2 focus-visible:outline-[var(--color-saffron-bright)]"
      aria-label="Open Asha AI Visa Assistant"
      title="Chat with Asha — AI Visa Guide"
      data-testid="floating-assistant-btn"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold leading-tight flex items-center gap-1 text-white">
          Ask Asha <Sparkles className="w-3 h-3 text-[#f59e0b]" />
        </span>
        <span className="text-[10px] text-slate-200 leading-none">AI Visa Guide</span>
      </div>
    </button>
  );
}
