export type TrustIconType = 'device' | 'shield-ban' | 'lock' | 'check-circle' | 'shield-check';

export interface PrivacyPillar {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon: TrustIconType;
}

export interface PrivacySection {
  id: string;
  title: string;
  content: string[];
  tips?: string[];
}

export interface SecuritySealInfo {
  integrityHash: string;
  encryptionStandard: string;
  complianceNotice: string;
  timestamp?: string;
}
