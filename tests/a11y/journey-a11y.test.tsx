import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import App from '../../src/App';
import { wizardMachine } from '../../src/features/wizard/machine';
import { WizardContext, type WizardContextValue } from '../../src/features/wizard/context';
import { createAutosaveController } from '../../src/persistence/autosave';
import { VisaSelectionScreen } from '../../src/features/visa';
import { PersonalDetailsScreen } from '../../src/features/personal';
import { DocumentsScreen } from '../../src/features/documents';
import { ReviewScreen } from '../../src/features/review';
import { ConfirmationScreen } from '../../src/features/confirmation';
import { ToastProvider } from '../../src/components/ui/Toast';
import type { StepId } from '../../src/features/wizard/types';

// Standard mock answers covering all wizard sections
const sampleApplicantAnswers = {
  destinationCountry: 'USA',
  tripPurpose: 'tourism',
  visaId: 'usa-b1b2',
  visaName: 'B1/B2 Tourist & Business Visa',
  visaCategory: 'Tourist / Business',
  visaTotalCost: 15500,
  givenNames: 'Priya',
  surname: 'Patel',
  passportNumber: 'Z9876543',
  passportDob: '1992-05-15',
  passportGender: 'F',
  passportIssueDate: '2021-06-10',
  passportExpiryDate: '2031-06-09',
  passportPlaceOfIssue: 'Mumbai',
  email: 'priya.patel@example.com',
  phoneCountryCode: '+91',
  phoneNumber: '9820123456',
  residentialAddress: 'Flat 402, Sea View Apartments, Bandra West, Mumbai 400050',
  maritalStatus: 'single',
  intendedArrivalDate: '2026-11-20',
  portOfEntry: 'JFK',
  hasPreviousVisas: 'no',
  declarationAccepted: true,
  applicationRef: 'IND-2026-84920',
  submissionTimestamp: 1774900000000,
};

function createMockHarness(
  stepId: StepId = 'visa-selection',
  initialAnswers = sampleApplicantAnswers,
) {
  const actor = createActor(wizardMachine).start();
  if (initialAnswers && Object.keys(initialAnswers).length > 0) {
    actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
  }
  actor.send({ type: 'GOTO', stepId });

  const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
  const mockContext: WizardContextValue = {
    actor,
    controller,
    resetDraft: vi.fn(),
  };

  return { actor, controller, mockContext };
}

describe('Whole-Journey Automated Accessibility Suite (WCAG 2.1 AA)', () => {
  it('Stage 1 (Visa Selection Screen) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('visa-selection');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <VisaSelectionScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stage 2a (Personal Identity Step) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('personal-identity');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <PersonalDetailsScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stage 2b (Personal Contact Step) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('personal-contact');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <PersonalDetailsScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stage 2c (Visa Specific Step) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('personal-details');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <PersonalDetailsScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stage 3 (Documents Upload Screen) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('documents');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <DocumentsScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stage 4 (Review & Payment Screen) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('review-payment');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <ReviewScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stage 5 (Confirmation Screen) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('confirmation');
    const { container } = render(
      <ToastProvider>
        <WizardContext.Provider value={mockContext}>
          <ConfirmationScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 1 (Visa Selection) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('visa-selection');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 2a (Identity) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('personal-identity');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 2b (Contact) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('personal-contact');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 2c (Trip Specifics) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('personal-details');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 3 (Documents) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('documents');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 4 (Review & Pay) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('review-payment');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Full App in Stage 5 (Confirmation) passes WCAG 2.1 AA axe checks', async () => {
    const { mockContext } = createMockHarness('confirmation');
    const { container } = render(
      <WizardContext.Provider value={mockContext}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
