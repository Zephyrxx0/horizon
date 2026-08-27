import type { HTMLAttributes, ReactNode } from 'react';
import { Bot, User } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  from: 'user' | 'assistant' | 'system';
  children: ReactNode;
}

export function Message({ from, children, className = '', ...props }: MessageProps) {
  const isUser = from === 'user';
  return (
    <div
      className={`group flex items-start gap-3 w-full py-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}
      data-role={from}
      {...props}
    >
      <div
        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${
          isUser
            ? 'bg-[var(--color-indigo-primary)] text-white border-[var(--color-indigo-primary)]'
            : 'bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] dark:text-amber-400 border-[var(--color-saffron-bright)]/30'
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {children}
      </div>
    </div>
  );
}

export interface MessageContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function MessageContent({ children, className = '', ...props }: MessageContentProps) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageResponseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function MessageResponse({ children, className = '', ...props }: MessageResponseProps) {
  if (typeof children === 'string') {
    return <MarkdownRenderer content={children} className={className} />;
  }

  return (
    <div className={`space-y-2 max-w-none break-words ${className}`} {...props}>
      {children}
    </div>
  );
}
