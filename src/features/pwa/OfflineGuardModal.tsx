import { WifiOff, ShieldCheck, RefreshCw } from 'lucide-react';
import { Sheet } from '../../components/ui/Sheet';
import { FOCUS_RING_CLASS } from '../../components/ui/focus';

export interface OfflineGuardModalProps {
  open: boolean;
  onClose: () => void;
  onRetry?: () => void;
  actionName?: string;
}

export function OfflineGuardModal({
  open,
  onClose,
  onRetry,
  actionName = 'Final Submission',
}: OfflineGuardModalProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Internet Connection Required"
      description="You are currently offline. An active connection is required to complete this step."
    >
      <div className="space-y-4" data-testid="offline-guard-content">
        {/* Reassurance Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-[var(--radius-card)] p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <h3 className="font-semibold text-emerald-900">Your draft is completely safe</h3>
            <p className="text-emerald-800 mt-0.5 text-xs sm:text-sm">
              All your answers, personal information, and uploaded documents remain safely stored on
              this device. Nothing has been lost.
            </p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-[var(--radius-card)] p-4 text-xs sm:text-sm text-[var(--color-ink-muted)] space-y-2">
          <div className="flex items-center gap-2 font-medium text-[var(--color-ink)]">
            <WifiOff className="w-4 h-4 text-amber-600" aria-hidden="true" />
            <span>Why is an internet connection needed now?</span>
          </div>
          <p>
            {actionName} requires live communication with payment gateways and government servers to
            verify application integrity and generate your official reference ID.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            data-testid="offline-guard-close-btn"
            className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold rounded-[var(--radius-input)] border border-[var(--color-border)] hover:bg-slate-50 text-[var(--color-ink)] cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${FOCUS_RING_CLASS}`}
          >
            <span>Keep Editing Draft</span>
          </button>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              data-testid="offline-guard-retry-btn"
              className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold rounded-[var(--radius-input)] bg-[var(--color-indigo-primary)] hover:bg-[var(--color-indigo-hover)] text-white shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${FOCUS_RING_CLASS}`}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Check Connection & Retry</span>
            </button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
