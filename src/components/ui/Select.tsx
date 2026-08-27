import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFieldContext } from './Field';
import { FOCUS_RING_CLASS } from './focus';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id: customId,
    invalid: propInvalid,
    className = '',
    containerClassName = '',
    'aria-describedby': propDescribedBy,
    children,
    ...props
  },
  ref,
) {
  const ctx = useFieldContext();
  const id = customId || ctx?.id;
  const isInvalid = propInvalid !== undefined ? propInvalid : (ctx?.invalid ?? false);

  const describedByParts: string[] = [];
  if (propDescribedBy) describedByParts.push(propDescribedBy);
  if (ctx) {
    if (ctx.hasHint) describedByParts.push(ctx.hintId);
    if (ctx.hasError || isInvalid) describedByParts.push(ctx.errorId);
  }
  const ariaDescribedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  return (
    <div className={`relative ${containerClassName || 'w-full'}`}>
      <select
        ref={ref}
        id={id}
        aria-invalid={isInvalid ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        className={`h-14 w-full pl-4 pr-10 text-base text-[var(--color-ink)] bg-[var(--color-surface-card)] rounded-[var(--radius-input)] border appearance-none ${
          isInvalid ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        } transition-colors duration-150 ${FOCUS_RING_CLASS} ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-[var(--color-ink-muted)]"
        aria-hidden="true"
      />
    </div>
  );
});
