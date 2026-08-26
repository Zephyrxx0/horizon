import React, { useRef, useState } from 'react';
import { Camera, Upload, HelpCircle, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { DocumentSubSlot } from './DocumentSubSlot';
import { StatusBadge } from './StatusBadge';
import { QualityWarningCard } from './QualityWarningCard';
import { processAndStoreDocument, removeStoredDocument } from './storage';
import type { DocumentAttachment, DocumentSlotDefinition, QualityAssessmentResult } from './types';

export interface DocumentSlotCardProps {
  slot: DocumentSlotDefinition;
  attachments?: Record<string, DocumentAttachment>;
  onAttachmentChange: (attachment: DocumentAttachment) => void;
  onAttachmentRemove: (docId: string) => void;
  onOpenSampleGuide?: (slotId: string) => void;
  onDownloadTemplate?: (templateType: string) => void;
  onInspectDocument?: (attachment: DocumentAttachment) => void;
}

export const DocumentSlotCard: React.FC<DocumentSlotCardProps> = ({
  slot,
  attachments = {},
  onAttachmentChange,
  onAttachmentRemove,
  onOpenSampleGuide,
  onDownloadTemplate,
  onInspectDocument,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [qualityResult, setQualityResult] = useState<QualityAssessmentResult | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single slot attachment lookup (if no sub-slots)
  const singleAttachment = attachments[slot.id] || null;

  const handleFile = async (file: File) => {
    try {
      setIsOptimizing(true);
      setErrorMessage(null);

      const result = await processAndStoreDocument(file, file.name, slot.id);
      setQualityResult(result.quality);
      onAttachmentChange(result.attachment);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to upload document.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveSingle = async () => {
    if (singleAttachment) {
      try {
        await removeStoredDocument(singleAttachment.docId);
      } catch {
        // Safe fallback
      }
      onAttachmentRemove(singleAttachment.docId);
      setQualityResult(null);
      setErrorMessage(null);
    }
  };

  const handleAcknowledgeWarning = () => {
    if (singleAttachment) {
      onAttachmentChange({
        ...singleAttachment,
        isBlurWarningAcknowledged: true,
      });
    }
  };

  const status = isOptimizing
    ? 'optimizing'
    : errorMessage
      ? 'error'
      : singleAttachment
        ? 'ready'
        : 'idle';

  return (
    <Card
      id={`doc-slot-${slot.id}`}
      className={`space-y-4 border transition-all ${
        isDragOver ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200'
      }`}
    >
      {/* Slot Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">{slot.title}</h3>
            {slot.isMandatory ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
                Required
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                Optional
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{slot.description}</p>
        </div>

        {/* Guidance and Template links */}
        <div className="flex flex-wrap items-center gap-2">
          {slot.sampleType && onOpenSampleGuide && (
            <button
              type="button"
              onClick={() => onOpenSampleGuide(slot.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-800 hover:text-indigo-950 p-2 min-h-[48px] rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View sample & tips</span>
            </button>
          )}

          {slot.templateType && onDownloadTemplate && (
            <button
              type="button"
              onClick={() => onDownloadTemplate(slot.templateType!)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-2 min-h-[48px] rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download template</span>
            </button>
          )}
        </div>
      </div>

      {/* Instructions list */}
      {slot.instructions.length > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700 space-y-1">
          <p className="font-semibold text-gray-900">Upload tips:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {slot.instructions.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sub-slots container (if multi-part document, e.g. passport) */}
      {slot.subSlots && slot.subSlots.length > 0 ? (
        <div className="space-y-3 pt-1">
          {slot.subSlots.map((sub) => {
            const subAttachment =
              attachments[`${slot.id}_${sub.id}`] || attachments[sub.id] || null;
            return (
              <DocumentSubSlot
                key={sub.id}
                parentSlotId={slot.id}
                subSlot={sub}
                attachment={subAttachment}
                onAttachmentChange={onAttachmentChange}
                onAttachmentRemove={onAttachmentRemove}
                onInspect={onInspectDocument}
              />
            );
          })}
        </div>
      ) : (
        /* Single slot upload area */
        <div
          className="space-y-3 pt-1"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {!singleAttachment && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-950 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                  <span>📷 Take Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <Upload className="w-4 h-4 text-gray-600" aria-hidden="true" />
                  <span>📁 Upload File / PDF</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500 hidden sm:block">
                Drag and drop your file here, or tap buttons above (JPG, PNG, PDF up to 10MB)
              </p>
            </div>
          )}

          {/* Hidden native inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/png"
            capture="environment"
            className="sr-only"
            id={`camera-${slot.id}`}
            aria-label={`Take photo for ${slot.title}`}
            onChange={handleInputChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="sr-only"
            id={`file-${slot.id}`}
            aria-label={`Upload file or PDF for ${slot.title}`}
            onChange={handleInputChange}
          />

          {/* Status Badge */}
          <StatusBadge
            status={status}
            attachment={singleAttachment}
            errorMessage={errorMessage || undefined}
            onReplace={() => fileInputRef.current?.click()}
            onRemove={handleRemoveSingle}
            onInspect={
              singleAttachment && onInspectDocument
                ? () => onInspectDocument(singleAttachment)
                : undefined
            }
          />

          {/* Quality Warning Card */}
          {singleAttachment?.isBlurWarning && (
            <QualityWarningCard
              warnings={qualityResult?.warnings}
              onRetake={() => cameraInputRef.current?.click()}
              onAcknowledge={handleAcknowledgeWarning}
              isAcknowledged={singleAttachment.isBlurWarningAcknowledged}
            />
          )}
        </div>
      )}
    </Card>
  );
};
