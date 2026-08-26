export type DocumentSlotId =
  | 'passport'
  | 'photo'
  | 'address_proof'
  | 'sponsorship_letter'
  | 'flight_itinerary'
  | 'bank_statement'
  | 'employment_noc';

export type DocumentSubSlotId = 'passport_bio' | 'passport_address';

export interface DocumentSubSlotDefinition {
  id: DocumentSubSlotId;
  title: string;
  description: string;
  instructions: string[];
  sampleImageKey?: string;
}

export interface DocumentSlotDefinition {
  id: DocumentSlotId;
  title: string;
  description: string;
  instructions: string[];
  isMandatory: boolean;
  allowedMimeTypes: string[];
  maxSizeBytes: number;
  subSlots?: DocumentSubSlotDefinition[];
  sampleType?: 'passport' | 'photo' | 'address' | 'sponsorship' | 'noc';
  templateType?: 'sponsorship' | 'employment_noc' | 'financial_declaration';
}

export interface DocumentAttachment {
  docId: string;
  slotId: DocumentSlotId;
  subSlotId?: DocumentSubSlotId;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  mimeType: string;
  uploadedAt: string;
  isBlurWarning?: boolean;
  isBlurWarningAcknowledged?: boolean;
}

export interface QualityAssessmentResult {
  isBlurry: boolean;
  score: number;
  width: number;
  height: number;
  aspectRatio: number;
  warnings: string[];
}
