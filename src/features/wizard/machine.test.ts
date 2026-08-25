import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { wizardMachine } from './machine';

describe('wizardMachine', () => {
  it('updates answers context immutably on ANSWER_CHANGED event', () => {
    const actor = createActor(wizardMachine).start();

    const snapshot1 = actor.getSnapshot();
    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'destinationCountry', value: 'USA' });

    const snapshot2 = actor.getSnapshot();
    expect(snapshot2.context.answers.destinationCountry).toBe('USA');
    expect(snapshot1.context.answers).not.toBe(snapshot2.context.answers);
  });

  it('updates multiple answers on ANSWERS_BATCHED event', () => {
    const actor = createActor(wizardMachine).start();

    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: {
        destinationCountry: 'UK',
        tripPurpose: 'study',
        visaId: 'uk-student',
      },
    });

    const snapshot = actor.getSnapshot();
    expect(snapshot.context.answers.destinationCountry).toBe('UK');
    expect(snapshot.context.answers.tripPurpose).toBe('study');
    expect(snapshot.context.answers.visaId).toBe('uk-student');
  });

  it('advances on NEXT and returns on BACK', () => {
    const actor = createActor(wizardMachine).start();
    expect(actor.getSnapshot().context.currentStepId).toBe('visa-selection');

    actor.send({ type: 'NEXT' });
    expect(actor.getSnapshot().context.currentStepId).toBe('personal-identity');

    actor.send({ type: 'NEXT' });
    expect(actor.getSnapshot().context.currentStepId).toBe('personal-contact');

    actor.send({ type: 'BACK' });
    expect(actor.getSnapshot().context.currentStepId).toBe('personal-identity');
  });

  it('updates currentStepId on GOTO event', () => {
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'personal-contact' });
    expect(actor.getSnapshot().context.currentStepId).toBe('personal-contact');
  });

  it('supports JSON persisted snapshot round-trip', () => {
    const actor1 = createActor(wizardMachine).start();
    actor1.send({ type: 'ANSWER_CHANGED', fieldId: 'passportNumber', value: 'AA1234567' });
    actor1.send({ type: 'GOTO', stepId: 'personal-identity' });

    const persistedSnapshot = actor1.getPersistedSnapshot();
    const serialized = JSON.stringify(persistedSnapshot);
    const parsedSnapshot = JSON.parse(serialized);

    const actor2 = createActor(wizardMachine, {
      snapshot: parsedSnapshot,
    }).start();

    expect(actor2.getSnapshot().context.answers.passportNumber).toBe('AA1234567');
    expect(actor2.getSnapshot().context.currentStepId).toBe('personal-identity');
  });
});
