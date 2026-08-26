import type { StepStatus } from '../../components/ui/ProgressStepper';
import { JOURNEY_STEPS, type StepId } from './types';
import {
  validateVisaSelectionStep,
  validateIdentityStep,
  validateContactStep,
  validateVisaSpecificStep,
  validateDocumentsStep,
  isValidPassport,
} from './validators';

export * from './validators';

/**
 * Pure derivation of individual step status without storing derived state.
 */
export function deriveStepStatus(
  stepId: StepId,
  answers: Record<string, unknown>,
  currentStepId?: StepId,
): StepStatus {
  const isCurrent = currentStepId === stepId;

  // Legacy demo steps
  if (stepId === 'trip') {
    const hasTrip = Boolean(answers.tripType);
    if (isCurrent) return 'current';
    return hasTrip ? 'complete' : 'incomplete';
  }

  if (stepId === 'dependent') {
    const hasTrip = Boolean(answers.tripType);
    const passportVal = String(answers.passportNumber || '');
    const hasValidPassport = isValidPassport(passportVal);

    if (passportVal && !hasTrip) {
      return 'needs-attention';
    }

    if (isCurrent) return 'current';
    if (hasTrip && hasValidPassport) return 'complete';
    return 'incomplete';
  }

  if (stepId === 'review') {
    if (isCurrent) return 'current';
    const hasTrip = Boolean(answers.tripType);
    const hasValidPassport = isValidPassport(String(answers.passportNumber || ''));
    if (hasTrip && hasValidPassport) return 'complete';
    return 'incomplete';
  }

  // --- Real Guided Journey Stages ---

  // Stage 1: Visa Selection
  if (stepId === 'visa-selection') {
    const errors = validateVisaSelectionStep(answers);
    const isComplete = Object.keys(errors).length === 0;
    if (isCurrent) return 'current';
    return isComplete ? 'complete' : 'incomplete';
  }

  // Stage 2a: Identity & Passport
  if (stepId === 'personal-identity') {
    const visaErrors = validateVisaSelectionStep(answers);
    const hasVisa = Object.keys(visaErrors).length === 0;
    const identityErrors = validateIdentityStep(answers);
    const isIdentityComplete = Object.keys(identityErrors).length === 0;

    // Invalidation check: if identity answers entered but visa selection was cleared
    if (Boolean(answers.firstName || answers.passportNumber) && !hasVisa) {
      return 'needs-attention';
    }

    if (isCurrent) return 'current';
    if (hasVisa && isIdentityComplete) return 'complete';
    return 'incomplete';
  }

  // Stage 2b: Contact & Address
  if (stepId === 'personal-contact') {
    const identityStatus = deriveStepStatus('personal-identity', answers);
    const isIdentityComplete = identityStatus === 'complete';
    const contactErrors = validateContactStep(answers);
    const isContactComplete = Object.keys(contactErrors).length === 0;

    if (Boolean(answers.email || answers.phone) && !isIdentityComplete) {
      return 'needs-attention';
    }

    if (isCurrent) return 'current';
    if (isIdentityComplete && isContactComplete) return 'complete';
    return 'incomplete';
  }

  // Stage 2c: Visa-Specific Details
  if (stepId === 'personal-details') {
    const contactStatus = deriveStepStatus('personal-contact', answers);
    const isContactComplete = contactStatus === 'complete';
    const specificErrors = validateVisaSpecificStep(answers);
    const isSpecificComplete = Object.keys(specificErrors).length === 0;

    if (
      Boolean(answers.travelStartDate || answers.institutionName || answers.employerName) &&
      !isContactComplete
    ) {
      return 'needs-attention';
    }

    if (isCurrent) return 'current';
    if (isContactComplete && isSpecificComplete) return 'complete';
    return 'incomplete';
  }

  // Stage 3: Document Upload
  if (stepId === 'documents') {
    const personalComplete = deriveStepStatus('personal-details', answers) === 'complete';
    const docErrors = validateDocumentsStep(answers);
    const isDocsComplete = Object.keys(docErrors).length === 0;

    const hasAnyDocs =
      Boolean(answers.documents) &&
      Object.keys((answers.documents || {}) as Record<string, unknown>).length > 0;

    if (hasAnyDocs && !personalComplete) {
      return 'needs-attention';
    }

    if (isCurrent) return 'current';
    if (personalComplete && isDocsComplete) return 'complete';
    return 'incomplete';
  }

  // Stage 4: Review & Payment (Phase 4 placeholder)
  if (stepId === 'review-payment') {
    const isPaid = Boolean(answers.paymentCompleted);
    if (isCurrent) return 'current';
    return isPaid ? 'complete' : 'incomplete';
  }

  // Stage 5: Confirmation (Phase 5 placeholder)
  if (stepId === 'confirmation') {
    if (isCurrent) return 'current';
    return answers.submitted ? 'complete' : 'incomplete';
  }

  return 'incomplete';
}

/**
 * Derives status map for all steps purely from current answers and currentStepId.
 */
export function deriveStepStatuses(
  answers: Record<string, unknown>,
  currentStepId: StepId,
): Record<StepId, StepStatus> {
  const result = {} as Record<StepId, StepStatus>;
  for (const step of JOURNEY_STEPS) {
    result[step.id] = deriveStepStatus(step.id, answers, currentStepId);
  }
  // Backwards compatibility with Phase 1 demo tests
  result['trip'] = deriveStepStatus('trip', answers, currentStepId);
  result['dependent'] = deriveStepStatus('dependent', answers, currentStepId);
  result['review'] = deriveStepStatus('review', answers, currentStepId);

  return result;
}

/**
 * Returns the first incomplete step by re-evaluating validators over answers (STATE-04).
 */
export function getFirstIncompleteStep(answers: Record<string, unknown>): StepId {
  for (const step of JOURNEY_STEPS) {
    const status = deriveStepStatus(step.id, answers);
    if (status !== 'complete') {
      return step.id;
    }
  }
  return JOURNEY_STEPS[JOURNEY_STEPS.length - 1].id;
}

/**
 * Derives progress completion count and remaining estimate in minutes.
 */
export function deriveProgress(answers: Record<string, unknown>) {
  const total = JOURNEY_STEPS.length;
  let completed = 0;
  let minutesRemaining = 0;

  for (const step of JOURNEY_STEPS) {
    const status = deriveStepStatus(step.id, answers);
    if (status === 'complete') {
      completed++;
    } else {
      minutesRemaining += step.durationMin;
    }
  }

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percent,
    minutesRemaining: minutesRemaining === 0 && completed < total ? 1 : minutesRemaining,
  };
}
