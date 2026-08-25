import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { ResumeBanner } from './ResumeBanner';
import { wizardMachine, type StepId } from '../features/wizard';
import { WizardContext } from '../features/wizard/context';
import { createAutosaveController } from '../persistence/autosave';

describe('ResumeBanner Component (STATE-04)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderBanner(initialAnswers = {}, currentStep: StepId = 'visa-selection') {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }
    actor.send({ type: 'GOTO', stepId: currentStep });

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = vi.fn();

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <ResumeBanner />
      </WizardContext.Provider>,
    );

    return { ...utils, actor, resetDraft };
  }

  it('renders nothing when there are no saved draft answers', () => {
    const { container } = renderBanner({});
    expect(container.firstChild).toBeNull();
  });

  it('renders banner when draft exists and user is on a different step', () => {
    renderBanner(
      {
        destinationCountry: 'USA',
        tripPurpose: 'tourism',
        visaId: 'usa-b1b2',
        visaName: 'B1/B2 Visitor Visa',
      },
      'visa-selection', // completed stage 1, but currently on visa-selection
    );

    expect(screen.getByText(/Saved Application Draft Found/i)).toBeInTheDocument();
    expect(screen.getByText(/B1\/B2 Visitor Visa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue Application/i })).toBeInTheDocument();
  });

  it('jumps to the first incomplete step when continue is clicked', () => {
    const { actor } = renderBanner(
      {
        destinationCountry: 'USA',
        tripPurpose: 'tourism',
        visaId: 'usa-b1b2',
      },
      'visa-selection',
    );

    const continueBtn = screen.getByRole('button', { name: /Continue Application/i });
    fireEvent.click(continueBtn);

    // Target step is personal-identity (Stage 2a)
    expect(actor.getSnapshot().context.currentStepId).toBe('personal-identity');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderBanner(
      {
        destinationCountry: 'USA',
        tripPurpose: 'tourism',
        visaId: 'usa-b1b2',
      },
      'visa-selection',
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
