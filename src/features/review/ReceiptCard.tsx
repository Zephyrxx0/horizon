import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { PaymentReceiptData } from './types';
import { CheckCircle2, Printer, ShieldCheck } from 'lucide-react';

export interface ReceiptCardProps {
  receipt: PaymentReceiptData;
  onPrint?: () => void;
  className?: string;
}

export function ReceiptCard({ receipt, onPrint, className = '' }: ReceiptCardProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const formattedDate = new Date(receipt.paidAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Card
      className={`p-6 sm:p-8 space-y-6 border border-[var(--color-border)] bg-white shadow-md print:shadow-none print:border-none ${className}`}
    >
      {/* Official Header */}
      <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-ink)]">
              Payment Receipt & Confirmation
            </h3>
          </div>
          <p className="text-xs text-[var(--color-ink-muted)]">
            VisaReThink Consular Services • Official E-Receipt
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handlePrint}
          className="print:hidden min-h-[40px] px-3 text-xs sm:text-sm font-semibold shrink-0"
        >
          <Printer className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Print / Download
        </Button>
      </div>

      {/* Reference & Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
        <div>
          <span className="font-semibold text-[var(--color-ink-muted)]">Reference ID</span>
          <p className="font-mono font-bold text-[var(--color-indigo-primary)] text-sm mt-0.5">
            {receipt.transactionId}
          </p>
        </div>

        <div>
          <span className="font-semibold text-[var(--color-ink-muted)]">Date & Time</span>
          <p className="font-medium text-[var(--color-ink)] text-xs mt-0.5">{formattedDate}</p>
        </div>

        <div>
          <span className="font-semibold text-[var(--color-ink-muted)]">Payment Mode</span>
          <p className="font-medium text-[var(--color-ink)] uppercase text-xs mt-0.5">
            {receipt.paymentMethod}
          </p>
        </div>

        <div>
          <span className="font-semibold text-[var(--color-ink-muted)]">Status</span>
          <p className="inline-flex items-center gap-1 font-bold text-emerald-600 text-xs mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            SUCCESSFUL
          </p>
        </div>
      </div>

      {/* Applicant & Visa Details */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
          Application Details
        </h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-[var(--color-ink-muted)]">Applicant Name</dt>
            <dd className="font-semibold text-[var(--color-ink)]">
              {receipt.applicantName || 'Applicant'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-ink-muted)]">Passport Number</dt>
            <dd className="font-mono font-semibold text-[var(--color-ink)]">
              {receipt.passportNumber || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-ink-muted)]">Visa Classification</dt>
            <dd className="font-medium text-[var(--color-ink)]">{receipt.visaType}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-ink-muted)]">Destination</dt>
            <dd className="font-medium text-[var(--color-ink)]">{receipt.destinationCountry}</dd>
          </div>
        </dl>
      </div>

      {/* Itemized Fee Breakdown */}
      <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
          Itemized Consular Fees
        </h4>
        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between text-[var(--color-ink-muted)]">
            <span>Visa Processing Fee</span>
            <span className="font-semibold text-[var(--color-ink)]">
              ₹{receipt.feeBreakdown.processingFee.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-[var(--color-ink-muted)]">
            <span>Government Visa Fee</span>
            <span className="font-semibold text-[var(--color-ink)]">
              ₹{receipt.feeBreakdown.governmentFee.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-[var(--color-ink-muted)]">
            <span>Platform & Technology Fee</span>
            <span className="font-semibold text-[var(--color-ink)]">
              ₹{receipt.feeBreakdown.platformFee.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base text-[var(--color-indigo-primary)] pt-2 border-t border-[var(--color-border)]">
            <span>Total Paid Amount</span>
            <span>₹{receipt.feeBreakdown.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Footer Trust Seal */}
      <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)] border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>Digitally Signed & Verified</span>
        </div>
        <span>Thank you for using VisaReThink</span>
      </div>
    </Card>
  );
}
