import { useState, type HTMLAttributes } from 'react';
import { Brain, ChevronDown, ChevronRight } from 'lucide-react';

export interface ReasoningProps extends HTMLAttributes<HTMLDivElement> {
  reasoning: string;
  defaultOpen?: boolean;
}

export function Reasoning({
  reasoning,
  defaultOpen = false,
  className = '',
  ...props
}: ReasoningProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!reasoning) return null;

  return (
    <div
      className={`rounded-xl border border-[var(--color-indigo-primary)]/20 bg-[var(--color-indigo-primary)]/5 text-xs overflow-hidden my-2 ${className}`}
      {...props}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left font-medium text-[var(--color-indigo-primary)] hover:bg-[var(--color-indigo-primary)]/10 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-semibold text-xs">Reasoning & Consular Guidelines</span>
        </div>
        <div>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-[var(--color-indigo-primary)]/15 text-[var(--color-ink-muted)] leading-relaxed italic bg-[var(--color-surface-card)]">
          {reasoning}
        </div>
      )}
    </div>
  );
}

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs text-[var(--color-ink-muted)] py-2 ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-[var(--color-indigo-primary)] animate-ping" />
      <span className="font-medium animate-pulse">Asha is consulting consular regulations...</span>
    </div>
  );
}
