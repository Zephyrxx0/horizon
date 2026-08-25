import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { VisaSpecificStep } from './VisaSpecificStep';
import { wizardMachine } from '../wizard/machine';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';

describe('VisaSpecificStep Component (Stage 2c)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderSpecific(initialAnswers = {}) {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = () => {};

    const utils = render(
      <WizardContext.Provider value={{ actor, controller, resetDraft }}>
        <VisaSpecificStep />
      </WizardContext.Provider>,
    );

    return { ...utils, actor };
  }

  it('progressively discloses tourist fields when category is tourist', () => {
    renderSpecific({
      visaCategory: 'tourist',
      visaName: 'B1/B2 Visitor Visa',
      destinationCountry: 'USA',
    });

    expect(screen.getByLabelText(/Planned Arrival Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hotel Name or Stay Address/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Admitting College \/ University/i)).not.toBeInTheDocument();
  });

  it('progressively discloses student fields when category is student', () => {
    renderSpecific({
      visaCategory: 'student',
      visaName: 'F1 Student Visa',
      destinationCountry: 'USA',
    });

    expect(screen.getByLabelText(/Admitting College \/ University/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SEVIS ID \/ CAS Reference Number/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Hotel Name or Stay Address/i)).not.toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderSpecific({
      visaCategory: 'student',
      visaName: 'F1 Student Visa',
      destinationCountry: 'USA',
      institutionName: 'Stanford University',
      sevisOrCasNumber: 'N0012345678',
      travelStartDate: '2026-09-01',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
