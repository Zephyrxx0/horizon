import { useRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowDown, Download, Sparkles } from 'lucide-react';

export interface ConversationProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Conversation({ children, className = '', ...props }: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (containerRef.current) {
      if (typeof containerRef.current.scrollTo === 'function') {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]);

  return (
    <div className={`relative flex flex-col h-full overflow-hidden ${className}`} {...props}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 focus:outline-none"
        aria-label="Conversation messages"
      >
        {children}
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-[var(--color-surface-card)] text-[var(--color-ink)] border border-[var(--color-border)] shadow-md hover:bg-[var(--color-surface-subtle)] transition-all animate-bounce cursor-pointer z-10"
          aria-label="Scroll to newest message"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export interface ConversationContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ConversationContent({
  children,
  className = '',
  ...props
}: ConversationContentProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface ConversationEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export function ConversationEmptyState({
  icon = <Sparkles className="w-8 h-8 text-[var(--color-saffron-bright)]" />,
  title,
  description,
  children,
  className = '',
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 my-auto rounded-2xl bg-[var(--color-surface-subtle)]/50 border border-dashed border-[var(--color-border)] ${className}`}
      {...props}
    >
      <div className="p-3 rounded-2xl bg-[var(--color-surface-card)] shadow-xs mb-3">{icon}</div>
      <h3 className="font-semibold text-sm sm:text-base text-[var(--color-ink)]">{title}</h3>
      <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}

export interface ConversationDownloadProps {
  messages: Array<{
    role: string;
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
  }>;
  filename?: string;
}

export function ConversationDownload({
  messages,
  filename = 'visa-chat-transcript.md',
}: ConversationDownloadProps) {
  const handleDownload = () => {
    const text = messages
      .map((m) => {
        const body =
          m.parts
            ?.map((p) => p.text)
            .filter(Boolean)
            .join('\n') ||
          m.content ||
          '';
        return `### ${m.role === 'user' ? 'Applicant' : 'VisaReThink Assistant'}:\n${body}\n`;
      })
      .join('\n---\n\n');

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] rounded-md transition-colors cursor-pointer"
      title="Download chat transcript"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Save Chat</span>
    </button>
  );
}
