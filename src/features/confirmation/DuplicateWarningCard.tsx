import { Button } from '../../components/ui/Button';
import type { ApplicationSubmissionRecord } from '../../services/mock/duplicate';
import { AlertTriangle, Search, ArrowRight } from 'lucide-react';

export interface DuplicateWarningCardProps {
  record: ApplicationSubmissionRecord;
  onTrackExisting: (referenceNumber: string) => void;
  onDismiss: () => void;
  className?: string;
}

export const DuplicateWarningCard: React.FC<DuplicateWarningCardProps> = ({
  record,
  onTrackExisting,
  onDismiss,
  className = '',
}) => {
  const formattedDate = record.submittedAt
    ? new Date(record.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-4 sm:p-5 rounded-2xl bg-[var(--color-saffron-50)] dark:bg-[var(--color-saffron-bright)]/10 border border-[var(--color-saffron-bright)]/30 space-y-4 shadow-xs animate-in fade-in duration-200 overflow-hidden ${className}`}
      data-testid="duplicate-passport-warning-card"
    >
      {/* Alert Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--color-saffron-bright)]/15 border border-[var(--color-saffron-bright)]/30 text-[var(--color-saffron-deep)] flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-bold text-[var(--color-ink)]">
            Active Application Found for this Passport
          </h3>
          <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            An application (Ref:{' '}
            <strong className="font-mono text-[var(--color-ink)]">{record.referenceNumber}</strong>)
            is currently in progress for{' '}
            <strong className="text-[var(--color-ink)]">{record.applicantName}</strong> (
            {record.visaType} - {record.country}).
          </p>
        </div>
      </div>

      {/* Mini Details Box */}
      <div className="p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[var(--color-ink-muted)] block text-[11px] font-medium">
            Current Status
          </span>
          <strong className="text-[var(--color-ink)] font-semibold">{record.status}</strong>
        </div>
        <div>
          <span className="text-[var(--color-ink-muted)] block text-[11px] font-medium">
            Submitted On
          </span>
          <strong className="text-[var(--color-ink)] font-semibold tabular-nums">
            {formattedDate}
          </strong>
        </div>
      </div>

      {/* Action Buttons (Fully responsive without overflow) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
        <Button
          type="button"
          variant="primary"
          onClick={() => onTrackExisting(record.referenceNumber)}
          className="min-h-[40px] py-2 px-4 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98]"
          data-testid="track-existing-app-btn"
        >
          <Search className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Track Existing Application ({record.referenceNumber})</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onDismiss}
          className="min-h-[40px] py-2 px-3.5 text-xs font-semibold border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-surface-card)] flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
          data-testid="dismiss-duplicate-warning-btn"
        >
          <span>Continue With New Application Anyway</span>
          <ArrowRight className="w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
