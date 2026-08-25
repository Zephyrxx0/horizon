import type { StepStatus } from '../../components/ui/ProgressStepper';
import { DEMO_STEPS, type StepId } from './machine';

/**
 * Validation Predicates ported from prototype logic
 */
export function isValidPassport(passport: string): boolean {
  if (!passport || typeof passport !== 'string') return false;
  const clean = passport.trim().toUpperCase();
  // Validates passport format (e.g., 2 letters + 7 digits)
  return /^[A-Z]{2}\d{7}$/.test(clean);
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}

export function isExpiryValid(isoDate: string): boolean {
  if (!isoDate) return false;
  const expiry = new Date(isoDate).getTime();
  const sixMonthsFromNow = Date.now() + 180 * 24 * 60 * 60 * 1000;
  return !isNaN(expiry) && expiry >= sixMonthsFromNow;
}

/**
 * Pure derivation of individual step status without storing derived state.
 */
export function deriveStepStatus(
  stepId: StepId,
  answers: Record<string, unknown>,
  currentStepId?: StepId,
): StepStatus {
  const isCurrent = currentStepId === stepId;

  if (stepId === 'trip') {
    const hasTrip = Boolean(answers.tripType);
    if (isCurrent) return 'current';
    return hasTrip ? 'complete' : 'incomplete';
  }

  if (stepId === 'dependent') {
    const hasTrip = Boolean(answers.tripType);
    const passportVal = String(answers.passportNumber || '');
    const hasValidPassport = isValidPassport(passportVal);

    // If passport entered but upstream tripType is missing/invalidated -> needs-attention!
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

  return 'incomplete';
}

/**
 * Derives status map for all steps purely from current answers and currentStepId.
 */
export function deriveStepStatuses(
  answers: Record<string, unknown>,
  currentStepId: StepId,
): Record<StepId, StepStatus> {
  return {
    trip: deriveStepStatus('trip', answers, currentStepId),
    dependent: deriveStepStatus('dependent', answers, currentStepId),
    review: deriveStepStatus('review', answers, currentStepId),
  };
}

/**
 * Derives completion count and remaining estimate in minutes.
 */
export function deriveProgress(answers: Record<string, unknown>) {
  const total = DEMO_STEPS.length;
  let completed = 0;
  let minutesRemaining = 0;

  for (const step of DEMO_STEPS) {
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
    minutesRemaining,
  };
}
