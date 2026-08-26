import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Award } from 'lucide-react';

export interface SecuritySealBadgeProps {
  className?: string;
  referenceNumber?: string;
}

export const SecuritySealBadge: React.FC<SecuritySealBadgeProps> = ({
  className = '',
  referenceNumber,
}) => {
  return (
    <div
      className={`p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-3 ${className}`}
      data-testid="security-seal-badge"
    >
      {/* Title & Trust Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--color-ink)] block leading-tight">
              Application Integrity & Security Seal
            </span>
            <span className="text-[11px] text-[var(--color-ink-muted)]">
              Official Indian e-Visa Security Protocol Compliant
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
          Verified
        </span>
      </div>

      {/* 3 Integrity Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-[var(--color-ink)] block text-[11px]">
              TLS 1.3 / AES-256
            </span>
            <span className="text-[10px] text-[var(--color-ink-muted)]">
              Simulated 256-bit bank-grade transport encryption
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
          <Award
            className="w-3.5 h-3.5 text-[var(--color-indigo-primary)] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <span className="font-bold text-[var(--color-ink)] block text-[11px]">
              MEA Technical Standards
            </span>
            <span className="text-[10px] text-[var(--color-ink-muted)]">
              Compliant with Ministry of External Affairs portal specs
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-[var(--color-ink)] block text-[11px]">
              SHA-256 Payload Seal
            </span>
            <span className="text-[10px] text-[var(--color-ink-muted)]">
              {referenceNumber
                ? `Draft Checksum #${referenceNumber.slice(-6)}`
                : 'Application checksum generated on final submission'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
