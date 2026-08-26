import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { FOCUS_RING_CLASS } from './focus';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    children,
    type = 'button',
    onClick,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary:
      'bg-[var(--color-ink)] text-[var(--color-surface-bg)] hover:opacity-90 shadow-xs active:scale-[0.98]',
    secondary:
      'bg-[var(--color-surface-subtle)] text-[var(--color-ink)] hover:bg-[var(--color-border)] active:scale-[0.98]',
    outline:
      'bg-transparent text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] active:scale-[0.98]',
    ghost:
      'bg-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-ink)]',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-xs active:scale-[0.98]',
  }[variant];

  const disabledStyles = isDisabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={isDisabled ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      onClick={isDisabled ? undefined : onClick}
      className={`min-h-[40px] px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center justify-center gap-2 transition-all duration-150 select-none ${FOCUS_RING_CLASS} ${
        isDisabled ? disabledStyles : `${variantStyles} ${disabledStyles}`
      } ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
});
