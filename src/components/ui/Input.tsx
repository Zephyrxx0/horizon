import React, { forwardRef } from 'react';
import { useFieldContext } from './Field';
import { FOCUS_RING_CLASS } from './focus';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id: customId,
    invalid: propInvalid,
    className = '',
    'aria-describedby': propDescribedBy,
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
    <input
      ref={ref}
      id={id}
      aria-invalid={isInvalid ? 'true' : undefined}
      aria-describedby={ariaDescribedBy}
      className={`h-14 w-full px-4 text-base text-[var(--color-ink)] bg-white rounded-[var(--radius-input)] border ${
        isInvalid ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
      } transition-colors duration-150 ${FOCUS_RING_CLASS} ${className}`}
      {...props}
    />
  );
});
