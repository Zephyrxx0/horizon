import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveAnswersEnvelope,
  loadAnswersEnvelope,
  clearAnswersEnvelope,
  ANSWERS_STORAGE_KEY,
  type AnswersEnvelope,
} from './answers';

describe('Answers Persistence Envelope', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and loads valid answers envelope correctly', () => {
    const env: AnswersEnvelope = {
      schemaVersion: 1,
      savedAt: Date.now(),
      snapshot: {
        context: {
          answers: { tripType: 'tourist' },
          currentStepId: 'trip',
        },
      },
    };

    const saved = saveAnswersEnvelope(env);
    expect(saved).toBe(true);

    const loaded = loadAnswersEnvelope();
    expect(loaded).not.toBeNull();
    expect(loaded?.schemaVersion).toBe(1);
    expect(
      (loaded?.snapshot as { context: { answers: { tripType: string } } }).context.answers.tripType,
    ).toBe('tourist');
  });

  it('discards and clears corrupted storage content safely', () => {
    window.localStorage.setItem(ANSWERS_STORAGE_KEY, 'invalid-json{{{');
    const loaded = loadAnswersEnvelope();
    expect(loaded).toBeNull();
    expect(window.localStorage.getItem(ANSWERS_STORAGE_KEY)).toBeNull();
  });

  it('discards incompatible schema versions', () => {
    window.localStorage.setItem(
      ANSWERS_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 99, savedAt: 123, snapshot: {} }),
    );
    const loaded = loadAnswersEnvelope();
    expect(loaded).toBeNull();
    expect(window.localStorage.getItem(ANSWERS_STORAGE_KEY)).toBeNull();
  });

  it('clears envelope completely', () => {
    saveAnswersEnvelope({
      schemaVersion: 1,
      savedAt: Date.now(),
      snapshot: { context: { answers: {}, currentStepId: 'trip' } },
    });
    expect(window.localStorage.getItem(ANSWERS_STORAGE_KEY)).not.toBeNull();

    clearAnswersEnvelope();
    expect(window.localStorage.getItem(ANSWERS_STORAGE_KEY)).toBeNull();
  });
});
