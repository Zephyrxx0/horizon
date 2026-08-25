import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { createActor } from 'xstate';
import { DocumentStep } from './DocumentStep';
import { wizardMachine } from '../machine';
import { WizardContext } from '../context';
import { ToastProvider } from '../../../components/ui/Toast';
import { createAutosaveController } from '../../../persistence/autosave';

vi.mock('../../../persistence/compress', () => ({
  compressToBudget: vi.fn().mockImplementation(async (file: Blob) => file),
}));

vi.mock('../../../persistence/documents', () => ({
  saveDocument: vi.fn().mockResolvedValue(undefined),
  hasDocument: vi.fn().mockResolvedValue(true),
  deleteDocument: vi.fn().mockResolvedValue(undefined),
  getStorageEstimate: vi.fn().mockResolvedValue({ usage: 100, quota: 1000 }),
  requestPersistentStorage: vi.fn().mockResolvedValue(true),
}));

describe('DocumentStep component', () => {
  it('handles file upload and stores document metadata', async () => {
    const actor = createActor(wizardMachine).start();
    const controller = createAutosaveController({ flush: () => true });

    render(
      <ToastProvider>
        <WizardContext.Provider value={{ actor, controller, resetDraft: () => {} }}>
          <DocumentStep />
        </WizardContext.Provider>
      </ToastProvider>,
    );

    const input = document.getElementById('doc-upload-input') as HTMLInputElement;
    const file = new File(['test content'], 'passport-scan.png', { type: 'image/png' });

    const user = userEvent.setup();
    await user.upload(input, file);

    const docName = await screen.findByText('passport-scan.png');
    expect(docName).toBeInTheDocument();

    const readyBadge = await screen.findByText('Ready');
    expect(readyBadge).toBeInTheDocument();

    // Verify machine context has documents array
    const docs = actor.getSnapshot().context.answers.documents as Array<{ name: string }>;
    expect(docs).toHaveLength(1);
    expect(docs[0]?.name).toBe('passport-scan.png');
  });
});
