import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { ConfirmationScreen } from './ConfirmationScreen';
import { wizardMachine } from '../wizard/machine';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';
import { ToastProvider } from '../../components/ui/Toast';

describe('ConfirmationScreen Component (Stage 5)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderConfirmation(
    initialAnswers: Record<string, unknown> = {},
    initialReceipt: unknown = null,
  ) {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }
    if (initialReceipt) {
      actor.send({ type: 'SUBMIT_PAYMENT_SUCCESS', receipt: initialReceipt });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = vi.fn();

    const utils = render(
      <ToastProvider>
        <WizardContext.Provider value={{ actor, controller, resetDraft }}>
          <ConfirmationScreen />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    return { ...utils, actor };
  }

  it('renders all Confirmation screen cards with applicant data', () => {
    const mockReceipt = {
      transactionId: 'TXN-984201',
      referenceNumber: 'VR-2026-849201',
      paidAt: '2026-08-26T10:00:00.000Z',
      applicantName: 'Priya Sharma',
      passportNumber: 'P8765432',
      destinationCountry: 'United States',
      visaType: 'Student Visa',
      paymentMethod: 'upi' as const,
      paymentMethodDetails: 'priya@okhdfcbank',
      feeBreakdown: {
        governmentFee: 5000,
        platformFee: 1500,
        processingFee: 2000,
        totalAmount: 8500,
        currency: 'INR',
      },
    };

    renderConfirmation(
      {
        givenNames: 'Priya',
        surname: 'Sharma',
        visaName: 'Student Visa',
        destinationCountry: 'United States',
      },
      mockReceipt,
    );

    expect(screen.getByTestId('stage5-confirmation-screen')).toBeInTheDocument();
    expect(screen.getByText('Application Submitted Successfully!')).toBeInTheDocument();
    expect(screen.getByText('Payment Receipt & Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Live Status Timeline')).toBeInTheDocument();
    expect(screen.getByText('Interview & Next Steps Checklist')).toBeInTheDocument();
    expect(screen.getByText('Simulated Email & SMS Notifications')).toBeInTheDocument();
  });

  it('handles Start a New Visa Application reset button', () => {
    const { actor } = renderConfirmation({ givenNames: 'Priya' });

    const resetBtn = screen.getByTestId('start-new-application-btn');
    fireEvent.click(resetBtn);

    expect(actor.getSnapshot().context.currentStepId).toBe('visa-selection');
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = renderConfirmation({
      givenNames: 'Priya',
      surname: 'Sharma',
      visaName: 'Tourist Visa',
      destinationCountry: 'United Kingdom',
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
