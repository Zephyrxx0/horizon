/**
 * THROWAWAY demo surface — replaced by Phases 2–5.
 * Proves STATE-01, STATE-02, STATE-03, and UI design primitives end-to-end.
 */
import { useState } from 'react';
import { useSelector } from '@xstate/react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['common', 'wizard']);
  const actor = useWizardActor();
  const saveState = useSaveState();
  const resetDraft = useWizardReset();

  const answers = useSelector(actor, (s) => s.context.answers);
  const currentStepId = useSelector(actor, (s) => s.context.currentStepId);

  const [clearDraftOpen, setClearDraftOpen] = useState(false);

  const statuses = deriveStepStatuses(answers, currentStepId);
  const stepperSteps = DEMO_STEPS.map((s) => ({
    id: s.id,
    label: t(
      `wizard:steps.${s.id}` as
        'wizard:steps.trip' | 'wizard:steps.dependent' | 'wizard:steps.review',
      { defaultValue: s.label },
    ),
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
            {t('storage.heading')}
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-3">{t('storage.body')}</p>
          <Button
            variant="destructive"
            onClick={() =>
              actor.send({ type: 'ANSWER_CHANGED', fieldId: '_retry', value: Date.now() })
            }
            className="w-auto px-4 py-2 min-h-[44px]"
          >
            {t('storage.retry')}
          </Button>
        </div>
      )}

      {/* Empty State Banner when no answers */}
      {!hasAnyAnswers && currentStepId === 'trip' && (
        <Card className="bg-white border-l-4 border-l-[var(--color-indigo-primary)]">
          <h2 className="text-lg font-semibold text-[var(--color-ink)] mb-1">
            {t('empty.heading')}
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{t('empty.body')}</p>
        </Card>
      )}

      {/* Step 1: Trip Type */}
      {currentStepId === 'trip' && (
        <div className="space-y-6">
          <RadioCardGroup
            legend={t('wizard:trip.legend')}
            value={tripType}
            onChange={handleTripChange}
          >
            <RadioCard
              value="tourism"
              label={t('wizard:trip.options.tourism.label')}
              description={t('wizard:trip.options.tourism.desc')}
            />
            <RadioCard
              value="business"
              label={t('wizard:trip.options.business.label')}
              description={t('wizard:trip.options.business.desc')}
            />
            <RadioCard
              value="medical"
              label={t('wizard:trip.options.medical.label')}
              description={t('wizard:trip.options.medical.desc')}
            />
          </RadioCardGroup>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" disabled={!tripType} onClick={() => goTo('dependent')}>
              {t('actions.continue')}
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
              {t('wizard:dependent.needsAttention')}
            </div>
          )}

          <Field
            id="passport-number"
            invalid={Boolean(passportNumber && !isValidPassport(passportNumber))}
          >
            <FieldLabel>{t('wizard:dependent.passportLabel')}</FieldLabel>
            <Input
              value={passportNumber}
              onChange={handlePassportChange}
              placeholder={t('wizard:dependent.passportPlaceholder')}
              autoCapitalize="characters"
            />
            <FieldHint>{t('wizard:dependent.passportHint')}</FieldHint>
            {passportNumber && !isValidPassport(passportNumber) && (
              <FieldError>{t('wizard:dependent.passportError')}</FieldError>
            )}
          </Field>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => goTo('trip')}>
              {t('actions.back')}
            </Button>
            <Button
              variant="primary"
              disabled={!isValidPassport(passportNumber)}
              onClick={() => goTo('review')}
            >
              {t('actions.continue')}
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
              {t('wizard:review.title')}
            </h2>
            <dl className="divide-y divide-[var(--color-border)] text-sm">
              <div className="py-2.5 flex justify-between">
                <dt className="text-[var(--color-ink-muted)]">{t('wizard:review.tripType')}</dt>
                <dd className="font-semibold text-[var(--color-ink)] capitalize">
                  {tripType === 'tourism' && t('wizard:trip.options.tourism.label')}
                  {tripType === 'business' && t('wizard:trip.options.business.label')}
                  {tripType === 'medical' && t('wizard:trip.options.medical.label')}
                  {!tripType && t('wizard:review.notSpecified')}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[var(--color-ink-muted)]">
                  {t('wizard:review.passportNumber')}
                </dt>
                <dd className="font-mono font-semibold text-[var(--color-ink)]">
                  {passportNumber || t('wizard:review.notSpecified')}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-[var(--color-ink-muted)]">
                  {t('wizard:review.documentsAttached')}
                </dt>
                <dd className="font-semibold text-[var(--color-ink)]">
                  {documents.length} file{documents.length !== 1 ? 's' : ''}
                </dd>
              </div>
            </dl>
          </Card>

          <div className="flex flex-col gap-3 pt-4">
            <Button variant="secondary" onClick={() => goTo('dependent')}>
              {t('actions.back')}
            </Button>
            <Button variant="destructive" onClick={() => setClearDraftOpen(true)}>
              {t('clearDraft.trigger')}
            </Button>
          </div>
        </div>
      )}

      {/* Clear Draft Confirmation Sheet */}
      <Sheet
        open={clearDraftOpen}
        onClose={() => setClearDraftOpen(false)}
        title={t('clearDraft.title')}
        description={t('clearDraft.body')}
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="destructive"
            onClick={() => {
              resetDraft();
              setClearDraftOpen(false);
            }}
          >
            {t('clearDraft.confirm')}
          </Button>
          <Button variant="secondary" onClick={() => setClearDraftOpen(false)}>
            {t('clearDraft.cancel')}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
