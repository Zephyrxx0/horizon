import React, { useState } from 'react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { useToast } from '../../components/ui/Toast';
import { clearAllDraftData } from '../../persistence/cleanup';
import { AlertTriangle, Trash2, Key, HardDrive } from 'lucide-react';

export interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCleared?: () => void;
  onOpenBackup?: () => void;
}

export const ClearDataModal: React.FC<ClearDataModalProps> = ({
  isOpen,
  onClose,
  onCleared,
  onOpenBackup,
}) => {
  const { show: showToast } = useToast();
  const [confirmedRisk, setConfirmedRisk] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const handleClear = async () => {
    if (!confirmedRisk) return;

    setIsPurging(true);
    try {
      await clearAllDraftData();
      showToast({
        kind: 'success',
        message: 'All local draft data and documents have been securely purged.',
      });
      setIsPurging(false);
      setConfirmedRisk(false);
      onClose();
      onCleared?.();
    } catch {
      setIsPurging(false);
      showToast({
        kind: 'error',
        message: 'An error occurred while wiping local storage. Please try again.',
      });
    }
  };

  const handleClose = () => {
    setConfirmedRisk(false);
    onClose();
  };

  return (
    <Sheet
      open={isOpen}
      onClose={handleClose}
      title="Clear Draft & Public Computer Reset"
      description="Safely wipe all personal information and uploaded files from this browser."
    >
      <div className="space-y-5 pt-1" data-testid="clear-data-modal">
        {/* Warning Callout */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm space-y-1">
            <span className="font-bold block text-amber-900">
              Important for Cyber-Café & Shared Computer Users
            </span>
            <p className="text-xs text-amber-800 leading-relaxed">
              Wiping your local storage ensures the next user on this computer cannot view your
              passport number, personal details, or uploaded documents.
            </p>
          </div>
        </div>

        {/* What gets cleared list */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2.5">
          <span className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-[var(--color-ink-muted)]" />
            What will be permanently deleted:
          </span>
          <ul className="text-xs text-[var(--color-ink-muted)] space-y-1.5 list-disc list-inside">
            <li>All personal, contact, and passport details entered so far.</li>
            <li>All uploaded passport scans, photographs, and PDF attachments.</li>
            <li>Local browser caching and auto-save checkpoints.</li>
          </ul>
        </div>

        {/* Optional Backup Prompt */}
        {onOpenBackup && (
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0" />
              <span className="text-xs font-medium text-indigo-950">
                Want to resume your application later on another device?
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBackup();
              }}
              className="text-xs font-bold text-[var(--color-indigo-primary)] hover:underline whitespace-nowrap"
            >
              Backup Draft
            </button>
          </div>
        )}

        {/* Step 1: Checkbox confirmation */}
        <div className="pt-2 border-t border-[var(--color-border)]">
          <Checkbox
            id="confirm-risk-wipe"
            checked={confirmedRisk}
            onChange={(e) => setConfirmedRisk(e.target.checked)}
            label={
              <span className="text-xs font-medium text-[var(--color-ink)]">
                I understand this will permanently delete all unsubmitted draft data from this
                browser.
              </span>
            }
          />
        </div>

        {/* Step 2: Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="w-full sm:w-1/2 min-h-[44px] text-sm"
          >
            Cancel & Keep Draft
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleClear}
            disabled={!confirmedRisk || isPurging}
            className="w-full sm:w-1/2 min-h-[44px] text-sm font-semibold flex items-center justify-center gap-1.5"
            data-testid="confirm-wipe-btn"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>{isPurging ? 'Purging...' : 'Permanently Wipe Data'}</span>
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
