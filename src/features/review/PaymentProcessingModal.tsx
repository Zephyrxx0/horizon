import React from 'react';
import { Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface PaymentProcessingModalProps {
  isOpen: boolean;
  stepIndex: number; // 0: Connecting, 1: Authorizing, 2: Confirming
  amount: number;
}

const STEPS = [
  { label: 'Connecting to payment gateway…', desc: 'Establishing secure 256-bit SSL connection' },
  { label: 'Authorizing with your bank…', desc: 'Validating credentials and account balance' },
  { label: 'Confirming transaction…', desc: 'Generating payment reference & securing receipt' },
];

export function PaymentProcessingModal({ isOpen, stepIndex, amount }: PaymentProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-processing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-[var(--color-border)] text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Animated spinner badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#EEF0FB] flex items-center justify-center relative">
          <Loader2
            className="w-8 h-8 text-[var(--color-indigo-primary)] animate-spin"
            aria-hidden="true"
          />
          <ShieldCheck
            className="w-4 h-4 text-[var(--color-indigo-primary)] absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1.5">
          <h2
            id="payment-processing-title"
            className="text-lg sm:text-xl font-bold text-[var(--color-ink)]"
          >
            Processing ₹{amount.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)]">
            Please do not refresh or close this window. Your transaction is in progress.
          </p>
        </div>

        {/* Step Progression */}
        <div className="space-y-3 text-left pt-2">
          {STEPS.map((s, idx) => {
            const isCompleted = stepIndex > idx;
            const isCurrent = stepIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  isCurrent
                    ? 'bg-[#EEF0FB] border border-[var(--color-indigo-primary)]/20'
                    : isCompleted
                      ? 'bg-emerald-50/50'
                      : 'opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  ) : isCurrent ? (
                    <Loader2
                      className="w-4 h-4 text-[var(--color-indigo-primary)] animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[var(--color-indigo-primary)]'
                        : isCompleted
                          ? 'text-emerald-900'
                          : 'text-[var(--color-ink-muted)]'
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[11px] text-[var(--color-ink-muted)] truncate">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
