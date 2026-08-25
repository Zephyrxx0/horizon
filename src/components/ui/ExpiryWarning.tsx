import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Checkbox } from './Checkbox';

export interface ExpiryWarningProps {
  expiryDate: string;
  confirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  className?: string;
}

export const ExpiryWarning: React.FC<ExpiryWarningProps> = ({
  expiryDate,
  confirmed,
  onConfirmChange,
  className = '',
}) => {
  let formattedDate = expiryDate;
  try {
    if (expiryDate) {
      formattedDate = new Date(expiryDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    formattedDate = expiryDate;
  }

  return (
    <div
      role="region"
      aria-label="Passport Validity Warning"
      className={`p-4 rounded-[var(--radius-card)] border-2 border-[var(--color-saffron-deep)] bg-[var(--color-saffron-bright)]/10 text-[var(--color-ink)] space-y-3 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle
          className="w-5 h-5 text-[var(--color-saffron-deep)] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Passport Validity Alert</h3>
          <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
            Your passport expires on{' '}
            <strong className="text-[var(--color-ink)]">{formattedDate}</strong>. Most destination
            countries require at least <strong>6 months of remaining validity</strong> from your
            planned date of entry. You may want to renew your passport before traveling.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--color-saffron-deep)]/20">
        <Checkbox
          checked={confirmed}
          onChange={(e) => onConfirmChange(e.target.checked)}
          label="I understand the 6-month validity requirement and wish to continue anyway with this passport."
        />
      </div>
    </div>
  );
};
