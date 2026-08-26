import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { FOCUS_RING_CLASS } from './focus';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
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
      'bg-[var(--color-indigo-primary)] text-white hover:bg-[var(--color-indigo-hover)] active:bg-[var(--color-indigo-hover)]',
    secondary:
      'bg-white text-[var(--color-indigo-primary)] border-2 border-[var(--color-indigo-primary)] hover:bg-[var(--color-selected-bg)]',
    outline:
      'bg-white text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-slate-50',
    destructive: 'bg-[var(--color-error)] text-white hover:opacity-90 active:opacity-90',
  }[variant];

  const disabledStyles = isDisabled
    ? 'bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] border-transparent cursor-not-allowed hover:bg-[var(--color-disabled-bg)]'
    : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={isDisabled ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      onClick={isDisabled ? undefined : onClick}
      className={`min-h-[var(--spacing-touch)] w-full sm:max-w-[360px] px-6 py-3 rounded-[var(--radius-input)] font-semibold text-base flex items-center justify-center gap-2 transition-colors duration-150 ${FOCUS_RING_CLASS} ${
        isDisabled ? disabledStyles : variantStyles
      } ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
});
