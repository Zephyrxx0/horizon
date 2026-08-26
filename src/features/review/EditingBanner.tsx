import { useSelector } from '@xstate/react';
import { useWizardActor } from '../wizard/context';
import { JOURNEY_STEPS, type StepId } from '../wizard/types';
import { Button } from '../../components/ui/Button';
import { Check, Edit3 } from 'lucide-react';

export function getStageTitleForStep(stepId: StepId): string {
  switch (stepId) {
    case 'visa-selection':
      return 'Stage 1: Visa Selection';
    case 'personal-identity':
      return 'Stage 2: Identity & Passport';
    case 'personal-contact':
      return 'Stage 2: Contact & Address';
    case 'personal-details':
      return 'Stage 2: Trip Details';
    case 'documents':
      return 'Stage 3: Document Upload';
    default: {
      const found = JOURNEY_STEPS.find((s) => s.id === stepId);
      return found ? `Stage ${found.stageNumber}: ${found.label}` : 'Application Step';
    }
  }
}

export function EditingBanner() {
  const actor = useWizardActor();
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);
  const returnToReview = useSelector(actor, (s) => Boolean(s.context.returnToReview));

  if (!returnToReview || currentStepId === 'review-payment' || currentStepId === 'confirmation') {
    return null;
  }

  const stageTitle = getStageTitleForStep(currentStepId);

  const handleReturn = () => {
    actor.send({ type: 'RETURN_TO_REVIEW' });
  };

  return (
    <div
      role="region"
      aria-label="Editing Mode Banner"
      className="sticky top-16 z-30 w-full bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-3 shadow-xs"
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[#92400E]">
          <Edit3 className="w-4 h-4 text-[#B45309] shrink-0" aria-hidden="true" />
          <span className="font-semibold">Editing {stageTitle}</span>
          <span className="hidden sm:inline text-xs text-[#B45309]">• Changes auto-save</span>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleReturn}
          className="min-h-[40px] px-3 py-1.5 text-xs sm:text-sm font-semibold shrink-0"
          aria-label="Return to Review page"
        >
          <Check className="w-4 h-4 mr-1" aria-hidden="true" />
          Return to Review
        </Button>
      </div>
    </div>
  );
}
