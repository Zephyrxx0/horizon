/**
 * Visa-Specific Interview & Preparation Checklist Engine
 */

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  category: 'identity' | 'financial' | 'purpose' | 'consulate';
}

/**
 * Returns dynamic checklist items customized for the specific visa type and destination country.
 */
export function getInterviewChecklistItems(
  country: string = 'International',
  visaType: string = 'Tourist Visa',
): ChecklistItem[] {
  const normalizedVisa = visaType.toLowerCase();
  const isSchengen =
    country.toLowerCase().includes('france') ||
    country.toLowerCase().includes('germany') ||
    country.toLowerCase().includes('italy');

  // Universal base checklist
  const baseItems: ChecklistItem[] = [
    {
      id: 'doc-passport-original',
      title: 'Current Original Passport + All Expired Passports',
      description: 'Must have at least 6 months validity from travel date and 2 blank pages.',
      required: true,
      category: 'identity',
    },
    {
      id: 'doc-app-receipt',
      title: 'Printed Application Confirmation & Payment Receipt',
      description: 'Physical printout of this confirmation with reference ID and fee receipt.',
      required: true,
      category: 'consulate',
    },
    {
      id: 'doc-photos',
      title: '2 Physical Passport Photos (4x6 cm / 2x2 in)',
      description:
        'White background, matte finish, taken within the last 6 months without spectacles.',
      required: true,
      category: 'identity',
    },
  ];

  // Specific additions based on visa category
  const specificItems: ChecklistItem[] = [];

  if (normalizedVisa.includes('student')) {
    specificItems.push(
      {
        id: 'doc-univ-offer',
        title: 'Official University Admission Letter / I-20 / CAS',
        description: 'Original signed acceptance letter with SEVIS/course registration ID.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-academic-transcripts',
        title: 'Original Academic Degrees & Transcripts',
        description:
          'Mark sheets, degree certificates, and standardized test scores (IELTS/TOEFL/GRE).',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-financial-proof-student',
        title: 'Proof of Funds & Sponsorship Affidavit',
        description:
          'Bank statements for the last 6 months, education loan sanction letter, or sponsor ITR.',
        required: true,
        category: 'financial',
      },
    );
  } else if (normalizedVisa.includes('business')) {
    specificItems.push(
      {
        id: 'doc-business-invitation',
        title: 'Official Business Invitation Letter',
        description:
          'Signed letter from host organization in destination country stating trip purpose and duration.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-employer-noc',
        title: 'Employer Deputation Letter & NOC',
        description:
          'Company letterhead confirming employment, designation, salary, and leave sanction.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-company-financials',
        title: 'Company Registration & Bank Statements',
        description:
          'Certificate of incorporation and recent 6-month corporate account statements.',
        required: false,
        category: 'financial',
      },
    );
  } else if (normalizedVisa.includes('medical')) {
    specificItems.push(
      {
        id: 'doc-hospital-letter',
        title: 'Hospital Acceptance & Treatment Estimate Letter',
        description:
          'Formal letter from accredited destination hospital outlining treatment schedule and costs.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-indian-medical-referral',
        title: 'Indian Medical Referral Certificate',
        description:
          'Referral letter from treating doctor in India recommending specialized overseas care.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-medical-funds',
        title: 'Proof of Medical Treatment Funding',
        description:
          'Bank statement or medical insurance guarantee covering all estimated expenses.',
        required: true,
        category: 'financial',
      },
    );
  } else {
    // Tourist / General
    specificItems.push(
      {
        id: 'doc-travel-itinerary',
        title: 'Round-Trip Flight Reservation & Daily Itinerary',
        description: 'Confirmed round-trip travel booking and day-by-day travel plan.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-hotel-booking',
        title: 'Hotel Accommodations / Host Invitation',
        description:
          'Confirmed hotel reservations for the duration of stay or host residential proof.',
        required: true,
        category: 'purpose',
      },
      {
        id: 'doc-bank-statements',
        title: 'Personal Bank Statements (Last 6 Months)',
        description: 'Stamped and signed by bank manager showing adequate maintenance balance.',
        required: true,
        category: 'financial',
      },
      {
        id: 'doc-itr-filing',
        title: 'Income Tax Returns (ITR-V for last 2 years)',
        description: 'Acknowledgement receipts and Form 16 / salary slips.',
        required: false,
        category: 'financial',
      },
    );
  }

  if (isSchengen) {
    specificItems.push({
      id: 'doc-schengen-insurance',
      title: 'Mandatory Schengen Travel Medical Insurance (Min €30,000)',
      description:
        'Valid across all Schengen member states covering emergency medical care and repatriation.',
      required: true,
      category: 'financial',
    });
  }

  return [...baseItems, ...specificItems];
}

/**
 * Formats a clean, readable plain-text document for downloading.
 */
export function generateChecklistText(
  referenceNumber: string,
  applicantName: string = 'Applicant',
  visaType: string = 'Tourist Visa',
  country: string = 'International',
  items: ChecklistItem[],
): string {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lines: string[] = [
    '================================================================================',
    '                  VISARETHINK - INTERVIEW & EMBASSY PREPARATION GUIDE           ',
    '================================================================================',
    '',
    `APPLICATION REFERENCE: ${referenceNumber}`,
    `APPLICANT NAME:        ${applicantName}`,
    `VISA CATEGORY:         ${visaType} (${country})`,
    `DATE GENERATED:        ${today}`,
    '',
    '--------------------------------------------------------------------------------',
    'I. REQUIRED PHYSICAL DOCUMENTS CHECKLIST',
    '--------------------------------------------------------------------------------',
    ...items.map(
      (item, i) =>
        `[ ] ${i + 1}. ${item.title} ${item.required ? '[MANDATORY]' : '[SUPPORTING]'}\n     -> ${item.description}`,
    ),
    '',
    '--------------------------------------------------------------------------------',
    'II. CONSULATE ARRIVAL ESSENTIALS & EMBASSY SECURITY RULES',
    '--------------------------------------------------------------------------------',
    '[ ] 1. Arrive at the visa application center 15 minutes before your scheduled appointment.',
    '[ ] 2. Carry your original physical passport, plus all previous/expired passports.',
    '[ ] 3. Carry 2 printed physical copies of this checklist and your payment receipt.',
    '[ ] 4. Prohibited Items: Mobile phones, smartwatches, recording devices, sealed luggage, and liquids are strictly prohibited inside the consular compound.',
    '[ ] 5. Dress Code: Business casual or neat formal attire is recommended for interviews.',
    '[ ] 6. Answer all consular officer questions truthfully, concisely, and consistently with your application answers.',
    '',
    '================================================================================',
    'Official Indian Visa Reimagined Service Portal • https://visarethink.gov.in',
    '================================================================================',
  ];

  return lines.join('\n');
}
