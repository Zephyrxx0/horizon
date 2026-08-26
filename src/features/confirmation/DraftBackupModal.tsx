import React, { useState } from 'react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Field, FieldLabel, FieldHint, FieldError } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import { getService, PORTS, type IBackupService, type DraftBackupSnapshot } from '../../services';
import { copyToClipboard } from './share';
import {
  Key,
  Copy,
  Check,
  CloudDownload,
  CloudUpload,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export interface DraftBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'generate' | 'restore';
}

export const DraftBackupModal: React.FC<DraftBackupModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'generate',
}) => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);
  const { show } = useToast();

  const [mode, setMode] = useState<'generate' | 'restore'>(initialMode);
  const [emailInput, setEmailInput] = useState<string>((answers.email as string) || '');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [restoreCodeInput, setRestoreCodeInput] = useState<string>('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [pendingSnapshot, setPendingSnapshot] = useState<DraftBackupSnapshot | null>(null);

  const hasLocalAnswers = Object.keys(answers).length > 0;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      show({
        kind: 'error',
        message: 'Please provide an email address to receive your backup code.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const backupService = getService<IBackupService>(PORTS.backup);
      const res = await backupService.createBackup(emailInput, answers);
      if (res.status === 'success') {
        setGeneratedCode(res.data.code);
        show({
          kind: 'success',
          message: `Backup Code Created: ${res.data.code} sent to ${emailInput}`,
        });
      } else {
        show({
          kind: 'error',
          message: 'Unable to generate backup code at this time.',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    const success = await copyToClipboard(generatedCode);
    if (success) {
      setCopied(true);
      show({
        kind: 'success',
        message: 'Backup code copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreError(null);

    const cleanCode = restoreCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setRestoreError('Please enter your 8-character backup code.');
      return;
    }

    setIsRestoring(true);
    try {
      const backupService = getService<IBackupService>(PORTS.backup);
      const res = await backupService.restoreBackup(cleanCode);

      if (res.status === 'success') {
        if (hasLocalAnswers) {
          // Trigger conflict comparison dialog
          setPendingSnapshot(res.data);
        } else {
          // Direct apply
          applyRestoredSnapshot(res.data);
        }
      } else {
        setRestoreError('Backup code not found or expired. Please verify and try again.');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const applyRestoredSnapshot = (snapshot: DraftBackupSnapshot) => {
    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: snapshot.answers,
    });

    show({
      kind: 'success',
      message: 'Draft Restored! Your saved visa application draft has been loaded.',
    });

    setPendingSnapshot(null);
    setRestoreCodeInput('');
    onClose();
  };

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title={
        pendingSnapshot
          ? 'Conflict Detected — Existing Draft Found'
          : 'Cross-Device Draft Backup & Recovery'
      }
    >
      <div className="space-y-5 pt-2">
        {/* Conflict Comparison View */}
        {pendingSnapshot ? (
          <div className="space-y-4 animate-fadeIn" data-testid="conflict-comparison-view">
            <div className="p-4 rounded-[var(--radius-card)] bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle
                className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <strong className="block font-bold">Existing In-Progress Draft Detected</strong>
                <span>
                  This browser already contains application data. Replacing it will overwrite your
                  local answers with the restored backup.
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-[var(--radius-card)] bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-[var(--color-ink-muted)] block uppercase tracking-wider text-[10px]">
                  Current Local Draft
                </span>
                <p>
                  <strong>Passport:</strong> {(answers.passportNumber as string) || 'Not entered'}
                </p>
                <p>
                  <strong>Applicant:</strong> {(answers.givenNames as string) || 'Applicant'}{' '}
                  {(answers.surname as string) || ''}
                </p>
                <p>
                  <strong>Visa:</strong>{' '}
                  {(answers.visaName as string) || (answers.visaType as string) || 'Selected Visa'}
                </p>
              </div>

              <div className="p-3.5 rounded-[var(--radius-card)] bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1.5">
                <span className="font-bold text-[var(--color-indigo-primary)] block uppercase tracking-wider text-[10px]">
                  Restoring Remote Backup ({pendingSnapshot.code})
                </span>
                <p>
                  <strong>Passport:</strong>{' '}
                  {(pendingSnapshot.answers.passportNumber as string) || 'Not entered'}
                </p>
                <p>
                  <strong>Applicant:</strong>{' '}
                  {(pendingSnapshot.answers.givenNames as string) || 'Applicant'}{' '}
                  {(pendingSnapshot.answers.surname as string) || ''}
                </p>
                <p>
                  <strong>Visa:</strong>{' '}
                  {(pendingSnapshot.answers.visaName as string) ||
                    (pendingSnapshot.answers.visaType as string) ||
                    'Selected Visa'}
                </p>
              </div>
            </div>

            {/* Resolution CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Button
                variant="primary"
                onClick={() => applyRestoredSnapshot(pendingSnapshot)}
                className="flex-1 min-h-[48px] font-semibold text-sm"
                data-testid="confirm-replace-draft-btn"
              >
                Replace Local Draft with Backup
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPendingSnapshot(null)}
                className="flex-1 min-h-[48px] font-semibold text-sm"
                data-testid="cancel-replace-draft-btn"
              >
                Keep Current Local Draft
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-[var(--radius-input)] bg-[var(--color-surface-subtle)] p-1">
              <button
                type="button"
                onClick={() => setMode('generate')}
                className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-input)] transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'generate'
                    ? 'bg-[var(--color-surface-card)] text-[var(--color-ink)] shadow-xs'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
                data-testid="mode-tab-generate"
              >
                <CloudUpload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Generate Backup Code</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('restore')}
                className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-input)] transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'restore'
                    ? 'bg-[var(--color-surface-card)] text-[var(--color-ink)] shadow-xs'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
                data-testid="mode-tab-restore"
              >
                <CloudDownload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Restore from Code</span>
              </button>
            </div>

            {/* GENERATE BACKUP MODE */}
            {mode === 'generate' && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  Generate an 8-character backup code to save your application progress and safely
                  resume on another phone or computer.
                </p>

                {generatedCode ? (
                  <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-green-50,#F0FDF4)] border border-green-300 space-y-3 text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-800">
                      Your Unique Backup Code
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--color-green-success,#166534)] tracking-wider">
                      {generatedCode}
                    </div>
                    <p className="text-xs text-green-700">
                      A copy of this code was sent to <strong>{emailInput}</strong>.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleCopyCode}
                      className="w-full min-h-[44px] text-xs font-bold flex items-center justify-center gap-1.5 bg-white border-green-300 hover:bg-green-50"
                      data-testid="copy-backup-code-btn"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                          <span>Code Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy
                            className="w-3.5 h-3.5 text-[var(--color-ink-muted)]"
                            aria-hidden="true"
                          />
                          <span>Copy Backup Code</span>
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleGenerate} className="space-y-3">
                    <Field>
                      <FieldLabel>Email Address for Backup Notification</FieldLabel>
                      <FieldHint>We'll send your recovery code to this email.</FieldHint>
                      <Input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="applicant@example.com"
                        required
                        className="text-sm"
                        data-testid="backup-email-input"
                      />
                    </Field>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isGenerating}
                      className="w-full min-h-[48px] font-semibold text-sm flex items-center justify-center gap-2"
                      data-testid="create-backup-btn"
                    >
                      <Key className="w-4 h-4" aria-hidden="true" />
                      <span>{isGenerating ? 'Generating Code...' : 'Generate Backup Code'}</span>
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* RESTORE FROM CODE MODE */}
            {mode === 'restore' && (
              <form onSubmit={handleRestoreSubmit} className="space-y-4 animate-fadeIn">
                <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  Enter your 8-character backup code (e.g. <code>VR-784291</code> or demo{' '}
                  <code>VR-DEMO01</code>) to restore your saved application.
                </p>

                <Field invalid={Boolean(restoreError)}>
                  <FieldLabel>Enter Backup Code</FieldLabel>
                  <FieldHint>Case-insensitive 8-character code</FieldHint>
                  <Input
                    value={restoreCodeInput}
                    onChange={(e) => {
                      setRestoreCodeInput(e.target.value.toUpperCase());
                      if (restoreError) setRestoreError(null);
                    }}
                    placeholder="VR-XXXXXX"
                    maxLength={10}
                    className="font-mono text-base tracking-wider uppercase"
                    data-testid="restore-code-input"
                  />
                  {restoreError && <FieldError>{restoreError}</FieldError>}
                </Field>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isRestoring}
                  className="w-full min-h-[48px] font-semibold text-sm flex items-center justify-center gap-2"
                  data-testid="restore-submit-btn"
                >
                  <CloudDownload className="w-4 h-4" aria-hidden="true" />
                  <span>{isRestoring ? 'Restoring Draft...' : 'Restore Application Draft'}</span>
                </Button>
              </form>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] pt-3 border-t border-[var(--color-border)]">
              <ShieldCheck
                className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0"
                aria-hidden="true"
              />
              <span>Drafts are encrypted and accessible only with your unique code.</span>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
};
