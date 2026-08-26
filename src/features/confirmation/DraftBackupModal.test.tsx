import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { createActor } from 'xstate';
import { DraftBackupModal } from './DraftBackupModal';
import { wizardMachine } from '../wizard/machine';
import { WizardContext } from '../wizard/context';
import { createAutosaveController } from '../../persistence/autosave';
import { ToastProvider } from '../../components/ui/Toast';
import { setScenarios, resetScenarios } from '../../services/mock/scenarios';

describe('DraftBackupModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    setScenarios({ latencyMs: [1, 5] });
  });

  afterEach(() => {
    resetScenarios();
  });

  function renderModal(initialAnswers = {}, modalProps = {}) {
    const actor = createActor(wizardMachine).start();
    if (Object.keys(initialAnswers).length > 0) {
      actor.send({ type: 'ANSWERS_BATCHED', answers: initialAnswers });
    }

    const controller = createAutosaveController({ flush: () => true, delayMs: 100 });
    const resetDraft = vi.fn();

    const utils = render(
      <ToastProvider>
        <WizardContext.Provider value={{ actor, controller, resetDraft }}>
          <DraftBackupModal isOpen={true} onClose={vi.fn()} {...modalProps} />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    return { ...utils, actor };
  }

  it('renders modal in generate mode by default and creates a code', async () => {
    renderModal({ email: 'applicant@example.com', givenNames: 'Aarav' });

    expect(screen.getByText('Cross-Device Draft Backup & Recovery')).toBeInTheDocument();
    expect(screen.getByTestId('mode-tab-generate')).toBeInTheDocument();

    const createBtn = screen.getByTestId('create-backup-btn');
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText('Your Unique Backup Code')).toBeInTheDocument();
      expect(screen.getByTestId('copy-backup-code-btn')).toBeInTheDocument();
    });
  });

  it('switches to restore mode and restores seeded demo draft VR-DEMO01', async () => {
    const { actor } = renderModal({});

    const restoreTab = screen.getByTestId('mode-tab-restore');
    fireEvent.click(restoreTab);

    const input = screen.getByTestId('restore-code-input');
    fireEvent.change(input, { target: { value: 'VR-DEMO01' } });

    const submitBtn = screen.getByTestId('restore-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const answers = actor.getSnapshot().context.answers;
      expect(answers.givenNames).toBe('Priya');
      expect(answers.destinationCountry).toBe('United States');
    });
  });

  it('renders conflict comparison dialog when local answers already exist and confirms replace', async () => {
    const { actor } = renderModal({ givenNames: 'ExistingLocalUser', passportNumber: 'P1112233' });

    const restoreTab = screen.getByTestId('mode-tab-restore');
    fireEvent.click(restoreTab);

    const input = screen.getByTestId('restore-code-input');
    fireEvent.change(input, { target: { value: 'VR-DEMO01' } });

    const submitBtn = screen.getByTestId('restore-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('conflict-comparison-view')).toBeInTheDocument();
      expect(screen.getByText('Existing In-Progress Draft Detected')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByTestId('confirm-replace-draft-btn');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      const answers = actor.getSnapshot().context.answers;
      expect(answers.givenNames).toBe('Priya');
    });
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = renderModal({});
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
