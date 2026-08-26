import { Button } from '../../components/ui/Button';
import type { ApplicationSubmissionRecord } from '../../services/mock/duplicate';
import { AlertTriangle, Search } from 'lucide-react';

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
      className={`p-4 sm:p-5 rounded-[var(--radius-card)] bg-amber-50 border-2 border-amber-400 space-y-3.5 shadow-sm animate-fadeIn ${className}`}
      data-testid="duplicate-passport-warning-card"
    >
      {/* Alert Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-amber-950">
            Active Application Found for this Passport
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            An application (Ref:{' '}
            <strong className="font-mono text-amber-950">{record.referenceNumber}</strong>) is
            currently in progress for <strong>{record.applicantName}</strong> ({record.visaType} -{' '}
            {record.country}).
          </p>
        </div>
      </div>

      {/* Mini Details Box */}
      <div className="p-3 rounded bg-amber-100/60 border border-amber-200 grid grid-cols-2 gap-2 text-xs text-amber-900">
        <div>
          <span className="text-amber-700 block text-[11px]">Current Status</span>
          <strong>{record.status}</strong>
        </div>
        <div>
          <span className="text-amber-700 block text-[11px]">Submitted On</span>
          <strong>{formattedDate}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <Button
          type="button"
          variant="primary"
          onClick={() => onTrackExisting(record.referenceNumber)}
          className="flex-1 min-h-[44px] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white border-transparent"
          data-testid="track-existing-app-btn"
        >
          <Search className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Track Existing Application ({record.referenceNumber})</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onDismiss}
          className="sm:w-auto min-h-[44px] text-xs font-semibold border-amber-300 text-amber-900 hover:bg-amber-100"
          data-testid="dismiss-duplicate-warning-btn"
        >
          Continue With New Application Anyway
        </Button>
      </div>
    </div>
  );
};
