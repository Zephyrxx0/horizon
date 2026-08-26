import { Loader2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SaveState } from '../persistence/autosave';
import { FOCUS_RING_CLASS } from './ui/focus';

/**
 * Honest save-state indicator.
 * Renders 'Saved' ONLY after a completed synchronous localStorage write.
 */
export interface SaveIndicatorProps {
  state: SaveState;
  onRetry?: () => void;
  onClickSaved?: () => void;
  className?: string;
}

export function SaveIndicator({
  state,
  onRetry,
  onClickSaved,
  className = '',
}: SaveIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${className}`}
    >
      {state === 'idle' && <span className="text-[var(--color-ink-muted)]">{t('save.idle')}</span>}

      {state === 'dirty' && (
        <span className="text-[var(--color-saffron-deep)]">{t('save.dirty')}</span>
      )}

      {state === 'saving' && (
        <span className="text-[var(--color-ink-muted)] flex items-center gap-1.5">
          <Loader2
            className="w-4 h-4 animate-spin text-[var(--color-indigo-primary)]"
            aria-hidden="true"
          />
          <span>{t('save.saving')}</span>
        </span>
      )}

      {state === 'saved' &&
        (onClickSaved ? (
          <button
            type="button"
            onClick={onClickSaved}
            title="Click to backup your draft to cloud or email"
            aria-label="Application progress saved. Click to backup draft."
            className="text-[var(--color-success)] hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-success)] rounded"
            data-testid="save-indicator-badge"
          >
            <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            <span>{t('save.saved')}</span>
          </button>
        ) : (
          <span
            className="text-[var(--color-success)] flex items-center gap-1.5"
            data-testid="save-indicator-badge"
          >
            <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            <span>{t('save.saved')}</span>
          </span>
        ))}

      {state === 'error' && (
        <button
          type="button"
          onClick={onRetry}
          className={`min-h-[var(--spacing-touch)] px-3 py-1 rounded-[var(--radius-input)] text-[var(--color-error)] font-semibold border border-[var(--color-error)] hover:bg-[var(--color-error)]/10 flex items-center gap-1 ${FOCUS_RING_CLASS}`}
        >
          {t('save.error')}
        </button>
      )}
    </div>
  );
}
