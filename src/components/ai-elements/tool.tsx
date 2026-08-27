import type { HTMLAttributes, ReactNode } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export interface ToolProps extends HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Tool({ children, className = '', ...props }: ToolProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs overflow-hidden shadow-2xs my-2 transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ToolHeaderProps extends HTMLAttributes<HTMLButtonElement> {
  toolName: string;
  state?: 'pending' | 'success' | 'error';
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ToolHeader({
  toolName,
  state = 'success',
  isOpen,
  onToggle,
  className = '',
  ...props
}: ToolHeaderProps) {
  const getIcon = () => {
    switch (state) {
      case 'pending':
        return <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const formatToolName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-3 py-2 bg-[var(--color-surface-subtle)]/70 hover:bg-[var(--color-surface-subtle)] text-left font-medium text-[var(--color-ink)] transition-colors cursor-pointer ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Wrench className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
        <span className="font-semibold text-xs text-[var(--color-ink)]">
          {formatToolName(toolName)}
        </span>
        {getIcon()}
      </div>
      <div className="text-[var(--color-ink-muted)]">
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  );
}

export interface ToolContentProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  children: ReactNode;
}

export function ToolContent({
  isOpen = true,
  children,
  className = '',
  ...props
}: ToolContentProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`p-3 space-y-2.5 bg-[var(--color-surface-card)] border-t border-[var(--color-border)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ToolInputProps extends HTMLAttributes<HTMLDivElement> {
  input: unknown;
}

export function ToolInput({ input, className = '', ...props }: ToolInputProps) {
  return (
    <div className={`space-y-1 ${className}`} {...props}>
      <span className="text-[10px] font-semibold tracking-wider text-[var(--color-ink-muted)] uppercase">
        Parameters
      </span>
      <pre className="p-2 rounded-md bg-[var(--color-surface-subtle)] text-[11px] text-[var(--color-ink)] overflow-x-auto font-mono">
        {JSON.stringify(input, null, 2)}
      </pre>
    </div>
  );
}

export interface ToolOutputProps extends HTMLAttributes<HTMLDivElement> {
  output: unknown;
  children?: ReactNode;
}

export function ToolOutput({ output, children, className = '', ...props }: ToolOutputProps) {
  return (
    <div className={`space-y-1 ${className}`} {...props}>
      <span className="text-[10px] font-semibold tracking-wider text-[var(--color-ink-muted)] uppercase">
        Result
      </span>
      {children || (
        <pre className="p-2 rounded-md bg-[var(--color-surface-subtle)] text-[11px] text-[var(--color-ink)] overflow-x-auto font-mono">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </div>
  );
}
