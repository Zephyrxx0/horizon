import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorSummaryItem {
  fieldId: string;
  label?: string;
  message: string;
}

export type ErrorItem = ErrorSummaryItem;

export interface ErrorSummaryProps {
  errors: ErrorSummaryItem[];
  title?: string;
  autoFocus?: boolean;
  className?: string;
}

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  title = 'There is a problem',
  autoFocus = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && errors.length > 0 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [autoFocus, errors.length]);

  if (!errors || errors.length === 0) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, fieldId: string) => {
    e.preventDefault();
    const element = document.getElementById(fieldId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="polite"
      aria-labelledby="error-summary-title"
      tabIndex={-1}
      className={`p-4 rounded-[var(--radius-card)] border-2 border-[var(--color-error)] bg-[var(--color-error)]/10 text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-error)]/40 ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <AlertCircle className="w-5 h-5 text-[var(--color-error)] shrink-0" aria-hidden="true" />
        <h2 id="error-summary-title" className="text-base font-semibold text-[var(--color-error)]">
          {title}
        </h2>
      </div>

      <p className="text-xs text-[var(--color-ink-muted)] mb-3">
        Please resolve the following issue{errors.length > 1 ? 's' : ''} to continue:
      </p>

      <ul className="space-y-2 text-sm pl-1 list-disc list-inside">
        {errors.map(({ fieldId, message, label }) => (
          <li key={fieldId} className="text-[var(--color-error)] font-medium">
            <a
              href={`#${fieldId}`}
              onClick={(e) => handleLinkClick(e, fieldId)}
              className="text-[var(--color-error)] underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] rounded"
            >
              {label ? `${label}: ` : ''}
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
