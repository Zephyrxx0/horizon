import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { ContactStep } from './ContactStep';
import { wizardMachine } from '../wizard/machine';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';

describe('ContactStep Component (Stage 2b)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderContact(initialAnswers = {}) {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = () => {};

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <ContactStep />
      </WizardContext.Provider>,
    );

    return { ...utils, actor };
  }

  it('renders all contact fields and auto-prefixes +91 on phone input', async () => {
    const user = userEvent.setup();
    const { actor } = renderContact();

    expect(screen.getByText(/Contact & Residential Address/i)).toBeInTheDocument();

    const phoneInput = screen.getByLabelText(/Mobile Phone Number/i);
    await user.type(phoneInput, '9876543210');

    expect(phoneInput).toHaveValue('+91 98765 43210');
    expect(actor.getSnapshot().context.answers.phone).toBe('+91 98765 43210');
  });

  it('validates required fields and shows error summary when continue clicked with empty fields', async () => {
    const user = userEvent.setup();
    const { actor } = renderContact();

    const continueBtn = screen.getByRole('button', { name: /Continue to Trip Details/i });
    await user.click(continueBtn);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Email Address:/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Address: Address line 1 is required/i }),
    ).toBeInTheDocument();
    expect(actor.getSnapshot().context.currentStepId).toBe('visa-selection');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderContact({
      email: 'aarav@example.com',
      phone: '+91 98765 43210',
      addressLine1: '123 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
