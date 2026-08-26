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

  it('handles RETURN_TO_REVIEW event and resets returnToReview flag', () => {
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'personal-identity', returnToReview: true });
    expect(actor.getSnapshot().context.returnToReview).toBe(true);

    actor.send({ type: 'RETURN_TO_REVIEW' });
    expect(actor.getSnapshot().context.currentStepId).toBe('review-payment');
    expect(actor.getSnapshot().context.returnToReview).toBe(false);
  });

  it('handles SUBMIT_PAYMENT_SUCCESS and transitions to confirmation', () => {
    const actor = createActor(wizardMachine).start();
    const mockReceipt = {
      transactionId: 'PAY-123456',
      totalAmount: 8500,
    };

    actor.send({ type: 'SUBMIT_PAYMENT_SUCCESS', receipt: mockReceipt });
    const snapshot = actor.getSnapshot();
    expect(snapshot.context.currentStepId).toBe('confirmation');
    expect(snapshot.context.answers.paymentCompleted).toBe(true);
    expect(snapshot.context.answers.submitted).toBe(true);
    expect(snapshot.context.answers.receipt).toEqual(mockReceipt);
  });

  it('locks answers against changes after submission (read-only draft)', () => {
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'SUBMIT_PAYMENT_SUCCESS', receipt: { transactionId: 'PAY-1' } });

    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'firstName', value: 'ModifiedName' });
    expect(actor.getSnapshot().context.answers.firstName).toBeUndefined();

    actor.send({ type: 'ANSWERS_BATCHED', answers: { lastName: 'ModifiedLast' } });
    expect(actor.getSnapshot().context.answers.lastName).toBeUndefined();
  });
});
