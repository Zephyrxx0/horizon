import type { DocumentSlotDefinition, DocumentSlotId } from './types';

export const ALL_DOCUMENT_SLOTS: Record<DocumentSlotId, DocumentSlotDefinition> = {
  passport: {
    id: 'passport',
    title: 'Indian Passport (Front & Back)',
    description: 'Clear color scan or photo of both bio-data and address pages.',
    instructions: [
      'Keep your phone flat directly over the passport',
      'Ensure all 4 corners of both pages are clearly visible',
      'Avoid flash glare over your photo, name, or MRZ numbers',
      'Make sure passport is valid for at least 6 months',
    ],
    isMandatory: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    sampleType: 'passport',
    subSlots: [
      {
        id: 'passport_bio',
        title: 'Passport Bio Page (Pages 1–2)',
        description: 'Page with your photo, passport number, full name, and MRZ code.',
        instructions: [
          'Capture the entire 2-page spread showing Pages 1 and 2',
          'Ensure the 2 lines of text at the bottom (MRZ) are sharp and uncropped',
        ],
        sampleImageKey: 'passport-bio-sample',
      },
      {
        id: 'passport_address',
        title: 'Passport Address Page (Pages 35–36)',
        description: 'Last page showing parents/spouse names and residential address.',
        instructions: [
          'Capture the entire page showing your registered address and signature',
          'Make sure the embossed seal and address lines are legible',
        ],
        sampleImageKey: 'passport-address-sample',
      },
    ],
  },
  photo: {
    id: 'photo',
    title: 'Recent Passport Photograph (4×6cm)',
    description: 'Studio-style colored portrait photo taken within the last 6 months.',
    instructions: [
      'Plain white or light off-white background with no patterns or shadows',
      'Look straight at the camera with a neutral facial expression',
      'No spectacles with tinted lenses, no sunglasses, and no hats (religious headwear permitted)',
      'Ensure both ears and full face from chin to crown are clearly visible',
    ],
    isMandatory: true,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    maxSizeBytes: 10 * 1024 * 1024,
    sampleType: 'photo',
  },
  address_proof: {
    id: 'address_proof',
    title: 'Proof of Residential Address',
    description: 'Government ID, Aadhaar card, or utility bill confirming your Indian address.',
    instructions: [
      'Document must show your full name and current residential address',
      'Utility bills (electricity/water/gas) must be dated within the last 3 months',
      'Aadhaar card / Voter ID / Driving License scans must be crisp and unblurred',
    ],
    isMandatory: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    sampleType: 'address',
  },
  sponsorship_letter: {
    id: 'sponsorship_letter',
    title: 'Sponsorship or Invitation Letter',
    description: 'Formal letter from your host, relative, or sponsoring institution abroad.',
    instructions: [
      'Must state relationship, purpose of visit, duration, and financial responsibility',
      'Include host contact information, address abroad, and copy of host ID/visa',
      'Use our standard template if you do not have a formal letter prepared',
    ],
    isMandatory: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    sampleType: 'sponsorship',
    templateType: 'sponsorship',
  },
  employment_noc: {
    id: 'employment_noc',
    title: 'Employer No-Objection Certificate (NOC)',
    description:
      'Official letter on employer letterhead approving leave and confirming employment.',
    instructions: [
      'Printed on official company letterhead with company seal and authorized signature',
      'Must specify your job title, date of joining, approved leave dates, and salary',
      'Download our pre-formatted NOC template to share with your HR department',
    ],
    isMandatory: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    sampleType: 'noc',
    templateType: 'employment_noc',
  },
  bank_statement: {
    id: 'bank_statement',
    title: 'Bank Statement / Financial Declaration',
    description: 'Bank statements for the last 3–6 months demonstrating sufficient travel funds.',
    instructions: [
      'Must show regular salary credits or sufficient balance for your itinerary',
      'e-Statements downloaded from netbanking in PDF format are preferred',
      'Ensure account holder name and account number are visible on all pages',
    ],
    isMandatory: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    templateType: 'financial_declaration',
  },
  flight_itinerary: {
    id: 'flight_itinerary',
    title: 'Flight Itinerary / Travel Bookings',
    description:
      'Roundtrip flight reservation or detailed travel itinerary (tentative bookings accepted).',
    instructions: [
      'Shows entry and exit dates matching your visa application duration',
      'Include booking reference (PNR) and passenger name',
    ],
    isMandatory: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
  },
};

/**
 * Returns the resolved mandatory and optional document slots for the given visa type.
 */
export function getDocumentSlotsForVisa(visaType = 'us-tourist'): {
  mandatory: DocumentSlotDefinition[];
  optional: DocumentSlotDefinition[];
} {
  const normalized = visaType.toLowerCase();

  // Core mandatory slots for all visa applications
  const mandatorySlots: DocumentSlotDefinition[] = [
    { ...ALL_DOCUMENT_SLOTS.passport, isMandatory: true },
    { ...ALL_DOCUMENT_SLOTS.photo, isMandatory: true },
  ];

  const optionalSlots: DocumentSlotDefinition[] = [];

  if (normalized.includes('student') || normalized.includes('study')) {
    mandatorySlots.push({ ...ALL_DOCUMENT_SLOTS.bank_statement, isMandatory: true });
    mandatorySlots.push({ ...ALL_DOCUMENT_SLOTS.address_proof, isMandatory: true });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.sponsorship_letter, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.flight_itinerary, isMandatory: false });
  } else if (normalized.includes('work') || normalized.includes('business')) {
    mandatorySlots.push({ ...ALL_DOCUMENT_SLOTS.employment_noc, isMandatory: true });
    mandatorySlots.push({ ...ALL_DOCUMENT_SLOTS.bank_statement, isMandatory: true });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.address_proof, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.sponsorship_letter, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.flight_itinerary, isMandatory: false });
  } else {
    // Tourist / General visitor
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.bank_statement, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.address_proof, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.employment_noc, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.sponsorship_letter, isMandatory: false });
    optionalSlots.push({ ...ALL_DOCUMENT_SLOTS.flight_itinerary, isMandatory: false });
  }

  return {
    mandatory: mandatorySlots,
    optional: optionalSlots,
  };
}
