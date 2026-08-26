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

  it('renders destination dropdown, purpose options, and recommended visa card', () => {
    renderScreen();

    expect(screen.getByText(/Select Your Visa & Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Where are you traveling to\?/i)).toBeInTheDocument();
    expect(screen.getByText('Tourism & Leisure')).toBeInTheDocument();
    expect(screen.getByText('Business & Conferences')).toBeInTheDocument();
    expect(screen.getByText('B1/B2 Visitor Visa')).toBeInTheDocument();
    expect(screen.getByText(/Recommended for your trip/i)).toBeInTheDocument();
  });

  it('updates visa list and recommendation when destination or purpose changes', async () => {
    const user = userEvent.setup();
    const { actor } = renderScreen();

    // Change destination to UK
    const select = screen.getByLabelText(/Where are you traveling to\?/i);
    await user.selectOptions(select, 'UK');

    expect(screen.getByText('Standard Visitor Visa')).toBeInTheDocument();
    expect(actor.getSnapshot().context.answers.destinationCountry).toBe('UK');

    // Change purpose to Study
    const studyCard = screen.getByRole('radio', { name: /Education & Studies/i });
    await user.click(studyCard);

    expect(screen.getByText('Student Visa')).toBeInTheDocument();
    expect(actor.getSnapshot().context.answers.tripPurpose).toBe('study');
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
