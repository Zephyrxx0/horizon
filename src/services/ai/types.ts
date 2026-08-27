import type { DestinationCountry, TripPurpose } from '../../features/visa/types';

export type AIProviderName = 'google' | 'openai' | 'gateway' | 'mock';

export interface AIProviderConfig {
  provider: AIProviderName;
  modelName: string;
  apiKey?: string;
}

export interface VisaDetailsResult {
  found: boolean;
  id?: string;
  name?: string;
  destination?: DestinationCountry;
  category?: string;
  purposes?: readonly TripPurpose[];
  description?: string;
  visaFee?: number;
  govtFee?: number;
  platformFee?: number;
  totalCost?: number;
  processingTimeDisplay?: string;
  requiredDocumentsCount?: number;
  error?: string;
}

export interface FeeCalculationResult {
  visaId: string;
  visaName: string;
  destination: DestinationCountry;
  consularFee: number;
  governmentMeaFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  breakdown: string;
}

export interface DocumentItemInfo {
  id: string;
  name: string;
  description: string;
  required: boolean;
  format: string;
}

export interface RequiredDocumentsResult {
  visaId: string;
  visaName: string;
  destination: DestinationCountry;
  mandatoryDocuments: DocumentItemInfo[];
  optionalDocuments: DocumentItemInfo[];
  photoSpecifications: {
    dimensions: string;
    background: string;
    recency: string;
    format: string;
  };
  fileRequirements: {
    maxSize: string;
    acceptedFormats: string[];
    offlineCompression: boolean;
  };
}

export interface PassportValidityResult {
  isValidForTravel: boolean;
  daysRemaining: number;
  monthsRemaining: number;
  expiryDate: string;
  travelDate: string;
  meetsSixMonthRule: boolean;
  warningMessage?: string;
  recommendedAction: string;
}

export interface TrackingStatusResult {
  found: boolean;
  arn: string;
  currentStage: string;
  status:
    | 'draft'
    | 'under_review'
    | 'biometrics_scheduled'
    | 'consulate_verified'
    | 'approved'
    | 'action_required';
  destinationCountry?: string;
  lastUpdated: string;
  estimatedCompletion: string;
  nextStepText: string;
}

export interface JargonExplanationResult {
  found: boolean;
  term: string;
  plainDefinition: string;
  commonMistakeToAvoid: string;
  passportLocation?: string;
}

export interface WizardNavigationResult {
  stepId: string;
  stepName: string;
  route: string;
  description: string;
}
