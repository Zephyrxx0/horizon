import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from '@xstate/react';
import { Upload, FileText, CheckCircle2, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useWizardActor } from '../context';
import { compressToBudget } from '../../../persistence/compress';
import {
  saveDocument,
  hasDocument,
  deleteDocument,
  getStorageEstimate,
  requestPersistentStorage,
} from '../../../persistence/documents';
import { useToast } from '../../../components/ui/Toast';

export interface DocumentMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_RAW_BYTES = 5 * 1024 * 1024; // 5MB

export function DocumentStep() {
  const actor = useWizardActor();
  const { show } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [verifiedDocIds, setVerifiedDocIds] = useState<Record<string, boolean>>({});

  const rawDocs = useSelector(actor, (s) => s.context.answers.documents);
  const documents = useMemo(() => (rawDocs as DocumentMetadata[]) || [], [rawDocs]);

  // Check storage quota estimate on mount
  useEffect(() => {
    getStorageEstimate().then((est) => {
      if (est && est.quota > 0 && est.usage / est.quota > 0.8) {
        setQuotaWarning(true);
      }
    });
  }, []);

  // Verify blob presence in IndexedDB on mount and whenever documents change
  useEffect(() => {
    let active = true;
    async function checkDocs() {
      const results: Record<string, boolean> = {};
      for (const doc of documents) {
        results[doc.id] = await hasDocument(doc.id);
      }
      if (active) {
        setVerifiedDocIds(results);
      }
    }
    checkDocs();
    return () => {
      active = false;
    };
  }, [documents]);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Pre-validation: size <= 5MB
    if (file.size > MAX_RAW_BYTES) {
      show({
        kind: 'error',
        message: 'File exceeds 5MB limit. Please choose a smaller photo or document.',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 1b. Pre-validation: MIME type
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(jpe?g|png|pdf)$/i)) {
      show({
        kind: 'error',
        message: 'Only JPG, PNG, and PDF files are supported.',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      // 2. Client-side Canvas compression for images
      const compressedBlob = await compressToBudget(file);

      // 3. Persist blob to IndexedDB at selection time
      await saveDocument(docId, compressedBlob);

      // Request persistent storage opportunistically (fire and forget)
      requestPersistentStorage().catch(() => {});

      // 4. Update wizard machine context with METADATA only
      const newMeta: DocumentMetadata = {
        id: docId,
        name: file.name,
        size: compressedBlob.size,
        type: compressedBlob.type,
      };

      const updatedDocs = [...documents, newMeta];
      actor.send({ type: 'ANSWER_CHANGED', fieldId: 'documents', value: updatedDocs });

      setVerifiedDocIds((prev) => ({ ...prev, [docId]: true }));
      show({ kind: 'success', message: 'Document saved securely on this device.' });
    } catch (err) {
      console.error('[DocumentStep] Upload or storage failed:', err);
      show({
        kind: 'error',
        message:
          "We couldn't save your changes. Your browser storage may be full or unavailable. Free up space, then tap Retry.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      const updated = documents.filter((d) => d.id !== id);
      actor.send({ type: 'ANSWER_CHANGED', fieldId: 'documents', value: updated });
      setVerifiedDocIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error('[DocumentStep] Failed to delete document:', err);
      show({ kind: 'error', message: 'Failed to remove document from storage.' });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--color-ink)]">Supporting Documents</h3>

      {/* Quota Warning Banner */}
      {quotaWarning && (
        <div
          role="alert"
          className="p-3.5 rounded-[var(--radius-input)] bg-[var(--color-saffron-deep)]/10 border border-[var(--color-saffron-deep)] text-[var(--color-ink)] text-sm leading-relaxed"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle
              className="w-5 h-5 text-[var(--color-saffron-deep)] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p>
              Storage is running low. Documents are compressed before saving, but if storage fills
              up, new uploads won't be saved. Remove old files or free up device space.
            </p>
          </div>
        </div>
      )}

      {/* Upload button area */}
      <div className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-indigo-primary)] rounded-[var(--radius-card)] p-6 bg-white flex flex-col items-center justify-center text-center transition-colors duration-150">
        <input
          ref={fileInputRef}
          type="file"
          id="doc-upload-input"
          accept=".jpg,.jpeg,.png,.pdf"
          capture="environment"
          onChange={handleFileSelected}
          disabled={uploading}
          className="sr-only"
        />
        <label
          htmlFor="doc-upload-input"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-selected-bg)] text-[var(--color-indigo-primary)] flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="w-6 h-6" aria-hidden="true" />
            )}
          </div>
          <span className="font-semibold text-[var(--color-indigo-primary)] text-base">
            {uploading ? 'Compressing & saving…' : 'Attach photo or passport copy'}
          </span>
          <span className="text-xs text-[var(--color-ink-muted)]">
            JPG, PNG, or PDF up to 5MB (compressed to ≤2MB)
          </span>
        </label>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <ul className="space-y-2 pt-2">
          {documents.map((doc) => {
            const isReady = verifiedDocIds[doc.id];
            const sizeKb = Math.round(doc.size / 1024);

            return (
              <li
                key={doc.id}
                className="p-3.5 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText
                    className="w-5 h-5 text-[var(--color-indigo-primary)] shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[var(--color-ink)] truncate">
                      {doc.name}
                    </span>
                    <span className="text-xs text-[var(--color-ink-muted)]">{sizeKb} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isReady ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Checking…</span>
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label={`Remove ${doc.name}`}
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 rounded-full text-[var(--color-ink-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
