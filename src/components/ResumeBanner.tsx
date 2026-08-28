import React, { useState } from 'react';
import { useSelector } from '@xstate/react';
import { useWizardActor, useWizardReset } from '../features/wizard/context';
import { getFirstIncompleteStep, JOURNEY_STEPS } from '../features/wizard';
import { Button } from './ui/Button';
import { Bookmark, Play, RotateCcw, X } from 'lucide-react';

export interface ResumeBannerProps {
  onOpenBackupRestore?: () => void;
  className?: string;
}

export const ResumeBanner: React.FC<ResumeBannerProps> = ({
  onOpenBackupRestore,
  className = '',
}) => {
  const actor = useWizardActor();
  const resetDraft = useWizardReset();
  const [isDismissed, setIsDismissed] = useState(false);

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  const hasDraftAnswers = Object.keys(answers).length > 0;
  const targetStepId = getFirstIncompleteStep(answers);

  // If on the target step already, or if there is no saved draft answers, or dismissed, don't show the banner
  if (!hasDraftAnswers || currentStepId === targetStepId || isDismissed) {
    return null;
  }

  const targetStep = JOURNEY_STEPS.find((s) => s.id === targetStepId);
  const visaName = (answers.visaName as string) || 'Visa';

  const handleResume = () => {
    actor.send({ type: 'GOTO', stepId: targetStepId });
  };

  return (
    <div
      role="region"
      aria-label="Resume In-Progress Application"
      className={`p-3 sm:px-4 sm:py-2.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all animate-in fade-in duration-150 ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-6 h-6 rounded-lg bg-[var(--color-indigo-primary)]/10 border border-[var(--color-indigo-primary)]/20 text-[var(--color-indigo-primary)] dark:text-blue-400 flex items-center justify-center shrink-0">
          <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <div className="text-xs truncate">
          <span className="font-bold text-[var(--color-ink)] mr-1.5">
            Saved Application Draft Found:
          </span>
          <span className="text-[var(--color-ink-muted)]">
            <strong className="text-[var(--color-ink)]">{visaName}</strong> in progress
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <Button
          variant="primary"
          onClick={handleResume}
          className="min-h-[36px] py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 rounded-lg shadow-2xs cursor-pointer active:scale-[0.96] flex-1 sm:flex-initial"
        >
          <Play className="w-3 h-3" aria-hidden="true" />
          <span>Continue Application ({targetStep?.label || 'Next Step'})</span>
        </Button>

        {onOpenBackupRestore && (
          <Button
            variant="outline"
            onClick={onOpenBackupRestore}
            className="min-h-[36px] py-1.5 px-3 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] cursor-pointer active:scale-[0.96] flex-1 sm:flex-initial"
            data-testid="resume-restore-code-btn"
          >
            Restore from Code
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={resetDraft}
          className="min-h-[36px] py-1.5 px-2.5 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-error)] rounded-lg cursor-pointer flex items-center justify-center gap-1"
          title="Start Over"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" />
          <span className="hidden sm:inline">Start Over</span>
        </Button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer ml-auto md:ml-0"
          aria-label="Dismiss draft notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
