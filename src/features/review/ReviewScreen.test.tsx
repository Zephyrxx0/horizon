import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ReviewScreen } from './ReviewScreen';
import { WizardContext, type WizardContextValue } from '../wizard/context';
import { ToastProvider } from '../../components/ui/Toast';
import { createActor } from 'xstate';
import { wizardMachine } from '../wizard/machine';
import type { AutosaveController } from '../../persistence/autosave';

function renderReviewScreen(initialAnswers = {}) {
  const actor = createActor(wizardMachine).start();
  if (Object.keys(initialAnswers).length > 0) {
    actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
  }

  const mockController: AutosaveController = {
    subscribe: () => () => {},
    state: () => 'idle',
    flush: async () => {},
    recordDraftActivity: () => {},
    loadDraft: async () => null,
    clearDraft: async () => {},
  };

  const mockContext: WizardContextValue = {
    actor,
    controller: mockController,
    resetDraft: vi.fn(),
  };

  const utils = render(
    <ToastProvider>
      <WizardContext.Provider value={mockContext}>
        <ReviewScreen />
      </WizardContext.Provider>
    </ToastProvider>,
  );

  return { ...utils, actor };
}

describe('ReviewScreen', () => {
  it('renders check-answers review cards, fee breakdown, declaration, and payment button', async () => {
    const { container } = renderReviewScreen({
      destinationCountry: 'United States',
      visaType: 'Tourist Visa',
      firstName: 'Rahul',
      lastName: 'Sharma',
      passportNumber: 'AA1234567',
    });

    expect(
      screen.getByRole('heading', { name: /review application & complete payment/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Visa Selection')).toBeInTheDocument();
    expect(screen.getByText('Personal & Passport Details')).toBeInTheDocument();
    expect(screen.getByText('Uploaded Documents')).toBeInTheDocument();
    expect(screen.getByText(/total amount due/i)).toBeInTheDocument();
    expect(screen.getByText(/pay ₹8,500 & submit application/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows error summary if declaration checkbox is not checked on submit', async () => {
    const user = userEvent.setup();
    renderReviewScreen({
      destinationCountry: 'United States',
      visaType: 'Tourist Visa',
    });

    const submitBtn = screen.getByRole('button', { name: /pay ₹8,500 & submit application/i });
    await user.click(submitBtn);

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/you must confirm the applicant declaration before proceeding/i).length,
    ).toBeGreaterThan(0);
  });

  it('navigates to step editing when Edit button is clicked on a stage card', async () => {
    const user = userEvent.setup();
    const { actor } = renderReviewScreen();

    const editStage1Btn = screen.getByRole('button', { name: /edit stage 1: visa selection/i });
    await user.click(editStage1Btn);

    expect(actor.getSnapshot().context.currentStepId).toBe('visa-selection');
    expect(actor.getSnapshot().context.returnToReview).toBe(true);
  });
});
