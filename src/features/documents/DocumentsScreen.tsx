import React, { useState } from 'react';
import { useSelector } from '@xstate/react';
import { ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardActor } from '../wizard/context';
import { Button } from '../../components/ui/Button';
import { ErrorSummary } from '../../components/ui/ErrorSummary';
import { DocumentSlotCard } from './DocumentSlotCard';
import { SampleGuidanceSheet } from './SampleGuidanceSheet';
import { DocumentPreviewSheet } from './DocumentPreviewSheet';
import { getDocumentSlotsForVisa } from './requirements';
import { downloadTemplate, type DocumentTemplateType } from './templates';
import { validateDocumentsStep } from '../wizard/validators';
import type { DocumentAttachment, DocumentSlotId } from './types';

export const DocumentsScreen: React.FC = () => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sampleGuideSlotId, setSampleGuideSlotId] = useState<DocumentSlotId | null>(null);
  const [inspectAttachment, setInspectAttachment] = useState<DocumentAttachment | null>(null);

  const visaId = String(answers.visaId || answers.visaType || 'us-tourist');
  const { mandatory, optional } = getDocumentSlotsForVisa(visaId);

  const documents = (answers.documents || {}) as Record<string, DocumentAttachment>;

  // Calculate mandatory ready count
  let totalMandatorySlots = 0;
  let readyMandatorySlots = 0;

  for (const slot of mandatory) {
    if (slot.subSlots && slot.subSlots.length > 0) {
      for (const sub of slot.subSlots) {
        totalMandatorySlots++;
        const subKey = `${slot.id}_${sub.id}`;
        const att = documents[subKey] || documents[sub.id];
        if (att && (!att.isBlurWarning || att.isBlurWarningAcknowledged)) {
          readyMandatorySlots++;
        }
      }
    } else {
      totalMandatorySlots++;
      const att = documents[slot.id];
      if (att && (!att.isBlurWarning || att.isBlurWarningAcknowledged)) {
        readyMandatorySlots++;
      }
    }
  }

  const isAllMandatoryReady = readyMandatorySlots >= totalMandatorySlots;

  const handleAttachmentChange = (attachment: DocumentAttachment) => {
    const key = attachment.subSlotId
      ? `${attachment.slotId}_${attachment.subSlotId}`
      : attachment.slotId;
    const updatedDocuments = {
      ...documents,
      [key]: attachment,
    };

    actor.send({
      type: 'ANSWER_CHANGED',
      fieldId: 'documents',
      value: updatedDocuments,
    });

    // Clear error for this slot if present
    if (errors[key] || errors[attachment.slotId]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[key];
      delete updatedErrors[attachment.slotId];
      setErrors(updatedErrors);
    }
  };

  const handleAttachmentRemove = (docId: string) => {
    const updatedDocuments = { ...documents };
    let removedKey: string | null = null;

    for (const [key, value] of Object.entries(updatedDocuments)) {
      if (value.docId === docId) {
        removedKey = key;
        break;
      }
    }

    if (removedKey) {
      delete updatedDocuments[removedKey];
      actor.send({
        type: 'ANSWER_CHANGED',
        fieldId: 'documents',
        value: updatedDocuments,
      });
    }
  };

  const handleContinue = () => {
    const stepErrors = validateDocumentsStep(answers);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    actor.send({ type: 'NEXT' });
  };

  const handleBack = () => {
    actor.send({ type: 'BACK' });
  };

  const errorItems = Object.entries(errors).map(([fieldId, message]) => ({
    fieldId: `doc-slot-${fieldId.split('_')[0]}`,
    message,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sticky Progress Summary Header */}
      <div className="sticky top-0 z-20 bg-[var(--color-surface-bg)]/95 backdrop-blur-sm p-4 border border-[var(--color-border)] rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="text-lg font-bold text-[var(--color-ink)]">
              Stage 3: Document Upload Pipeline
            </h1>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Attach high-resolution scans or mobile photos. All images are compressed client-side
              before submission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isAllMandatoryReady
                  ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20'
                  : 'bg-[var(--color-indigo-primary)]/10 text-[var(--color-indigo-primary)] border-[var(--color-indigo-primary)]/20'
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 ${isAllMandatoryReady ? 'text-[var(--color-success)]' : 'text-[var(--color-indigo-primary)]'}`}
                aria-hidden="true"
              />
              <span>
                Documents: {readyMandatorySlots} of {totalMandatorySlots} mandatory ready
              </span>
            </span>
          </div>
        </div>

        {/* Mini progress track */}
        <div
          className="w-full bg-[var(--color-surface-subtle)] rounded-full h-1.5 overflow-hidden"
          role="progressbar"
          aria-valuenow={readyMandatorySlots}
          aria-valuemin={0}
          aria-valuemax={totalMandatorySlots}
          aria-label="Mandatory documents upload progress"
        >
          <div
            className="bg-[var(--color-indigo-primary)] h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${totalMandatorySlots > 0 ? (readyMandatorySlots / totalMandatorySlots) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Accessible Error Summary if submission fails */}
      {errorItems.length > 0 && (
        <ErrorSummary
          errors={errorItems}
          title="Please fix the following document requirements before proceeding:"
        />
      )}

      {/* Section 1: Mandatory Documents */}
      <section aria-labelledby="mandatory-docs-heading" className="space-y-4">
        <div className="border-b border-[var(--color-border)] pb-2">
          <h2
            id="mandatory-docs-heading"
            className="text-base font-bold text-[var(--color-ink)] flex items-center gap-2"
          >
            <span>Mandatory Documents</span>
            <span className="text-xs font-medium text-[var(--color-error)] bg-[var(--color-error)]/10 px-2 py-0.5 rounded-full border border-[var(--color-error)]/20">
              Required for all applicants
            </span>
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
            These documents are strictly required by embassy consular processing.
          </p>
        </div>

        <div className="space-y-4">
          {mandatory.map((slot) => (
            <DocumentSlotCard
              key={slot.id}
              slot={slot}
              attachments={documents}
              onAttachmentChange={handleAttachmentChange}
              onAttachmentRemove={handleAttachmentRemove}
              onOpenSampleGuide={(id) => setSampleGuideSlotId(id as DocumentSlotId)}
              onDownloadTemplate={(t) => downloadTemplate(t as DocumentTemplateType)}
              onInspectDocument={setInspectAttachment}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Optional Supporting Documents */}
      {optional.length > 0 && (
        <section aria-labelledby="optional-docs-heading" className="space-y-4 pt-4">
          <div className="border-b border-[var(--color-border)] pb-2">
            <h2
              id="optional-docs-heading"
              className="text-base font-bold text-[var(--color-ink)] flex items-center gap-2"
            >
              <span>Optional Supporting Documents</span>
              <span className="text-xs font-medium text-[var(--color-ink-muted)] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
              Providing these documents strengthens your visa application and avoids consular
              delays.
            </p>
          </div>

          <div className="space-y-4">
            {optional.map((slot) => (
              <DocumentSlotCard
                key={slot.id}
                slot={slot}
                attachments={documents}
                onAttachmentChange={handleAttachmentChange}
                onAttachmentRemove={handleAttachmentRemove}
                onOpenSampleGuide={(id) => setSampleGuideSlotId(id as DocumentSlotId)}
                onDownloadTemplate={(t) => downloadTemplate(t as DocumentTemplateType)}
                onInspectDocument={setInspectAttachment}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Navigation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[var(--color-border)]">
        <Button
          type="button"
          variant="secondary"
          onClick={handleBack}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Personal Details</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 shadow-md"
        >
          <span>Continue to Review & Payment</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Modals & Sheets */}
      <SampleGuidanceSheet
        slotId={sampleGuideSlotId}
        isOpen={Boolean(sampleGuideSlotId)}
        onClose={() => setSampleGuideSlotId(null)}
      />

      <DocumentPreviewSheet
        attachment={inspectAttachment}
        isOpen={Boolean(inspectAttachment)}
        onClose={() => setInspectAttachment(null)}
      />
    </div>
  );
};
