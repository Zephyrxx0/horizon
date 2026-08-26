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
      'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs active:scale-[0.98]',
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]',
    outline:
      'bg-transparent text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100',
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
