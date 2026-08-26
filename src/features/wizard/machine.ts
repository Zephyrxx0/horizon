import { setup, assign } from 'xstate';
import { type StepId, type WizardMachineContext, type WizardEvent, JOURNEY_STEPS } from './types';

export * from './types';

export interface DemoStepItem {
  id: StepId;
  label: string;
  durationMin: number;
}

export const DEMO_STEPS: readonly DemoStepItem[] = [
  { id: 'trip', label: 'Trip Type', durationMin: 2 },
  { id: 'dependent', label: 'Passport & Identity', durationMin: 3 },
  { id: 'review', label: 'Review & Confirm', durationMin: 1 },
] as const;

export function getNextStepId(current: StepId): StepId {
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === current);
  if (currentIndex === -1 || currentIndex >= JOURNEY_STEPS.length - 1) {
    return current;
  }
  return JOURNEY_STEPS[currentIndex + 1].id;
}

export function getPreviousStepId(current: StepId): StepId {
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === current);
  if (currentIndex <= 0) {
    return current;
  }
  return JOURNEY_STEPS[currentIndex - 1].id;
}

export const wizardMachine = setup({
  types: {
    context: {} as WizardMachineContext,
    events: {} as WizardEvent,
  },
  actions: {
    setAnswer: assign({
      answers: ({ context, event }) => {
        if (event.type !== 'ANSWER_CHANGED') return context.answers;
        // Lock submitted draft
        if (context.answers.submitted === true) return context.answers;
        return {
          ...context.answers,
          [event.fieldId]: event.value,
        };
      },
    }),
    setAnswersBatched: assign({
      answers: ({ context, event }) => {
        if (event.type !== 'ANSWERS_BATCHED') return context.answers;
        if (context.answers.submitted === true) return context.answers;
        return {
          ...context.answers,
          ...event.answers,
        };
      },
    }),
    setStep: assign({
      currentStepId: ({ event }) => {
        if (event.type !== 'GOTO') return 'visa-selection';
        return event.stepId;
      },
      returnToReview: ({ context, event }) => {
        if (event.type !== 'GOTO') return context.returnToReview;
        return event.returnToReview !== undefined ? event.returnToReview : context.returnToReview;
      },
    }),
    returnToReview: assign({
      currentStepId: () => 'review-payment' as StepId,
      returnToReview: () => false,
    }),
    submitPaymentSuccess: assign({
      answers: ({ context, event }) => {
        if (event.type !== 'SUBMIT_PAYMENT_SUCCESS') return context.answers;
        return {
          ...context.answers,
          paymentCompleted: true,
          submitted: true,
          receipt: event.receipt,
        };
      },
      currentStepId: () => 'confirmation' as StepId,
      returnToReview: () => false,
    }),
    nextStep: assign({
      currentStepId: ({ context }) => getNextStepId(context.currentStepId),
    }),
    prevStep: assign({
      currentStepId: ({ context }) => getPreviousStepId(context.currentStepId),
    }),
    resetAll: assign({
      answers: () => ({}),
      currentStepId: () => 'visa-selection' as StepId,
      returnToReview: () => false,
    }),
  },
}).createMachine({
  id: 'wizard',
  initial: 'idle',
  context: {
    answers: {},
    currentStepId: 'visa-selection',
    returnToReview: false,
  },
  states: {
    idle: {
      on: {
        ANSWER_CHANGED: {
          actions: 'setAnswer',
        },
        ANSWERS_BATCHED: {
          actions: 'setAnswersBatched',
        },
        GOTO: {
          actions: 'setStep',
        },
        RETURN_TO_REVIEW: {
          actions: 'returnToReview',
        },
        SUBMIT_PAYMENT_SUCCESS: {
          actions: 'submitPaymentSuccess',
        },
        NEXT: {
          actions: 'nextStep',
        },
        BACK: {
          actions: 'prevStep',
        },
        RESET: {
          actions: 'resetAll',
        },
      },
    },
  },
});

export type WizardMachine = typeof wizardMachine;
