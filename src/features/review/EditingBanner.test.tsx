import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { EditingBanner } from './EditingBanner';
import { WizardContext, type WizardContextValue } from '../wizard/context';
import { createActor, type ActorRefFrom } from 'xstate';
import { wizardMachine } from '../wizard/machine';
import type { AutosaveController } from '../../persistence/autosave';

function renderWithActor(actor: ActorRefFrom<typeof wizardMachine>) {
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

  return render(
    <WizardContext.Provider value={mockContext}>
      <EditingBanner />
    </WizardContext.Provider>,
  );
}

describe('EditingBanner', () => {
  it('renders nothing when returnToReview is false', () => {
    const actor = createActor(wizardMachine).start();
    const { container } = renderWithActor(actor);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders sticky editing banner when returnToReview is true on personal-identity', async () => {
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'personal-identity', returnToReview: true });

    const { container } = renderWithActor(actor);

    expect(screen.getByRole('region', { name: /editing mode banner/i })).toBeInTheDocument();
    expect(screen.getByText(/editing stage 2: identity & passport/i)).toBeInTheDocument();
    const returnBtn = screen.getByRole('button', { name: /return to review/i });
    expect(returnBtn).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('dispatches RETURN_TO_REVIEW on button click', async () => {
    const user = userEvent.setup();
    const actor = createActor(wizardMachine).start();
    actor.send({ type: 'GOTO', stepId: 'documents', returnToReview: true });

    renderWithActor(actor);

    const returnBtn = screen.getByRole('button', { name: /return to review/i });
    await user.click(returnBtn);

    expect(actor.getSnapshot().context.currentStepId).toBe('review-payment');
    expect(actor.getSnapshot().context.returnToReview).toBe(false);
  });
});
