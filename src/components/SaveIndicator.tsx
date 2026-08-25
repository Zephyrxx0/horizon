import { Loader2, Check } from 'lucide-react';
import type { SaveState } from '../persistence/autosave';
import { FOCUS_RING_CLASS } from './ui/focus';

/**
 * Honest save-state indicator.
 * Renders 'Saved' ONLY after a completed synchronous localStorage write.
 */
export interface SaveIndicatorProps {
  state: SaveState;
  onRetry?: () => void;
  className?: string;
}

export function SaveIndicator({ state, onRetry, className = '' }: SaveIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${className}`}
    >
      {state === 'idle' && <span className="text-[var(--color-ink-muted)]">Not saved</span>}

      {state === 'dirty' && (
        <span className="text-[var(--color-saffron-deep)]">Unsaved changes</span>
      )}

      {state === 'saving' && (
        <span className="text-[var(--color-ink-muted)] flex items-center gap-1.5">
          <Loader2
            className="w-4 h-4 animate-spin text-[var(--color-indigo-primary)]"
            aria-hidden="true"
          />
          <span>Saving…</span>
        </span>
      )}

      {state === 'saved' && (
        <span className="text-[var(--color-success)] flex items-center gap-1.5">
          <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
          <span>Saved</span>
        </span>
      )}

      {state === 'error' && (
        <button
          type="button"
          onClick={onRetry}
          className={`min-h-[var(--spacing-touch)] px-3 py-1 rounded-[var(--radius-input)] text-[var(--color-error)] font-semibold border border-[var(--color-error)] hover:bg-[var(--color-error)]/10 flex items-center gap-1 ${FOCUS_RING_CLASS}`}
        >
          Couldn't save — Retry
        </button>
      )}
    </div>
  );
}
