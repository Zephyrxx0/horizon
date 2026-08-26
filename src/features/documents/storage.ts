import { compressToBudget } from '../../persistence/compress';
import {
  saveDocument,
  getDocument,
  deleteDocument,
  hasDocument,
} from '../../persistence/documents';
import { assessImageQuality } from './quality';
import type {
  DocumentAttachment,
  DocumentSlotId,
  DocumentSubSlotId,
  QualityAssessmentResult,
} from './types';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_ORIGINAL_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export class InvalidDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDocumentError';
  }
}

/**
 * Validates, assesses quality, compresses, and persists an uploaded file to IndexedDB.
 */
export async function processAndStoreDocument(
  file: File | Blob,
  fileName: string,
  slotId: DocumentSlotId,
  subSlotId?: DocumentSubSlotId,
): Promise<{
  attachment: DocumentAttachment;
  quality: QualityAssessmentResult;
  blob: Blob;
}> {
  // Validate MIME type
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new InvalidDocumentError(
      `File format "${file.type}" is not supported. Please upload a PDF, JPG, or PNG.`,
    );
  }

  // Validate uncompressed file size ceiling
  if (file.size > MAX_ORIGINAL_SIZE_BYTES) {
    throw new InvalidDocumentError(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit. Please choose a smaller file.`,
    );
  }

  // Assess blur and dimension heuristics
  const quality = await assessImageQuality(file);

  // Compress image client-side to ≤2MB budget (or bypass if already compliant/PDF)
  const compressedBlob = await compressToBudget(file, 2 * 1024 * 1024);

  // Unique document record key in IndexedDB
  const docId = `doc_${slotId}${subSlotId ? `_${subSlotId}` : ''}_${Date.now()}`;

  // Persist to IndexedDB
  await saveDocument(docId, compressedBlob);

  const attachment: DocumentAttachment = {
    docId,
    slotId,
    subSlotId,
    fileName,
    originalSize: file.size,
    compressedSize: compressedBlob.size,
    mimeType: compressedBlob.type || file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    isBlurWarning: quality.isBlurry,
    isBlurWarningAcknowledged: false,
  };

  return {
    attachment,
    quality,
    blob: compressedBlob,
  };
}

export async function retrieveStoredDocument(docId: string): Promise<Blob | undefined> {
  return await getDocument(docId);
}

export async function removeStoredDocument(docId: string): Promise<void> {
  await deleteDocument(docId);
}

export async function checkStoredDocumentExists(docId: string): Promise<boolean> {
  return await hasDocument(docId);
}
