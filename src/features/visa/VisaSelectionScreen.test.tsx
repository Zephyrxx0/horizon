import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { VisaSelectionScreen } from './VisaSelectionScreen';
import { wizardMachine } from '../wizard/machine';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';

describe('VisaSelectionScreen Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderScreen(initialAnswers = {}) {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = () => {};

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <VisaSelectionScreen />
      </WizardContext.Provider>,
    );

    return { ...utils, actor };
  }

  it('renders destination dropdown, available visa options list, and open details panel', () => {
    renderScreen();

    expect(screen.getByText(/Select Your Visa & Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Where are you traveling to\?/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /B1\/B2 Visitor Visa/i })).toBeInTheDocument();
    expect(screen.getByText('Official Fee Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Required Documents Checklist')).toBeInTheDocument();
  });

  it('updates visa list and open details when destination changes', async () => {
    const user = userEvent.setup();
    const { actor } = renderScreen();

    // Change destination to UK
    const select = screen.getByLabelText(/Where are you traveling to\?/i);
    await user.selectOptions(select, 'UK');

    expect(screen.getByRole('radio', { name: /Standard Visitor Visa/i })).toBeInTheDocument();
    expect(actor.getSnapshot().context.answers.destinationCountry).toBe('UK');
  });

  it('selects visa option on click and updates active selection', async () => {
    const user = userEvent.setup();
    const { actor } = renderScreen();

    const f1Card = screen.getByRole('radio', { name: /F1 Student Visa/i });
    await user.click(f1Card);

    expect(actor.getSnapshot().context.answers.visaId).toBe('usa-f1');
    expect(f1Card).toHaveAttribute('aria-checked', 'true');
  });

  it('advances machine step to personal-identity on continue', async () => {
    const user = userEvent.setup();
    const { actor } = renderScreen();

    const continueBtn = screen.getByRole('button', { name: /Continue to Personal Details/i });
    await user.click(continueBtn);

    expect(actor.getSnapshot().context.currentStepId).toBe('personal-identity');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
