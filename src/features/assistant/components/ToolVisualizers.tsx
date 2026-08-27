import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Search,
  ShieldCheck,
} from 'lucide-react';
import type {
  VisaDetailsResult,
  FeeCalculationResult,
  RequiredDocumentsResult,
  PassportValidityResult,
  TrackingStatusResult,
} from '../../../services/ai/types';

export function VisaDetailsVisualizer({ data }: { data: VisaDetailsResult }) {
  if (!data.found) {
    return <div className="text-xs text-red-500">{data.error}</div>;
  }

  return (
    <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2.5 my-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-saffron-bright)] dark:text-amber-400">
            {data.destination} • {data.category}
          </span>
          <h4 className="font-bold text-sm text-[var(--color-ink)]">{data.name}</h4>
        </div>
        <span className="text-xs font-bold text-[var(--color-indigo-primary)] px-2 py-0.5 rounded-full bg-[var(--color-indigo-primary)]/10">
          ₹{data.totalCost?.toLocaleString('en-IN')}
        </span>
      </div>
      <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{data.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--color-border)]">
        <div>
          <span className="text-[10px] text-[var(--color-ink-muted)] block">Processing</span>
          <span className="font-semibold text-[var(--color-ink)]">
            {data.processingTimeDisplay}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--color-ink-muted)] block">Documents</span>
          <span className="font-semibold text-[var(--color-ink)]">
            {data.requiredDocumentsCount} items
          </span>
        </div>
      </div>
    </div>
  );
}

export function FeeSummaryVisualizer({ data }: { data: FeeCalculationResult }) {
  return (
    <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2.5 my-1">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-ink)]">
          <CreditCard className="w-3.5 h-3.5 text-[var(--color-indigo-primary)]" />
          <span>{data.visaName}</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          Zero Hidden Fees
        </span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>Consular Visa Fee:</span>
          <span className="font-medium text-[var(--color-ink)]">
            ₹{data.consularFee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>Govt MEA Fee:</span>
          <span className="font-medium text-[var(--color-ink)]">
            ₹{data.governmentMeaFee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>Platform Service Fee:</span>
          <span className="font-medium text-[var(--color-ink)]">
            ₹{data.platformFee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--color-border)] text-[var(--color-ink)]">
          <span>Total Amount Payable:</span>
          <span className="text-[var(--color-indigo-primary)]">
            ₹{data.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

export function DocChecklistVisualizer({ data }: { data: RequiredDocumentsResult }) {
  return (
    <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-3 my-1">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-ink)]">
          <FileText className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" />
          <span>Checklist for {data.destination}</span>
        </div>
        <span className="text-[10px] text-[var(--color-ink-muted)]">
          {data.mandatoryDocuments.length} mandatory
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {data.mandatoryDocuments.map((doc) => (
          <div key={doc.id} className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[var(--color-ink)]">{doc.name}</span>
              <span className="text-[10px] text-[var(--color-ink-muted)] block">
                {doc.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-[var(--color-border)] text-[11px] text-[var(--color-ink-muted)] space-y-1">
        <span className="font-semibold text-[var(--color-ink)] block">📸 Photo Spec:</span>
        <span>
          {data.photoSpecifications.dimensions} on {data.photoSpecifications.background} (
          {data.photoSpecifications.recency})
        </span>
      </div>
    </div>
  );
}

export function PassportValidityVisualizer({ data }: { data: PassportValidityResult }) {
  return (
    <div
      className={`p-3.5 rounded-xl border space-y-2 my-1 ${
        data.isValidForTravel
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
      }`}
    >
      <div className="flex items-center gap-2">
        {data.isValidForTravel ? (
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        )}
        <span className="font-bold text-xs">
          {data.isValidForTravel
            ? 'Valid for Travel (6-Month Rule Satisfied)'
            : 'Passport Expiry Warning'}
        </span>
      </div>
      <div className="text-xs space-y-1">
        <div>
          <strong>Validity Remaining:</strong> ~{data.monthsRemaining} months ({data.daysRemaining}{' '}
          days)
        </div>
        <div>
          <strong>Action:</strong> {data.recommendedAction}
        </div>
      </div>
    </div>
  );
}

export function TrackingVisualizer({ data }: { data: TrackingStatusResult }) {
  return (
    <div className="p-3.5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2.5 my-1">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-ink)]">
          <Search className="w-3.5 h-3.5 text-[var(--color-indigo-primary)]" />
          <span>{data.arn}</span>
        </div>
        <span className="text-[10px] font-bold text-[var(--color-indigo-primary)] px-2 py-0.5 rounded-full bg-[var(--color-indigo-primary)]/10 uppercase">
          {data.status.replace('_', ' ')}
        </span>
      </div>
      <div className="text-xs space-y-1 text-[var(--color-ink)]">
        <div>
          <strong>Current Stage:</strong> {data.currentStage}
        </div>
        <div>
          <strong>Last Updated:</strong> {data.lastUpdated}
        </div>
        <div>
          <strong>Estimated Completion:</strong> {data.estimatedCompletion}
        </div>
      </div>
      <p className="text-[11px] text-[var(--color-ink-muted)] italic border-t border-[var(--color-border)] pt-2">
        {data.nextStepText}
      </p>
    </div>
  );
}
