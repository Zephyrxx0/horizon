export type DestinationCountry = 'USA' | 'UK' | 'Canada' | 'Australia' | 'Schengen';

export type TripPurpose = 'tourism' | 'business' | 'study' | 'work';

export type VisaCategory = 'tourist' | 'business' | 'student' | 'work';

export interface DocumentChecklistItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  format: string;
}

export interface VisaItem {
  id: string;
  name: string;
  destination: DestinationCountry;
  category: VisaCategory;
  purposes: TripPurpose[];
  description: string;
  visaFee: number;
  govtFee: number;
  platformFee: number;
  totalCost: number;
  processingDaysMin: number;
  processingDaysMax: number;
  processingTimeDisplay: string;
  requiredDocuments: DocumentChecklistItem[];
  isRecommended?: boolean;
}

export const DESTINATIONS: readonly { value: DestinationCountry; label: string; flag: string }[] = [
  { value: 'USA', label: 'United States', flag: '🇺🇸' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
  { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { value: 'Schengen', label: 'Schengen Area (Europe)', flag: '🇪🇺' },
] as const;

export const TRIP_PURPOSES: readonly {
  value: TripPurpose;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'tourism',
    label: 'Tourism & Leisure',
    description: 'Vacations, sightseeing, visiting friends or relatives',
    icon: 'Palmtree',
  },
  {
    value: 'business',
    label: 'Business & Conferences',
    description: 'Meetings, trade fairs, client negotiations, short training',
    icon: 'Briefcase',
  },
  {
    value: 'study',
    label: 'Education & Studies',
    description: 'Undergraduate, postgraduate, exchange, or language programs',
    icon: 'GraduationCap',
  },
  {
    value: 'work',
    label: 'Employment & Work',
    description: 'Skilled work, intra-company transfer, long-term employment',
    icon: 'Building2',
  },
] as const;
