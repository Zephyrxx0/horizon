import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DocumentPreviewSheet } from '../documents/DocumentPreviewSheet';
import type { DocumentAttachment } from '../documents/types';
import type { StageSummaryField } from './types';
import { Edit2, FileText, CheckCircle2, Eye } from 'lucide-react';

export interface StageReviewCardProps {
  stageNumber: number;
  stageTitle: string;
  stageSubtitle?: string;
  fields: StageSummaryField[];
  documents?: Record<string, DocumentAttachment>;
  onEdit: () => void;
  editAriaLabel?: string;
  disabled?: boolean;
}

export function StageReviewCard({
  stageNumber,
  stageTitle,
  stageSubtitle,
  fields,
  documents,
  onEdit,
  editAriaLabel,
  disabled = false,
}: StageReviewCardProps) {
  const [activePreviewDoc, setActivePreviewDoc] = useState<DocumentAttachment | null>(null);

  const docEntries = documents ? Object.entries(documents) : [];

  return (
    <>
      <Card className="p-5 sm:p-6 space-y-4 border border-[var(--color-border)] bg-white shadow-xs">
        {/* Header with Stage info and Edit action */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#EEF0FB] text-[var(--color-indigo-primary)]">
                Stage {stageNumber}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                {stageTitle}
              </h2>
            </div>
            {stageSubtitle && (
              <p className="text-xs text-[var(--color-ink-muted)]">{stageSubtitle}</p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            disabled={disabled}
            className="min-h-[40px] px-3 py-1.5 text-xs sm:text-sm font-semibold shrink-0"
            aria-label={editAriaLabel || `Edit Stage ${stageNumber}: ${stageTitle}`}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
            Edit
          </Button>
        </div>

        {/* Key-Value Summary Fields */}
        {fields.length > 0 && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {fields.map((f, i) => (
              <div key={i} className="flex flex-col">
                <dt className="text-xs font-semibold text-[var(--color-ink-muted)]">{f.label}</dt>
                <dd className="text-sm font-medium text-[var(--color-ink)] mt-0.5 break-words">
                  {f.value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Document Attachments List (Stage 3) */}
        {docEntries.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Attached Documents ({docEntries.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docEntries.map(([key, doc]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <FileText
                      className="w-4 h-4 text-[var(--color-indigo-primary)] shrink-0"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--color-ink)] truncate max-w-[150px] sm:max-w-[180px]">
                        {doc.fileName}
                      </p>
                      <p className="text-[11px] text-[var(--color-ink-muted)]">
                        {(doc.compressedSize / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[#F0FDF4] text-[var(--color-success)]">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePreviewDoc(doc)}
                      className="p-1 rounded hover:bg-gray-200 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label={`Preview ${doc.fileName}`}
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Document Inspection Sheet */}
      {activePreviewDoc && (
        <DocumentPreviewSheet
          isOpen={true}
          onClose={() => setActivePreviewDoc(null)}
          attachment={activePreviewDoc}
        />
      )}
    </>
  );
}
