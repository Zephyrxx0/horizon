export type PaymentMethodType = 'upi' | 'card' | 'netbanking';

export type UpiMode = 'vpa' | 'qr';

export type PaymentScenario = 'success' | 'declined' | 'timeout' | 'network_error';

export interface FeeBreakdown {
  processingFee: number;
  governmentFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
}

export interface PaymentReceiptData {
  transactionId: string;
  referenceNumber: string;
  paidAt: string;
  applicantName: string;
  passportNumber: string;
  destinationCountry: string;
  visaType: string;
  paymentMethod: PaymentMethodType;
  paymentMethodDetails: string;
  feeBreakdown: FeeBreakdown;
}

export interface StageSummaryField {
  label: string;
  value: string;
  isDocument?: boolean;
  docId?: string;
  fileBlob?: Blob;
}

export interface StageSummaryItem {
  id: string;
  stageNumber: number;
  title: string;
  stepId: string;
  fields: StageSummaryField[];
}
