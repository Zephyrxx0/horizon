import type { HTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

export interface SuggestionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Suggestions({ children, className = '', ...props }: SuggestionsProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SuggestionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  suggestion: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function Suggestion({
  suggestion,
  icon = <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[var(--color-indigo-primary)]" />,
  onClick,
  className = '',
  ...props
}: SuggestionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-surface-card)] text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-indigo-primary)] hover:bg-[var(--color-surface-subtle)] active:scale-98 transition-all shrink-0 cursor-pointer shadow-2xs ${className}`}
      {...props}
    >
      {icon}
      <span>{suggestion}</span>
    </button>
  );
}
