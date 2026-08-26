import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { DocumentsScreen } from './DocumentsScreen';
import { WizardContext } from '../wizard/context';
import { wizardMachine } from '../wizard/machine';
import { createAutosaveController } from '../../persistence/autosave';

describe('DocumentsScreen Container', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const renderWithActor = (initialAnswers: Record<string, unknown> = {}) => {
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'documents' });

    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = () => {};

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <DocumentsScreen />
      </WizardContext.Provider>,
    );

    return { ...utils, actor };
  };

  it('renders progress bar, mandatory section, and optional section', async () => {
    const { container } = renderWithActor({ visaId: 'us-tourist' });

    expect(screen.getByText(/Stage 3: Document Upload Pipeline/)).toBeDefined();
    expect(screen.getByText(/Mandatory Documents/)).toBeDefined();
    expect(screen.getByText(/Optional Supporting Documents/)).toBeDefined();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays ErrorSummary when submitting without mandatory attachments', () => {
    const { actor } = renderWithActor({
      visaId: 'us-tourist',
      documents: {},
    });

    fireEvent.click(screen.getByText('Continue to Review & Payment'));

    expect(screen.getByText(/Please fix the following document requirements/)).toBeDefined();
    expect(actor.getSnapshot().context.currentStepId).toBe('documents');
  });

  it('allows continuation when all mandatory slots are attached', () => {
    const { actor } = renderWithActor({
      visaId: 'us-tourist',
      // Prior stage answers to allow step advancement
      destinationCountry: 'USA',
      tripPurpose: 'tourism',
      firstName: 'Aarav',
      lastName: 'Sharma',
      dateOfBirth: '1995-05-15',
      gender: 'male',
      nationality: 'Indian',
      passportNumber: 'Z1234567',
      passportIssueDate: '2020-01-01',
      passportExpiryDate: '2030-01-01',
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      addressLine1: 'MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      travelStartDate: '2026-10-01',
      stayAddress: 'Times Square Hotel, NY',
      documents: {
        passport_passport_bio: {
          docId: 'doc_1',
          slotId: 'passport',
          subSlotId: 'passport_bio',
          fileName: 'bio.jpg',
          originalSize: 100000,
          compressedSize: 50000,
          mimeType: 'image/jpeg',
          uploadedAt: '2026-08-26T12:00:00Z',
        },
        passport_passport_address: {
          docId: 'doc_2',
          slotId: 'passport',
          subSlotId: 'passport_address',
          fileName: 'address.jpg',
          originalSize: 100000,
          compressedSize: 50000,
          mimeType: 'image/jpeg',
          uploadedAt: '2026-08-26T12:00:00Z',
        },
        photo: {
          docId: 'doc_3',
          slotId: 'photo',
          fileName: 'photo.jpg',
          originalSize: 100000,
          compressedSize: 50000,
          mimeType: 'image/jpeg',
          uploadedAt: '2026-08-26T12:00:00Z',
        },
      },
    });

    fireEvent.click(screen.getByText('Continue to Review & Payment'));
    expect(actor.getSnapshot().context.currentStepId).toBe('review-payment');
  });
});
