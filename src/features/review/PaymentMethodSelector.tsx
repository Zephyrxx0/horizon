import { RadioCardGroup, RadioCard } from '../../components/ui/RadioCard';
import type { PaymentMethodType } from './types';
import { Smartphone, CreditCard, Building2 } from 'lucide-react';

export interface PaymentMethodSelectorProps {
  value: PaymentMethodType | '';
  onChange: (value: PaymentMethodType) => void;
  disabled?: boolean;
  error?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
  error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <RadioCardGroup
        legend="Select Payment Method"
        value={value}
        onChange={(val) => onChange(val as PaymentMethodType)}
        className="w-full"
      >
        <RadioCard
          value="upi"
          disabled={disabled}
          label={
            <div className="flex items-center gap-2">
              <Smartphone
                className="w-5 h-5 text-[var(--color-indigo-primary)]"
                aria-hidden="true"
              />
              <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
            </div>
          }
          description="Instant payment via UPI ID or scannable QR Code • Zero surcharge"
        />

        <RadioCard
          value="card"
          disabled={disabled}
          label={
            <div className="flex items-center gap-2">
              <CreditCard
                className="w-5 h-5 text-[var(--color-indigo-primary)]"
                aria-hidden="true"
              />
              <span>Credit / Debit Card</span>
            </div>
          }
          description="Visa, Mastercard, RuPay cards accepted with 3D Secure OTP"
        />

        <RadioCard
          value="netbanking"
          disabled={disabled}
          label={
            <div className="flex items-center gap-2">
              <Building2
                className="w-5 h-5 text-[var(--color-indigo-primary)]"
                aria-hidden="true"
              />
              <span>Netbanking</span>
            </div>
          }
          description="Direct debit from SBI, HDFC, ICICI, Axis, and 50+ other banks"
        />
      </RadioCardGroup>

      {error && (
        <p role="alert" className="text-sm font-semibold text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
