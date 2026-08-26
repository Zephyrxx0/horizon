import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClearDataModal } from './ClearDataModal';
import { ToastProvider } from '../../components/ui/Toast';
import * as cleanupModule from '../../persistence/cleanup';

describe('ClearDataModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithToast = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  it('renders modal when isOpen is true with disabled wipe button initially', () => {
    renderWithToast(<ClearDataModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Clear Draft & Public Computer Reset/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Important for Cyber-Café & Shared Computer Users/i),
    ).toBeInTheDocument();

    const wipeBtn = screen.getByTestId('confirm-wipe-btn');
    expect(wipeBtn).toBeDisabled();
  });

  it('enables wipe button after checking risk confirmation and calls clearAllDraftData on click', async () => {
    const clearSpy = vi.spyOn(cleanupModule, 'clearAllDraftData').mockResolvedValue(undefined);
    const handleClose = vi.fn();
    const handleCleared = vi.fn();

    renderWithToast(
      <ClearDataModal isOpen={true} onClose={handleClose} onCleared={handleCleared} />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const wipeBtn = screen.getByTestId('confirm-wipe-btn');
    expect(wipeBtn).not.toBeDisabled();

    fireEvent.click(wipeBtn);

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(handleCleared).toHaveBeenCalledTimes(1);
    });
  });

  it('triggers backup callback when backup draft action is clicked', () => {
    const handleBackup = vi.fn();
    const handleClose = vi.fn();

    renderWithToast(
      <ClearDataModal isOpen={true} onClose={handleClose} onOpenBackup={handleBackup} />,
    );

    const backupBtn = screen.getByRole('button', { name: /Backup Draft/i });
    fireEvent.click(backupBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleBackup).toHaveBeenCalledTimes(1);
  });
});
