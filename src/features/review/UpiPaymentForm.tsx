import { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Field, FieldLabel, FieldHint, FieldError } from '../../components/ui/Field';
import { QrCode, Smartphone, Sparkles } from 'lucide-react';
import { isValidUpiVpa } from './formatters';

export interface UpiPaymentFormProps {
  vpa: string;
  mode: 'vpa' | 'qr';
  totalAmount: number;
  onVpaChange: (vpa: string) => void;
  onModeChange: (mode: 'vpa' | 'qr') => void;
  error?: string;
  disabled?: boolean;
}

const COMMON_VPA_BANKS = ['@okhdfcbank', '@okaxis', '@paytm', '@ybl', '@oksbi', '@icici'];

export function UpiPaymentForm({
  vpa,
  mode,
  totalAmount,
  onVpaChange,
  onModeChange,
  error,
  disabled = false,
}: UpiPaymentFormProps) {
  const [isTouched, setIsTouched] = useState(false);

  const handleSuffixClick = (suffix: string) => {
    if (disabled) return;
    const prefix = vpa.includes('@') ? vpa.split('@')[0] : vpa;
    const newVpa = (prefix || 'user') + suffix;
    onVpaChange(newVpa);
    setIsTouched(true);
  };

  const vpaError =
    isTouched && vpa && !isValidUpiVpa(vpa)
      ? 'Please enter a valid UPI address (e.g. mobile@upi or name@okhdfcbank).'
      : error;

  return (
    <div className="p-4 sm:p-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white space-y-4 shadow-xs">
      {/* Mode switcher */}
      <div className="flex rounded-lg border border-[var(--color-border)] p-1 bg-[var(--color-surface-bg)]">
        <button
          type="button"
          onClick={() => onModeChange('vpa')}
          className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px] ${
            mode === 'vpa'
              ? 'bg-white text-[var(--color-indigo-primary)] shadow-xs'
              : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
          }`}
          aria-pressed={mode === 'vpa'}
        >
          <Smartphone className="w-4 h-4" aria-hidden="true" />
          Enter UPI ID / VPA
        </button>

        <button
          type="button"
          onClick={() => onModeChange('qr')}
          className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px] ${
            mode === 'qr'
              ? 'bg-white text-[var(--color-indigo-primary)] shadow-xs'
              : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
          }`}
          aria-pressed={mode === 'qr'}
        >
          <QrCode className="w-4 h-4" aria-hidden="true" />
          Scan QR Code
        </button>
      </div>

      {mode === 'vpa' ? (
        <div className="space-y-3">
          <Field id="upiVpa" invalid={Boolean(vpaError)}>
            <FieldLabel>Virtual Payment Address (UPI ID)</FieldLabel>
            <FieldHint>
              Enter your VPA linked to Google Pay, PhonePe, Paytm, or any BHIM app
            </FieldHint>
            <Input
              id="upiVpa"
              type="text"
              name="upiVpa"
              value={vpa}
              disabled={disabled}
              placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
              onChange={(e) => {
                onVpaChange(e.target.value);
              }}
              onBlur={() => setIsTouched(true)}
              autoComplete="off"
            />
            {vpaError && <FieldError>{vpaError}</FieldError>}
          </Field>

          {/* Quick Bank Suffix Chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-ink-muted)]">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_VPA_BANKS.map((suffix) => (
                <button
                  key={suffix}
                  type="button"
                  onClick={() => handleSuffixClick(suffix)}
                  disabled={disabled}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--color-surface-bg)] border border-[var(--color-border)] hover:border-[var(--color-indigo-primary)] text-[var(--color-ink)] transition-colors min-h-[32px]"
                >
                  {suffix}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 space-y-3">
          <div className="inline-block p-4 rounded-xl border-2 border-dashed border-[var(--color-indigo-primary)]/40 bg-[#F7F7FA]">
            {/* SVG Mock QR Code */}
            <svg
              className="w-40 h-40 mx-auto text-[var(--color-ink)]"
              viewBox="0 0 100 100"
              fill="currentColor"
              role="img"
              aria-label="UPI Payment QR Code"
            >
              {/* Corner markers */}
              <rect x="5" y="5" width="25" height="25" fill="black" />
              <rect x="8" y="8" width="19" height="19" fill="white" />
              <rect x="12" y="12" width="11" height="11" fill="black" />

              <rect x="70" y="5" width="25" height="25" fill="black" />
              <rect x="73" y="8" width="19" height="19" fill="white" />
              <rect x="77" y="12" width="11" height="11" fill="black" />

              <rect x="5" y="70" width="25" height="25" fill="black" />
              <rect x="8" y="73" width="19" height="19" fill="white" />
              <rect x="12" y="77" width="11" height="11" fill="black" />

              {/* Data pattern squares */}
              <rect x="35" y="10" width="8" height="8" />
              <rect x="50" y="15" width="10" height="8" />
              <rect x="35" y="25" width="12" height="10" />
              <rect x="10" y="38" width="15" height="12" />
              <rect x="30" y="42" width="18" height="18" />
              <rect x="55" y="35" width="15" height="12" />
              <rect x="75" y="40" width="15" height="15" />
              <rect x="38" y="65" width="12" height="15" />
              <rect x="55" y="60" width="18" height="12" />
              <rect x="80" y="68" width="12" height="15" />
              <rect x="58" y="80" width="15" height="12" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-[var(--color-ink)]">
              Scan with any UPI app to pay ₹{totalAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Open Google Pay, PhonePe, Paytm, or BHIM and point camera at the code
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[var(--color-success)]">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Simulated Instant Payment Confirmation
          </div>
        </div>
      )}
    </div>
  );
}
