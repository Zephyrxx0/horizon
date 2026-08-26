import { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Field, FieldLabel, FieldHint, FieldError } from '../../components/ui/Field';
import { CreditCard, Lock } from 'lucide-react';
import {
  formatCardNumber,
  formatCardExpiry,
  formatCvv,
  getCardBrand,
  isValidCardNumber,
  isValidCardExpiry,
  isValidCvv,
} from './formatters';

export interface CardFormData {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

export interface CardPaymentFormProps {
  data: CardFormData;
  onChange: (data: CardFormData) => void;
  disabled?: boolean;
  errors?: Partial<Record<keyof CardFormData, string>>;
}

export function CardPaymentForm({
  data,
  onChange,
  disabled = false,
  errors = {},
}: CardPaymentFormProps) {
  const [touched, setTouched] = useState<Partial<Record<keyof CardFormData, boolean>>>({});

  const cardBrand = getCardBrand(data.cardNumber);

  const handleCardNumberChange = (raw: string) => {
    const formatted = formatCardNumber(raw);
    onChange({ ...data, cardNumber: formatted });
  };

  const handleExpiryChange = (raw: string) => {
    const formatted = formatCardExpiry(raw);
    onChange({ ...data, cardExpiry: formatted });
  };

  const handleCvvChange = (raw: string) => {
    const formatted = formatCvv(raw);
    onChange({ ...data, cardCvv: formatted });
  };

  const handleNameChange = (raw: string) => {
    onChange({ ...data, cardName: raw });
  };

  const numError =
    touched.cardNumber && data.cardNumber && !isValidCardNumber(data.cardNumber)
      ? 'Please enter a valid 16-digit card number.'
      : errors.cardNumber;

  const expError =
    touched.cardExpiry && data.cardExpiry && !isValidCardExpiry(data.cardExpiry)
      ? 'Please enter a valid future expiry date (MM/YY).'
      : errors.cardExpiry;

  const cvvError =
    touched.cardCvv && data.cardCvv && !isValidCvv(data.cardCvv)
      ? 'CVV must be 3 or 4 digits.'
      : errors.cardCvv;

  const nameError =
    touched.cardName && !data.cardName.trim() ? 'Cardholder name is required.' : errors.cardName;

  return (
    <div className="p-4 sm:p-5 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[var(--color-indigo-primary)]" aria-hidden="true" />
          <span className="text-sm font-bold text-[var(--color-ink)]">Card Details</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
          <Lock className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden="true" />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      {/* Card Number */}
      <Field id="cardNumber" invalid={Boolean(numError)}>
        <FieldLabel>Card Number</FieldLabel>
        <FieldHint>16-digit number on front of your card</FieldHint>
        <div className="relative">
          <Input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            name="cardNumber"
            value={data.cardNumber}
            disabled={disabled}
            placeholder="4111 2222 3333 4444"
            onChange={(e) => handleCardNumberChange(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, cardNumber: true }))}
            className="pr-20 font-mono text-sm tracking-wider"
            autoComplete="cc-number"
          />
          {cardBrand !== 'unknown' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-xs font-bold uppercase bg-[#EEF0FB] text-[var(--color-indigo-primary)] pointer-events-none">
              {cardBrand}
            </span>
          )}
        </div>
        {numError && <FieldError>{numError}</FieldError>}
      </Field>

      {/* Cardholder Name */}
      <Field id="cardName" invalid={Boolean(nameError)}>
        <FieldLabel>Cardholder Name</FieldLabel>
        <FieldHint>Name as printed on your card</FieldHint>
        <Input
          id="cardName"
          type="text"
          name="cardName"
          value={data.cardName}
          disabled={disabled}
          placeholder="e.g. RAHUL SHARMA"
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, cardName: true }))}
          autoComplete="cc-name"
        />
        {nameError && <FieldError>{nameError}</FieldError>}
      </Field>

      {/* Expiry and CVV Row */}
      <div className="grid grid-cols-2 gap-3">
        <Field id="cardExpiry" invalid={Boolean(expError)}>
          <FieldLabel>Expiry Date</FieldLabel>
          <FieldHint>MM / YY</FieldHint>
          <Input
            id="cardExpiry"
            type="text"
            inputMode="numeric"
            name="cardExpiry"
            value={data.cardExpiry}
            disabled={disabled}
            placeholder="12/28"
            onChange={(e) => handleExpiryChange(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, cardExpiry: true }))}
            className="font-mono text-sm"
            autoComplete="cc-exp"
          />
          {expError && <FieldError>{expError}</FieldError>}
        </Field>

        <Field id="cardCvv" invalid={Boolean(cvvError)}>
          <FieldLabel>CVV / Security Code</FieldLabel>
          <FieldHint>3 or 4 digits on back</FieldHint>
          <Input
            id="cardCvv"
            type="password"
            inputMode="numeric"
            name="cardCvv"
            maxLength={4}
            value={data.cardCvv}
            disabled={disabled}
            placeholder="•••"
            onChange={(e) => handleCvvChange(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, cardCvv: true }))}
            className="font-mono text-sm"
            autoComplete="cc-csc"
          />
          {cvvError && <FieldError>{cvvError}</FieldError>}
        </Field>
      </div>
    </div>
  );
}
