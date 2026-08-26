import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  processAndStoreDocument,
  retrieveStoredDocument,
  removeStoredDocument,
  checkStoredDocumentExists,
  InvalidDocumentError,
} from './storage';

// In-memory mock store for IndexedDB
const memoryStore = new Map<string, Blob>();

vi.mock('../../persistence/documents', () => ({
  saveDocument: vi.fn(async (id: string, blob: Blob) => {
    memoryStore.set(id, blob);
  }),
  getDocument: vi.fn(async (id: string) => memoryStore.get(id)),
  deleteDocument: vi.fn(async (id: string) => {
    memoryStore.delete(id);
  }),
  hasDocument: vi.fn(async (id: string) => memoryStore.has(id)),
}));

describe('Document Storage Adapter', () => {
  beforeEach(() => {
    memoryStore.clear();
    vi.clearAllMocks();
  });

  it('rejects unsupported file formats', async () => {
    const invalidFile = new File(['text'], 'resume.docx', { type: 'application/msword' });
    await expect(processAndStoreDocument(invalidFile, 'resume.docx', 'passport')).rejects.toThrow(
      InvalidDocumentError,
    );
  });

  it('rejects oversized files exceeding 10MB', async () => {
    const hugeBlob = new Blob([new Uint8Array(11 * 1024 * 1024)], { type: 'application/pdf' });
    await expect(processAndStoreDocument(hugeBlob, 'huge.pdf', 'passport')).rejects.toThrow(
      InvalidDocumentError,
    );
  });

  it('processes, compresses and persists valid PDF documents', async () => {
    const pdfBlob = new Blob(['%PDF-1.4 test'], { type: 'application/pdf' });
    const { attachment, quality, blob } = await processAndStoreDocument(
      pdfBlob,
      'statement.pdf',
      'bank_statement',
    );

    expect(attachment.docId).toBeDefined();
    expect(attachment.slotId).toBe('bank_statement');
    expect(attachment.fileName).toBe('statement.pdf');
    expect(quality.isBlurry).toBe(false);
    expect(blob.size).toBe(pdfBlob.size);

    // Verify retrieval
    const retrieved = await retrieveStoredDocument(attachment.docId);
    expect(retrieved).toBeDefined();

    // Verify existence
    expect(await checkStoredDocumentExists(attachment.docId)).toBe(true);

    // Verify deletion
    await removeStoredDocument(attachment.docId);
    expect(await checkStoredDocumentExists(attachment.docId)).toBe(false);
  });
});
