import React from 'react';
import { Card } from '../../components/ui/Card';
import type { FeeBreakdown } from './types';
import { ShieldCheck, Check } from 'lucide-react';

export interface FeeBreakdownCardProps {
  feeBreakdown: FeeBreakdown;
  className?: string;
}

export function FeeBreakdownCard({ feeBreakdown, className = '' }: FeeBreakdownCardProps) {
  const { processingFee, governmentFee, platformFee, totalAmount } = feeBreakdown;

  return (
    <Card
      className={`p-5 sm:p-6 space-y-4 border border-[var(--color-border)] bg-white shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--color-indigo-primary)]" aria-hidden="true" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
            Total Amount Due
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[var(--color-success)] border border-[#DCFCE7]">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          Zero hidden charges
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
          <span>Visa Processing Fee</span>
          <span className="font-semibold text-[var(--color-ink)]">
            ₹{processingFee.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
          <span>Government Visa Fee</span>
          <span className="font-semibold text-[var(--color-ink)]">
            ₹{governmentFee.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
          <span>Platform & Technology Fee</span>
          <span className="font-semibold text-[var(--color-ink)]">
            ₹{platformFee.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <div>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Total Payable
          </span>
          <p className="text-xs text-[var(--color-ink-muted)]">
            Inclusive of all taxes & consular fees
          </p>
        </div>
        <span className="text-2xl sm:text-3xl font-extrabold text-[var(--color-indigo-primary)]">
          ₹{totalAmount.toLocaleString('en-IN')}
        </span>
      </div>
    </Card>
  );
}
