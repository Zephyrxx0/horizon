/**
 * Core outcome union for all asynchronous service calls.
 * Consumers switch on outcome.status to handle responses.
 */
export type ServiceOutcome<T> =
  | { status: 'success'; data: T }
  | { status: 'failure'; code: string; message: string }
  | { status: 'timeout' };

export interface PassportRecord {
  holderName: string;
  nationality: string;
  dateOfBirth: string;
}

export interface PaymentInput {
  reference: string;
  amountRupees: number;
  currency?: string;
}

export interface PaymentIntent {
  intentId: string;
  amountRupees: number;
  status: 'created';
}

export interface PaymentResult {
  reference: string;
  status: 'success' | 'pending' | 'failed';
  paidAt?: string;
}

export interface TimelineEntry {
  status: string;
  date: string;
  completed: boolean;
}

export const MOCK_OTP_CODE = '000000';

export interface IPassportLookupService {
  lookup(passportNumber: string): Promise<ServiceOutcome<PassportRecord>>;
}

export interface IPaymentService {
  initiate(input: PaymentInput): Promise<ServiceOutcome<PaymentIntent>>;
  confirm(intentId: string): Promise<ServiceOutcome<PaymentResult>>;
  retry(intentId: string): Promise<ServiceOutcome<PaymentResult>>;
}

export interface IOtpService {
  send(phone: string): Promise<ServiceOutcome<{ delivered: true }>>;
  verify(code: string): Promise<ServiceOutcome<{ verified: boolean }>>;
}

export interface INotificationService {
  sendEmail(to: string, template: string, payload: Record<string, unknown>): Promise<void>;
  sendSms(to: string, template: string, payload: Record<string, unknown>): Promise<void>;
}

export interface ITrackingService {
  getTimeline(reference: string): Promise<ServiceOutcome<TimelineEntry[]>>;
}

export interface DraftBackupSnapshot {
  code: string;
  createdAt: string;
  email: string;
  answers: Record<string, unknown>;
  documentMeta?: Array<{
    slotId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    previewUrl?: string;
  }>;
}

export interface IBackupService {
  createBackup(
    email: string,
    answers: Record<string, unknown>,
    documentMeta?: DraftBackupSnapshot['documentMeta'],
  ): Promise<ServiceOutcome<{ code: string; createdAt: string }>>;
  restoreBackup(code: string): Promise<ServiceOutcome<DraftBackupSnapshot>>;
}

/** Fee Constants */
export const GOVERNMENT_FEE = 5000;
export const PLATFORM_FEE = 1500;

const PROCESSING_FEE_MAP: Record<string, number> = {
  'US:Tourist Visa': 2000,
  'US:Business Visa': 3500,
  'US:Medical Visa': 2500,
  'UK:Tourist Visa': 1800,
  'UK:Business Visa': 3200,
  'UK:Medical Visa': 2200,
};

export function processingFeeFor(country: string, visaType: string): number {
  const key = `${country}:${visaType}`;
  return PROCESSING_FEE_MAP[key] ?? 2000;
}
