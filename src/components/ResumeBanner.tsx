import React from 'react';
import { useSelector } from '@xstate/react';
import { useWizardActor, useWizardReset } from '../features/wizard/context';
import { getFirstIncompleteStep, JOURNEY_STEPS } from '../features/wizard';
import { Button } from './ui/Button';
import { Bookmark, Play, RotateCcw } from 'lucide-react';

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

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  const hasDraftAnswers = Object.keys(answers).length > 0;
  const targetStepId = getFirstIncompleteStep(answers);

  // If on the target step already, or if there's no saved draft answers, don't show the banner
  if (!hasDraftAnswers || currentStepId === targetStepId) {
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
      className={`p-4 rounded-[var(--radius-card)] bg-[var(--color-surface-card)] border-2 border-[var(--color-indigo-primary)] shadow-sm space-y-3 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <Bookmark
          className="w-5 h-5 text-[var(--color-indigo-primary)] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-[var(--color-ink)]">
            Saved Application Draft Found
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
            You have an in-progress application for <strong>{visaName}</strong>. You can resume
            directly where you left off.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          variant="primary"
          onClick={handleResume}
          className="min-h-[44px] py-2 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Continue Application ({targetStep?.label || 'Next Step'})</span>
        </Button>

        {onOpenBackupRestore && (
          <Button
            variant="outline"
            onClick={onOpenBackupRestore}
            className="min-h-[44px] py-2 px-3 text-xs font-semibold border-indigo-200 text-[var(--color-indigo-primary)] hover:bg-indigo-50"
            data-testid="resume-restore-code-btn"
          >
            Restore from Code
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={resetDraft}
          className="min-h-[44px] py-2 px-3 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-error)] flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Start Over</span>
        </Button>
      </div>
    </div>
  );
};
