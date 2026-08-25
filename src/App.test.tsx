import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import App from './App';
import { wizardMachine } from './features/wizard/machine';
import { WizardContext } from './features/wizard/context';
import { createAutosaveController } from './persistence/autosave';

describe('App Shell', () => {
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
