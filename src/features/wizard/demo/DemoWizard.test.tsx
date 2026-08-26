import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { createActor } from 'xstate';
import { DemoWizard } from './DemoWizard';
import { wizardMachine } from '../machine';
import { WizardContext } from '../context';
import { ToastProvider } from '../../../components/ui/Toast';
import { createAutosaveController } from '../../../persistence/autosave';
import {
  saveAnswersEnvelope,
  loadAnswersEnvelope,
  clearAnswersEnvelope,
} from '../../../persistence/answers';

describe('DemoWizard Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderWizard() {
    const envelope = loadAnswersEnvelope();
    const actor = createActor(
      wizardMachine,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      envelope?.snapshot ? { snapshot: envelope.snapshot as any } : undefined,
    ).start();

    const flush = () => {
      return saveAnswersEnvelope({
        schemaVersion: 1,
        savedAt: Date.now(),
        snapshot: actor.getPersistedSnapshot(),
      });
    };

    const controller = createAutosaveController({ flush, delayMs: 100 });
    let isResetting = false;
    actor.subscribe(() => {
      if (!isResetting) controller.scheduleEdit();
    });

    const resetDraft = () => {
      isResetting = true;
      clearAnswersEnvelope();
      actor.send({ type: 'RESET' });
    };

    return render(
      <ToastProvider>
        <WizardContext.Provider value={{ actor, controller, resetDraft }}>
          <DemoWizard />
        </WizardContext.Provider>
      </ToastProvider>,
    );
  }

  it('completes Step 1 and restores values after unmount/remount', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWizard();

    // Select Tourism option
    const touristOption = screen.getByRole('radio', { name: /tourism & sightseeing/i });
    await user.click(touristOption);

    // Wait for debounced autosave (100ms in test)
    await new Promise((r) => setTimeout(r, 150));

    expect(screen.getByText('Saved')).toBeInTheDocument();

    // Verify localStorage has persisted snapshot
    const stored = loadAnswersEnvelope();
    expect(stored).not.toBeNull();

    // Unmount and remount fresh from storage
    unmount();
    renderWizard();

    expect(screen.getByRole('radio', { name: /tourism & sightseeing/i })).toBeChecked();
  });

  it('clears draft and resets form via Sheet confirmation', async () => {
    const user = userEvent.setup();
    renderWizard();

    // Choose option and go to review
    const touristOption = screen.getByRole('radio', { name: /tourism & sightseeing/i });
    await user.click(touristOption);

    const continueBtn = screen.getByRole('button', { name: /continue application/i });
    await user.click(continueBtn);

    // Enter passport
    const passportInput = screen.getByRole('textbox', { name: /passport number/i });
    await user.type(passportInput, 'AB1234567');

    const continueToReview = screen.getByRole('button', { name: /continue application/i });
    await user.click(continueToReview);

    // Click clear draft
    const clearDraftBtn = screen.getByRole('button', { name: /clear saved draft/i });
    await user.click(clearDraftBtn);

    // Confirm dialog appears
    const confirmBtn = screen.getByRole('button', { name: /yes, delete my draft/i });
    await user.click(confirmBtn);

    // Storage is cleared
    expect(loadAnswersEnvelope()).toBeNull();
  });
});
