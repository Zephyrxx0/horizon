export type StepId =
  | 'visa-selection'
  | 'personal-identity'
  | 'personal-contact'
  | 'personal-details'
  | 'documents'
  | 'review-payment'
  | 'confirmation'
  // Phase 1 demo step compatibility
  | 'trip'
  | 'dependent'
  | 'review';

export interface JourneyStepItem {
  id: StepId;
  stageNumber: number;
  label: string;
  subLabel?: string;
  durationMin: number;
}

export const JOURNEY_STEPS: readonly JourneyStepItem[] = [
  { id: 'visa-selection', stageNumber: 1, label: 'Visa Selection', durationMin: 1 },
  {
    id: 'personal-identity',
    stageNumber: 2,
    label: 'Personal Details',
    subLabel: 'Identity & Passport',
    durationMin: 2,
  },
  {
    id: 'personal-contact',
    stageNumber: 2,
    label: 'Personal Details',
    subLabel: 'Contact & Address',
    durationMin: 1,
  },
  {
    id: 'personal-details',
    stageNumber: 2,
    label: 'Personal Details',
    subLabel: 'Trip Details',
    durationMin: 1,
  },
  { id: 'documents', stageNumber: 3, label: 'Document Upload', durationMin: 5 },
  { id: 'review-payment', stageNumber: 4, label: 'Review & Payment', durationMin: 2 },
  { id: 'confirmation', stageNumber: 5, label: 'Confirmation', durationMin: 1 },
] as const;

export interface WizardMachineContext {
  answers: Record<string, unknown>;
  currentStepId: StepId;
  returnToReview?: boolean;
}

export type WizardEvent =
  | { type: 'ANSWER_CHANGED'; fieldId: string; value: unknown }
  | { type: 'ANSWERS_BATCHED'; answers: Record<string, unknown> }
  | { type: 'GOTO'; stepId: StepId; returnToReview?: boolean }
  | { type: 'RETURN_TO_REVIEW' }
  | { type: 'SUBMIT_PAYMENT_SUCCESS'; receipt: Record<string, unknown> }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' };
