import {
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { AttachedImage } from './attachments';

export interface PromptInputMessage {
  text: string;
  files?: AttachedImage[];
}

export interface PromptInputProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (message: PromptInputMessage, event?: FormEvent) => void;
  children: ReactNode;
}

export function PromptInput({ onSubmit, children, className = '', ...props }: PromptInputProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.querySelector('textarea');
    const text = textarea?.value.trim() || '';
    if (text) {
      onSubmit({ text }, e);
      if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-xs focus-within:border-[var(--color-saffron-bright)] focus-within:ring-2 focus-within:ring-[var(--color-saffron-bright)]/20 transition-all ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

export interface PromptInputHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PromptInputHeader({ children, className = '', ...props }: PromptInputHeaderProps) {
  return (
    <div
      className={`px-3 pt-2.5 pb-1 border-b border-[var(--color-border)]/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PromptInputTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onKeyDownSubmit?: () => void;
}

export function PromptInputTextarea({
  className = '',
  onChange,
  onKeyDown,
  placeholder = 'Ask anything about your visa application...',
  ...props
}: PromptInputTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = textareaRef.current?.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
    onKeyDown?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      placeholder={placeholder}
      onInput={autoResize}
      onKeyDown={handleKeyDown}
      onChange={onChange}
      className={`w-full resize-none bg-transparent px-3.5 pt-3 pb-2 text-xs sm:text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none min-h-[44px] max-h-[140px] leading-relaxed ${className}`}
      {...props}
    />
  );
}

export interface PromptInputFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PromptInputFooter({ children, className = '', ...props }: PromptInputFooterProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 pb-2 pt-1 gap-2 border-t border-transparent ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PromptInputToolsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PromptInputTools({ children, className = '', ...props }: PromptInputToolsProps) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PromptInputSubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  status?: 'ready' | 'submitted' | 'streaming' | 'error';
}

export function PromptInputSubmit({
  status = 'ready',
  disabled,
  className = '',
  ...props
}: PromptInputSubmitProps) {
  const isStreaming = status === 'streaming';
  const isPending = status === 'submitted' || isStreaming;

  return (
    <button
      type="submit"
      disabled={disabled || isPending}
      className={`p-2 rounded-xl bg-[var(--color-saffron-bright)] text-white shadow-xs hover:bg-[var(--color-saffron-deep)] active:scale-95 disabled:opacity-40 disabled:bg-black/10 dark:disabled:bg-white/10 disabled:text-[var(--color-ink-muted)] disabled:pointer-events-none transition-all cursor-pointer ${className}`}
      aria-label={isStreaming ? 'Streaming response' : 'Send message'}
      {...props}
    >
      {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
    </button>
  );
}
