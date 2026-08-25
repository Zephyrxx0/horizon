/**
 * THROWAWAY demo surface — replaced by Phases 2–5.
 * Proves STATE-01, STATE-02, STATE-03, and UI design primitives end-to-end.
 */
import { useState } from 'react';
import { useSelector } from '@xstate/react';
import { useWizardActor, useSaveState, useWizardReset } from '../context';
import { DEMO_STEPS, type StepId } from '../machine';
import { deriveStepStatuses, isValidPassport } from '../selectors';
import {
  Button,
  Field,
  FieldLabel,
  FieldHint,
  FieldError,
  Input,
  RadioCardGroup,
  RadioCard,
  ProgressStepper,
  Card,
  Sheet,
} from '../../../components/ui';
import { SaveIndicator } from '../../../components/SaveIndicator';
import { DocumentStep, type DocumentMetadata } from './DocumentStep';

export function DemoWizard() {
  const actor = useWizardActor();
  const saveState = useSaveState();
  const resetDraft = useWizardReset();

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  const [clearDraftOpen, setClearDraftOpen] = useState(false);

  const statuses = deriveStepStatuses(answers, currentStepId);
  const stepperSteps = DEMO_STEPS.map((s) => ({
    id: s.id,
    label: s.label,
    status: statuses[s.id],
  }));

  const tripType = answers.tripType as string | undefined;
  const passportNumber = (answers.passportNumber as string) || '';
  const documents = (answers.documents as DocumentMetadata[]) || [];

  const handleTripChange = (val: string) => {
    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'tripType', value: val });
  };

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actor.send({ type: 'ANSWER_CHANGED', fieldId: 'passportNumber', value: e.target.value });
  };

  const goTo = (stepId: StepId) => {
    actor.send({ type: 'GOTO', stepId });
  };

  const hasAnyAnswers = Object.keys(answers).length > 0;

  return (
    <div className="space-y-6">
      {/* Save indicator & progress bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <ProgressStepper steps={stepperSteps} className="max-w-[320px]" />
        <SaveIndicator
          state={saveState}
          onRetry={() =>
            actor.send({ type: 'ANSWER_CHANGED', fieldId: '_retry', value: Date.now() })
          }
        />
      </div>

      {/* Storage error warning block */}
      {saveState === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-[var(--radius-input)] bg-[var(--color-error)]/10 border border-[var(--color-error)] text-[var(--color-ink)]"
        >
          <h2 className="font-semibold text-[var(--color-error)] text-base mb-1">
            We couldn't save your changes
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-3">
            Your browser storage may be full or unavailable, so your latest edits aren't saved yet.
            Free up space, then tap Retry.
          </p>
          <Button
            variant="destructive"
            onClick={() =>
              actor.send({ type: 'ANSWER_CHANGED', fieldId: '_retry', value: Date.now() })
            }
            className="w-auto px-4 py-2 min-h-[44px]"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Empty State Banner when no answers */}
      {!hasAnyAnswers && currentStepId === 'trip' && (
        <Card className="bg-white border-l-4 border-l-[var(--color-indigo-primary)]">
          <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-1">
            Your application starts here
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            Answer at your own pace. Everything you enter is saved automatically on this device —
            leave any time and pick up where you stopped.
          </p>
        </Card>
      )}

      {/* Step 1: Trip Type */}
      {currentStepId === 'trip' && (
        <div className="space-y-6">
          <RadioCardGroup
            legend="What kind of trip are you planning?"
            value={tripType}
            onChange={handleTripChange}
          >
            <RadioCard
              value="tourism"
              label="Tourism & Sightseeing"
              description="For holidays, visiting friends or family, and casual visits."
            />
            <RadioCard
              value="business"
              label="Business & Commercial"
              description="For attending meetings, conferences, or setting up business."
            />
            <RadioCard
              value="medical"
              label="Medical Treatment"
              description="For short-term treatment in recognized Indian medical centers."
            />
          </RadioCardGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" disabled={!tripType} onClick={() => goTo('dependent')}>
              Continue application
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Passport & Identity (Dependent step) */}
      {currentStepId === 'dependent' && (
        <div className="space-y-6">
          {statuses.dependent === 'needs-attention' && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-[var(--color-saffron-deep)]/10 text-[var(--color-saffron-deep)] text-sm font-medium"
            >
              Trip selection was updated. Please re-verify your passport details.
            </div>
          )}

          <Field
            id="passport-number"
            invalid={Boolean(passportNumber && !isValidPassport(passportNumber))}
          >
            <FieldLabel>Passport Number</FieldLabel>
            <Input
              value={passportNumber}
              onChange={handlePassportChange}
              placeholder="e.g. AB1234567"
              autoCapitalize="characters"
            />
            <FieldHint>
              Enter 2 letters followed by 7 digits exactly as shown on your passport.
            </FieldHint>
            {passportNumber && !isValidPassport(passportNumber) && (
              <FieldError>
                Please enter a valid passport number (2 letters followed by 7 digits).
              </FieldError>
            )}
          </Field>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => goTo('trip')}>
              Back
            </Button>
            <Button
              variant="primary"
              disabled={!isValidPassport(passportNumber)}
              onClick={() => goTo('review')}
            >
              Continue application
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm (Includes Document Upload Step) */}
      {currentStepId === 'review' && (
        <div className="space-y-6">
          {/* Document Upload Surface */}
          <DocumentStep />

          {/* Application Summary */}
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-4">
              Application Summary
            </h2>
            <dl className="divide-y divide-[var(--color-border)] text-sm">
              <div className="py-2.5 flex justify-between">
                <dt className="text-[var(--color-ink-muted)]">Trip Type</dt>
                <dd className="font-semibold text-[var(--color-ink)] capitalize">
                  {tripType || 'Not specified'}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[var(--color-ink-muted)]">Passport Number</dt>
                <dd className="font-mono font-semibold text-[var(--color-ink)]">
                  {passportNumber || 'Not specified'}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[var(--color-ink-muted)]">Documents Attached</dt>
                <dd className="font-semibold text-[var(--color-ink)]">
                  {documents.length} file{documents.length !== 1 ? 's' : ''}
                </dd>
              </div>
            </dl>
          </Card>

          <div className="flex flex-col gap-3 pt-4">
            <Button variant="secondary" onClick={() => goTo('dependent')}>
              Back
            </Button>
            <Button variant="destructive" onClick={() => setClearDraftOpen(true)}>
              Clear saved draft
            </Button>
          </div>
        </div>
      )}

      {/* Clear Draft Confirmation Sheet */}
      <Sheet
        open={clearDraftOpen}
        onClose={() => setClearDraftOpen(false)}
        title="Clear everything you've entered?"
        description="This permanently deletes your saved answers and documents from this device. You'll start from the beginning."
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="destructive"
            onClick={() => {
              resetDraft();
              setClearDraftOpen(false);
            }}
          >
            Yes, delete my draft
          </Button>
          <Button variant="secondary" onClick={() => setClearDraftOpen(false)}>
            No, keep my draft
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
