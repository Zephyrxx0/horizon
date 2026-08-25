import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { wizardMachine } from './machine';

describe('wizardMachine', () => {
  it('updates answers context immutably on ANSWER_CHANGED event', () => {
    const actor = createActor(wizardMachine).start();

    const snapshot1 = actor.getSnapshot();
    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'tripType', value: 'tourist' });

    const snapshot2 = actor.getSnapshot();
    expect(snapshot2.context.answers.tripType).toBe('tourist');
    expect(snapshot1.context.answers).not.toBe(snapshot2.context.answers);
  });

  it('updates currentStepId on GOTO event', () => {
    const actor = createActor(wizardMachine).start();
    expect(actor.getSnapshot().context.currentStepId).toBe('trip');

    actor.send({ type: 'GOTO', stepId: 'dependent' });
    expect(actor.getSnapshot().context.currentStepId).toBe('dependent');
  });

  it('supports JSON persisted snapshot round-trip', () => {
    const actor1 = createActor(wizardMachine).start();
    actor1.send({ type: 'ANSWER_CHANGED', fieldId: 'passportNumber', value: 'US1234567' });
    actor1.send({ type: 'GOTO', stepId: 'dependent' });

    const persistedSnapshot = actor1.getPersistedSnapshot();
    const serialized = JSON.stringify(persistedSnapshot);
    const parsedSnapshot = JSON.parse(serialized);

    const actor2 = createActor(wizardMachine, {
      snapshot: parsedSnapshot,
    }).start();

    expect(actor2.getSnapshot().context.answers.passportNumber).toBe('US1234567');
    expect(actor2.getSnapshot().context.currentStepId).toBe('dependent');
  });
});
