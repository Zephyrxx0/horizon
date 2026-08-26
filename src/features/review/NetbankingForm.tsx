import React from 'react';
import { Select } from '../../components/ui/Select';
import { Field, FieldLabel, FieldHint, FieldError } from '../../components/ui/Field';
import { Building2, CheckCircle2 } from 'lucide-react';

export interface NetbankingFormProps {
  selectedBank: string;
  onBankChange: (bankId: string) => void;
  disabled?: boolean;
  error?: string;
}

const POPULAR_BANKS = [
  { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KOTAK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
];

const ALL_OTHER_BANKS = [
  { id: 'bob', name: 'Bank of Baroda' },
  { id: 'canara', name: 'Canara Bank' },
  { id: 'union', name: 'Union Bank of India' },
  { id: 'indusind', name: 'IndusInd Bank' },
  { id: 'yes', name: 'Yes Bank' },
  { id: 'idfc', name: 'IDFC FIRST Bank' },
  { id: 'federal', name: 'Federal Bank' },
  { id: 'rbl', name: 'RBL Bank' },
  { id: 'iob', name: 'Indian Overseas Bank' },
  { id: 'uco', name: 'UCO Bank' },
];

export function NetbankingForm({
  selectedBank,
  onBankChange,
  disabled = false,
  error,
}: NetbankingFormProps) {
  const isOtherSelected =
    !POPULAR_BANKS.some((b) => b.id === selectedBank) && Boolean(selectedBank);

  return (
    <div className="p-4 sm:p-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2.5">
        <Building2 className="w-4 h-4 text-[var(--color-indigo-primary)]" aria-hidden="true" />
        <span className="text-sm font-bold text-[var(--color-ink)]">Select Your Bank</span>
      </div>

      {/* Popular Banks Grid */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
          Popular Banks
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {POPULAR_BANKS.map((bank) => {
            const isSelected = selectedBank === bank.id;
            return (
              <button
                key={bank.id}
                type="button"
                onClick={() => onBankChange(bank.id)}
                disabled={disabled}
                className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between min-h-[48px] ${
                  isSelected
                    ? 'border-[var(--color-indigo-primary)] bg-[var(--color-selected-bg)] text-[var(--color-indigo-primary)] font-bold'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-indigo-primary)]/50 text-[var(--color-ink)]'
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-xs sm:text-sm truncate mr-1">{bank.name}</span>
                {isSelected && (
                  <CheckCircle2
                    className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Other Banks Dropdown */}
      <Field id="netbankingOtherSelect" invalid={Boolean(error)}>
        <FieldLabel>Or Choose Other Bank</FieldLabel>
        <FieldHint>Over 50+ Indian commercial & cooperative banks supported</FieldHint>
        <Select
          id="netbankingOtherSelect"
          name="netbankingBank"
          value={isOtherSelected ? selectedBank : ''}
          disabled={disabled}
          onChange={(e) => onBankChange(e.target.value)}
        >
          <option value="">-- Select from other banks --</option>
          {ALL_OTHER_BANKS.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.name}
            </option>
          ))}
        </Select>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    </div>
  );
}
