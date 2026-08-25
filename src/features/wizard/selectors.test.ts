import { describe, it, expect } from 'vitest';
import {
  deriveStepStatus,
  deriveStepStatuses,
  getFirstIncompleteStep,
  deriveProgress,
} from './selectors';

describe('Wizard Step Selectors & Resumption (STATE-04)', () => {
  const validFutureDate = new Date(Date.now() + 730 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const stage1Answers = {
    destinationCountry: 'USA',
    tripPurpose: 'tourism',
    visaId: 'usa-b1b2',
    visaCategory: 'tourist',
  };

  const stage2aAnswers = {
    ...stage1Answers,
    firstName: 'Aarav',
    lastName: 'Patel',
    dateOfBirth: '1990-08-15',
    gender: 'male',
    nationality: 'India',
    passportNumber: 'AA1234567',
    passportIssueDate: '2021-01-10',
    passportExpiryDate: validFutureDate,
  };

  const stage2bAnswers = {
    ...stage2aAnswers,
    email: 'aarav.patel@example.com',
    phone: '+91 98765 43210',
    addressLine1: '123 MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
  };

  const stage2cAnswers = {
    ...stage2bAnswers,
    travelStartDate: '2026-10-01',
    stayAddress: 'Grand Hotel, New York',
  };

  it('correctly derives completion status per step', () => {
    expect(deriveStepStatus('visa-selection', {})).toBe('incomplete');
    expect(deriveStepStatus('visa-selection', stage1Answers)).toBe('complete');
    expect(deriveStepStatus('personal-identity', stage1Answers)).toBe('incomplete');
    expect(deriveStepStatus('personal-identity', stage2aAnswers)).toBe('complete');
    expect(deriveStepStatus('personal-contact', stage2bAnswers)).toBe('complete');
    expect(deriveStepStatus('personal-details', stage2cAnswers)).toBe('complete');
  });

  it('marks dependent steps as needs-attention if upstream answers are cleared', () => {
    // Has identity answers but visa selection was cleared
    const corruptedAnswers = {
      firstName: 'Aarav',
      passportNumber: 'AA1234567',
    };
    expect(deriveStepStatus('personal-identity', corruptedAnswers)).toBe('needs-attention');
  });

  it('calculates getFirstIncompleteStep for resumption on empty answers', () => {
    expect(getFirstIncompleteStep({})).toBe('visa-selection');
  });

  it('calculates getFirstIncompleteStep for resumption on partially completed answers (STATE-04)', () => {
    // Completed stage 1 -> should resume on personal-identity
    expect(getFirstIncompleteStep(stage1Answers)).toBe('personal-identity');

    // Completed stage 1 + 2a -> should resume on personal-contact
    expect(getFirstIncompleteStep(stage2aAnswers)).toBe('personal-contact');

    // Completed stage 1 + 2a + 2b -> should resume on personal-details
    expect(getFirstIncompleteStep(stage2bAnswers)).toBe('personal-details');

    // Completed stage 1 + 2a + 2b + 2c -> should resume on documents (Stage 3)
    expect(getFirstIncompleteStep(stage2cAnswers)).toBe('documents');
  });

  it('derives progress percentage and remaining duration accurately', () => {
    const p0 = deriveProgress({});
    expect(p0.completed).toBe(0);
    expect(p0.percent).toBe(0);
    expect(p0.minutesRemaining).toBeGreaterThan(0);

    const p1 = deriveProgress(stage1Answers);
    expect(p1.completed).toBe(1);
    expect(p1.percent).toBe(14); // 1/7 rounded

    const pCompleteStage2 = deriveProgress(stage2cAnswers);
    expect(pCompleteStage2.completed).toBe(4);
    expect(pCompleteStage2.percent).toBe(57); // 4/7 rounded
  });

  it('returns complete status map via deriveStepStatuses', () => {
    const map = deriveStepStatuses(stage2aAnswers, 'personal-contact');
    expect(map['visa-selection']).toBe('complete');
    expect(map['personal-identity']).toBe('complete');
    expect(map['personal-contact']).toBe('current');
    expect(map['personal-details']).toBe('incomplete');
    expect(map['documents']).toBe('incomplete');
  });
});
