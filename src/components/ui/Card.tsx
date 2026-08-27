import React from 'react';
import { FOCUS_RING_CLASS } from './focus';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  className = '',
  children,
  onClick,
  ...props
}: CardProps) {
  const isInteractive = variant === 'interactive' || !!onClick;

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      className={`bg-[var(--color-surface-card)] rounded-[var(--radius-card)] p-6 border border-[var(--color-border)] ${
        isInteractive
          ? `cursor-pointer min-h-[var(--spacing-touch)] hover:border-[var(--color-indigo-primary)] transition-colors duration-150 ${FOCUS_RING_CLASS}`
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
