import { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, invalid = false, checked, disabled, className = '', onChange, ...props },
  ref,
) {
  return (
    <label
      className={`relative inline-flex items-center gap-3 min-h-[var(--spacing-touch)] cursor-pointer select-none ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      } ${className}`}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid ? 'true' : undefined}
        onChange={onChange}
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10 peer"
        {...props}
      />
      <div className="relative flex items-center justify-center w-6 h-6 shrink-0 pointer-events-none">
        <div
          className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-indigo-primary)] peer-focus-visible:ring-offset-2 ${
            checked
              ? 'bg-[var(--color-indigo-primary)] border-[var(--color-indigo-primary)] text-[var(--color-surface-bg)]'
              : invalid
                ? 'border-[var(--color-error)] bg-transparent'
                : 'border-[var(--color-border)] bg-transparent'
          }`}
        >
          {checked && (
            <Check
              className="w-4 h-4 text-[var(--color-surface-bg)] stroke-[3]"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      <span className="text-base font-normal text-[var(--color-ink)] leading-normal pointer-events-none">
        {label}
      </span>
    </label>
  );
});
