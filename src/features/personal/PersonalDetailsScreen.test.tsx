import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { PersonalDetailsScreen } from './PersonalDetailsScreen';
import { wizardMachine } from '../wizard/machine';
import type { StepId } from '../wizard/types';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';

describe('PersonalDetailsScreen Orchestrator', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderScreen(initialStep: StepId = 'personal-identity') {
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: initialStep });

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = () => {};

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <PersonalDetailsScreen />
      </WizardContext.Provider>,
    );

    return { ...utils, actor };
  }

  it('renders sub-step 2a (Identity) when currentStepId is personal-identity', () => {
    renderScreen('personal-identity');
    expect(screen.getByText(/Identity & Passport Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 2a of 5/i)).toBeInTheDocument();
  });

  it('renders sub-step 2b (Contact) when currentStepId is personal-contact', () => {
    renderScreen('personal-contact');
    expect(screen.getByText(/Contact & Residential Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 2b of 5/i)).toBeInTheDocument();
  });

  it('renders sub-step 2c (Visa Details) when currentStepId is personal-details', () => {
    renderScreen('personal-details');
    expect(screen.getByText(/Stage 2c of 5/i)).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderScreen('personal-identity');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
