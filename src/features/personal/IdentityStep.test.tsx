import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { IdentityStep } from './IdentityStep';
import { wizardMachine } from '../wizard/machine';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';

describe('IdentityStep Component (Stage 2a)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderIdentity(initialAnswers = {}) {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = () => {};

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <IdentityStep />
      </WizardContext.Provider>,
    );

    return { ...utils, actor };
  }

  it('renders all identity fields and auto-formats passport number to AA1234567', async () => {
    const user = userEvent.setup();
    const { actor } = renderIdentity();

    expect(screen.getByText(/Identity & Passport Details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First \/ Given Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nationality/i)).toHaveValue('India');

    const passportInput = screen.getByLabelText(/Passport Number/i);
    await user.type(passportInput, 'ab1234567');

    expect(passportInput).toHaveValue('AB1234567');
    expect(actor.getSnapshot().context.answers.passportNumber).toBe('AB1234567');
  });

  it('shows expiry warning when passport validity is <6 months and requires confirmation', async () => {
    const user = userEvent.setup();
    const nearExpiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { actor } = renderIdentity({
      firstName: 'Rahul',
      lastName: 'Sharma',
      dateOfBirth: '1995-05-15',
      gender: 'male',
      nationality: 'India',
      passportNumber: 'AA1234567',
      passportIssueDate: '2020-01-01',
      passportExpiryDate: nearExpiryDate,
    });

    expect(screen.getByText(/Passport Validity Alert/i)).toBeInTheDocument();

    const continueBtn = screen.getByRole('button', { name: /Continue to Contact & Address/i });
    await user.click(continueBtn);

    // Should stay on identity step and show error summary because confirmation checkbox was not checked
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(actor.getSnapshot().context.currentStepId).toBe('visa-selection');

    // Confirm checkbox
    const confirmCheckbox = screen.getByRole('checkbox');
    await user.click(confirmCheckbox);

    // Retry continue
    await user.click(continueBtn);
    expect(actor.getSnapshot().context.currentStepId).toBe('personal-identity');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderIdentity();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
