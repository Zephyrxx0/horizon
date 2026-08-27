import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import App from './App';
import { wizardMachine } from './features/wizard/machine';
import { WizardContext } from './features/wizard/context';
import { createAutosaveController } from './persistence/autosave';

describe('App Shell', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the accessible shell with header and skip link', () => {
    const actor = createActor(wizardMachine).start();
    const controller = createAutosaveController({ flush: () => true });

    render(
      <WizardContext.Provider value={{ actor, controller, resetDraft: () => {} }}>
        <App />
      </WizardContext.Provider>,
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    const brand = screen.getByText('VisaReThink');
    expect(brand).toBeInTheDocument();
    expect(screen.getByTestId('header-track-btn')).toBeInTheDocument();
    expect(screen.getByTestId('header-backup-btn')).toBeInTheDocument();
  });

  it('renders LandingPage on root route / even when form has draft in progress', () => {
    window.location.hash = '#/';
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'personal-identity' });
    const controller = createAutosaveController({ flush: () => true });

    render(
      <WizardContext.Provider value={{ actor, controller, resetDraft: () => {} }}>
        <App />
      </WizardContext.Provider>,
    );

    expect(screen.getByText('Start New Application')).toBeInTheDocument();
  });

  it('renders ConfirmationScreen when currentStepId is confirmation on /apply route', () => {
    window.location.hash = '#/apply';
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'confirmation' });
    const controller = createAutosaveController({ flush: () => true });

    render(
      <WizardContext.Provider value={{ actor, controller, resetDraft: () => {} }}>
        <App />
      </WizardContext.Provider>,
    );

    expect(screen.getByTestId('stage5-confirmation-screen')).toBeInTheDocument();
    expect(screen.getByText('Application Submitted Successfully!')).toBeInTheDocument();
  });

  it('passes automated axe accessibility checks without violations', async () => {
    const actor = createActor(wizardMachine).start();
    const controller = createAutosaveController({ flush: () => true });

    const { container } = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft: () => {} }}>
        <App />
      </WizardContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
