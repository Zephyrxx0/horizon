import { forwardRef } from 'react';
import { Checkbox } from '../../components/ui/Checkbox';
import { AlertCircle } from 'lucide-react';

export interface DeclarationCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export const DeclarationCheckbox = forwardRef<HTMLInputElement, DeclarationCheckboxProps>(
  function DeclarationCheckbox({ checked, onChange, error, disabled }, ref) {
    return (
      <div className="space-y-2">
        <div
          className={`p-4 rounded-[var(--radius-card)] border transition-colors ${
            error
              ? 'border-[var(--color-error)] bg-[#FEF2F2]'
              : checked
                ? 'border-[var(--color-indigo-primary)] bg-[#EEF0FB]'
                : 'border-[var(--color-border)] bg-white'
          }`}
        >
          <Checkbox
            ref={ref}
            id="declaration-confirmed"
            name="declarationConfirmed"
            checked={checked}
            invalid={Boolean(error)}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            label={
              <span className="text-sm sm:text-base font-medium text-[var(--color-ink)]">
                I declare that all information provided is true, accurate, and documents uploaded
                are authentic.
              </span>
            }
          />
        </div>

        {error && (
          <div
            id="declaration-error"
            role="alert"
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-error)]"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  },
);
