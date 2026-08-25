import { setup, assign } from 'xstate';

export type StepId = 'trip' | 'dependent' | 'review';

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

export interface WizardContext {
  answers: Record<string, unknown>;
  currentStepId: StepId;
}

export type WizardEvent =
  | { type: 'ANSWER_CHANGED'; fieldId: string; value: unknown }
  | { type: 'GOTO'; stepId: StepId }
  | { type: 'RESET' };

export const wizardMachine = setup({
  types: {
    context: {} as WizardContext,
    events: {} as WizardEvent,
  },
  actions: {
    setAnswer: assign({
      answers: ({ context, event }) => {
        if (event.type !== 'ANSWER_CHANGED') return context.answers;
        return {
          ...context.answers,
          [event.fieldId]: event.value,
        };
      },
    }),
    setStep: assign({
      currentStepId: ({ event }) => {
        if (event.type !== 'GOTO') return 'trip';
        return event.stepId;
      },
    }),
    resetAll: assign({
      answers: () => ({}),
      currentStepId: () => 'trip' as StepId,
    }),
  },
}).createMachine({
  id: 'wizard',
  initial: 'idle',
  context: {
    answers: {},
    currentStepId: 'trip',
  },
  states: {
    idle: {
      on: {
        ANSWER_CHANGED: {
          actions: 'setAnswer',
        },
        GOTO: {
          actions: 'setStep',
        },
        RESET: {
          actions: 'resetAll',
        },
      },
    },
  },
});

export type WizardMachine = typeof wizardMachine;
