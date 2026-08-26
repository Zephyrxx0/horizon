import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { processAndStoreDocument, removeStoredDocument } from './storage';
import { StatusBadge } from './StatusBadge';
import { QualityWarningCard } from './QualityWarningCard';
import type {
  DocumentAttachment,
  DocumentSlotId,
  DocumentSubSlotDefinition,
  QualityAssessmentResult,
} from './types';

export interface DocumentSubSlotProps {
  parentSlotId: DocumentSlotId;
  subSlot: DocumentSubSlotDefinition;
  attachment?: DocumentAttachment | null;
  onAttachmentChange: (attachment: DocumentAttachment) => void;
  onAttachmentRemove: (docId: string) => void;
  onInspect?: (attachment: DocumentAttachment) => void;
}

export const DocumentSubSlot: React.FC<DocumentSubSlotProps> = ({
  parentSlotId,
  subSlot,
  attachment,
  onAttachmentChange,
  onAttachmentRemove,
  onInspect,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [qualityResult, setQualityResult] = useState<QualityAssessmentResult | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      setIsOptimizing(true);
      setErrorMessage(null);

      const result = await processAndStoreDocument(file, file.name, parentSlotId, subSlot.id);

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
    // Reset input value so re-selecting same file triggers onChange
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

  const handleRemove = async () => {
    if (attachment) {
      try {
        await removeStoredDocument(attachment.docId);
      } catch {
        // Continue removing from state even if storage deletion fails
      }
      onAttachmentRemove(attachment.docId);
      setQualityResult(null);
      setErrorMessage(null);
    }
  };

  const handleAcknowledgeWarning = () => {
    if (attachment) {
      const updated: DocumentAttachment = {
        ...attachment,
        isBlurWarningAcknowledged: true,
      };
      onAttachmentChange(updated);
    }
  };

  const status = isOptimizing
    ? 'optimizing'
    : errorMessage
      ? 'error'
      : attachment
        ? 'ready'
        : 'idle';

  return (
    <div
      className={`p-4 bg-gray-50/70 border rounded-xl space-y-3 transition-colors ${
        isDragOver ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{subSlot.title}</h4>
          <p className="text-xs text-gray-600 mt-0.5">{subSlot.description}</p>
        </div>
      </div>

      {/* Upload Triggers (shown when no attachment or optimizing) */}
      {!attachment && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-950 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            >
              <Camera className="w-4 h-4" aria-hidden="true" />
              <span>📷 Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <Upload className="w-4 h-4 text-gray-600" aria-hidden="true" />
              <span>📁 Upload File / PDF</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-500 hidden sm:block">
            Or drag & drop your file here (JPG, PNG, PDF up to 10MB)
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
        id={`camera-${parentSlotId}-${subSlot.id}`}
        aria-label={`Take photo for ${subSlot.title}`}
        onChange={handleInputChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="sr-only"
        id={`file-${parentSlotId}-${subSlot.id}`}
        aria-label={`Upload file or PDF for ${subSlot.title}`}
        onChange={handleInputChange}
      />

      {/* Status Badge */}
      <StatusBadge
        status={status}
        attachment={attachment}
        errorMessage={errorMessage || undefined}
        onReplace={() => fileInputRef.current?.click()}
        onRemove={handleRemove}
        onInspect={attachment && onInspect ? () => onInspect(attachment) : undefined}
      />

      {/* Quality Warning Card if applicable */}
      {attachment?.isBlurWarning && (
        <QualityWarningCard
          warnings={qualityResult?.warnings}
          onRetake={() => cameraInputRef.current?.click()}
          onAcknowledge={handleAcknowledgeWarning}
          isAcknowledged={attachment.isBlurWarningAcknowledged}
        />
      )}
    </div>
  );
};
