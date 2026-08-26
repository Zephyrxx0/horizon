import type { DestinationCountry, TripPurpose, VisaItem } from './types';

export const GOVERNMENT_FEE = 5000;
export const PLATFORM_FEE = 1500;

export const VISA_CATALOG: readonly VisaItem[] = [
  // --- USA ---
  {
    id: 'usa-b1b2',
    name: 'B1/B2 Visitor Visa',
    destination: 'USA',
    category: 'tourist',
    purposes: ['tourism', 'business'],
    description:
      'Combined business and tourism visitor visa for temporary travel to the United States.',
    visaFee: 7500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 7500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 5,
    processingDaysMax: 7,
    processingTimeDisplay: '5–7 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page with minimum 6 months validity',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'photo',
        name: 'Recent Photograph',
        description: '2x2 inch (51x51 mm) color photo with white background',
        required: true,
        format: 'JPEG / PNG',
      },
      {
        id: 'financials',
        name: 'Financial Proof / Bank Statements',
        description: 'Last 6 months bank statement showing sufficient funds',
        required: true,
        format: 'PDF',
      },
      {
        id: 'itinerary',
        name: 'Travel Itinerary & Hotel Bookings',
        description: 'Confirmed hotel reservations or host invitation letter',
        required: false,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'usa-f1',
    name: 'F1 Student Visa',
    destination: 'USA',
    category: 'student',
    purposes: ['study'],
    description:
      'Academic student visa for accredited US colleges, universities, or language programs.',
    visaFee: 8500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 8500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 7,
    processingDaysMax: 10,
    processingTimeDisplay: '7–10 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page with minimum 6 months validity',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'form-i20',
        name: 'Form I-20 & SEVIS Receipt',
        description:
          'Certificate of Eligibility from SEVP-approved school and SEVIS I-901 fee receipt',
        required: true,
        format: 'PDF',
      },
      {
        id: 'academics',
        name: 'Academic Transcripts & Test Scores',
        description: 'Degree certificates, GRE/GMAT, and TOEFL/IELTS scorecards',
        required: true,
        format: 'PDF',
      },
      {
        id: 'sponsorship',
        name: 'Financial Affidavit & Bank Statements',
        description: 'Affidavit of support from sponsor and bank proof for 1 year tuition + living',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'usa-h1b',
    name: 'H1B Specialty Occupation Work Visa',
    destination: 'USA',
    category: 'work',
    purposes: ['work'],
    description:
      'Temporary employment visa for specialty occupations requiring theoretical/practical expertise.',
    visaFee: 10000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 10000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 10,
    processingDaysMax: 15,
    processingTimeDisplay: '10–15 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page with minimum 6 months validity',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'form-i797',
        name: 'Form I-797 Notice of Action',
        description: 'USCIS H1B petition approval notice copy',
        required: true,
        format: 'PDF',
      },
      {
        id: 'employment-contract',
        name: 'Employment Offer Letter',
        description: 'Detailed contract showing job title, salary, and responsibilities',
        required: true,
        format: 'PDF',
      },
      {
        id: 'education-evaluation',
        name: 'Degree Certificates & Experience Letters',
        description: 'Educational credentials assessment and prior work experience proof',
        required: true,
        format: 'PDF',
      },
    ],
  },

  // --- UK ---
  {
    id: 'uk-standard-visitor',
    name: 'Standard Visitor Visa',
    destination: 'UK',
    category: 'tourist',
    purposes: ['tourism', 'business'],
    description:
      'For tourism, visiting family and friends, or attending business meetings and conferences in the UK.',
    visaFee: 6500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 6500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 3,
    processingDaysMax: 5,
    processingTimeDisplay: '3–5 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Valid passport with at least 1 blank page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'financials',
        name: 'Bank Statements (6 Months)',
        description: 'Demonstrating sufficient funds for stay without working',
        required: true,
        format: 'PDF',
      },
      {
        id: 'noc',
        name: 'Employment NOC / Leave Letter',
        description: 'Letter from employer stating designation and approved leave duration',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'uk-student',
    name: 'Student Visa',
    destination: 'UK',
    category: 'student',
    purposes: ['study'],
    description: 'For courses of study at licensed UK higher education institutions.',
    visaFee: 7500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 7500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 5,
    processingDaysMax: 10,
    processingTimeDisplay: '5–10 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Valid passport with at least 1 blank page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'cas',
        name: 'CAS Statement (Confirmation of Acceptance)',
        description: 'Reference number and statement issued by your UK sponsor institution',
        required: true,
        format: 'PDF',
      },
      {
        id: 'financial-maintenance',
        name: '28-Day Financial Evidence',
        description:
          'Bank statements showing required maintenance funds held continuously for 28 days',
        required: true,
        format: 'PDF',
      },
      {
        id: 'tb-cert',
        name: 'Tuberculosis (TB) Certificate',
        description: 'Test results from an approved clinic in India',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'uk-skilled-worker',
    name: 'Skilled Worker Visa',
    destination: 'UK',
    category: 'work',
    purposes: ['work'],
    description: 'For eligible skilled individuals with a job offer from an approved UK sponsor.',
    visaFee: 9000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 9000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 7,
    processingDaysMax: 12,
    processingTimeDisplay: '7–12 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Valid passport with at least 1 blank page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'cos',
        name: 'Certificate of Sponsorship (CoS)',
        description: 'Reference number from UK employer sponsor',
        required: true,
        format: 'PDF',
      },
      {
        id: 'english-proof',
        name: 'English Language Competency',
        description:
          'Approved SELT test certificate (e.g. IELTS UKVI) or Ecctis degree verification',
        required: true,
        format: 'PDF',
      },
    ],
  },

  // --- Canada ---
  {
    id: 'canada-visitor',
    name: 'Visitor Visa (Temporary Resident)',
    destination: 'Canada',
    category: 'tourist',
    purposes: ['tourism', 'business'],
    description: 'For travel to Canada for tourism, family visits, or business visitor activities.',
    visaFee: 6000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 6000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 10,
    processingDaysMax: 15,
    processingTimeDisplay: '10–15 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Clear copy of bio page with valid dates',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'financial-proof',
        name: 'Proof of Financial Support',
        description: 'Bank statements, pay slips, and Income Tax Returns (ITR)',
        required: true,
        format: 'PDF',
      },
      {
        id: 'travel-plan',
        name: 'Purpose of Travel & Invitation Letter',
        description: 'Cover letter, hotel bookings or host invitation in Canada',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'canada-study',
    name: 'Study Permit',
    destination: 'Canada',
    category: 'student',
    purposes: ['study'],
    description:
      'Permit allowing international students to study at Designated Learning Institutions (DLIs) in Canada.',
    visaFee: 8000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 8000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 15,
    processingDaysMax: 20,
    processingTimeDisplay: '15–20 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'dli-letter',
        name: 'Letter of Acceptance (DLI)',
        description: 'Official acceptance letter containing DLI number',
        required: true,
        format: 'PDF',
      },
      {
        id: 'gic',
        name: 'Guaranteed Investment Certificate (GIC)',
        description: 'Proof of GIC payment with Canadian bank',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'canada-work',
    name: 'Work Permit',
    destination: 'Canada',
    category: 'work',
    purposes: ['work'],
    description:
      'Authorization for foreign nationals to work legally in Canada for a specific employer.',
    visaFee: 9500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 9500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 15,
    processingDaysMax: 25,
    processingTimeDisplay: '15–25 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'lmia-offer',
        name: 'Job Offer & LMIA Copy / Number',
        description: 'Labour Market Impact Assessment or LMIA-exempt job offer',
        required: true,
        format: 'PDF',
      },
      {
        id: 'credentials',
        name: 'Employment Contract & Experience Proof',
        description: 'Signed employment agreement and past work letters',
        required: true,
        format: 'PDF',
      },
    ],
  },

  // --- Australia ---
  {
    id: 'aus-visitor',
    name: 'Visitor Visa (Subclass 600)',
    destination: 'Australia',
    category: 'tourist',
    purposes: ['tourism', 'business'],
    description:
      'For individuals visiting Australia on a holiday, sightseeing, or for short business visits.',
    visaFee: 5000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 5000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 7,
    processingDaysMax: 14,
    processingTimeDisplay: '7–14 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Colored scan of passport bio-data and signature pages',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'financials',
        name: 'Financial Capacity Evidence',
        description: 'Past 6 months bank statements, salary slips, and tax filings',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'aus-student',
    name: 'Student Visa (Subclass 500)',
    destination: 'Australia',
    category: 'student',
    purposes: ['study'],
    description:
      'Allows international students to participate in an eligible course of study in Australia.',
    visaFee: 7000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 7000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 10,
    processingDaysMax: 20,
    processingTimeDisplay: '10–20 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'coe',
        name: 'Confirmation of Enrolment (CoE)',
        description: 'Electronic CoE certificate from Australian education provider',
        required: true,
        format: 'PDF',
      },
      {
        id: 'oshc',
        name: 'Overseas Student Health Cover (OSHC)',
        description: 'Health insurance policy for entire course duration',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'aus-work',
    name: 'Temporary Skill Shortage Visa (Subclass 482)',
    destination: 'Australia',
    category: 'work',
    purposes: ['work'],
    description:
      'Enables employers to address labour shortages by bringing in genuinely skilled workers.',
    visaFee: 10000,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 10000 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 14,
    processingDaysMax: 28,
    processingTimeDisplay: '14–28 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Bio-data page',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'nomination',
        name: 'Approved Nomination Letter',
        description: 'Reference from sponsoring Australian employer',
        required: true,
        format: 'PDF',
      },
      {
        id: 'skills',
        name: 'Skills Assessment & Experience Documents',
        description: 'Relevant skills assessing authority outcome and 2+ years experience proof',
        required: true,
        format: 'PDF',
      },
    ],
  },

  // --- Schengen ---
  {
    id: 'schengen-tourist',
    name: 'Schengen Short-Stay Tourist Visa (Type C)',
    destination: 'Schengen',
    category: 'tourist',
    purposes: ['tourism'],
    description:
      'Allows travel across all 29 Schengen member states for up to 90 days for leisure and sightseeing.',
    visaFee: 5500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 5500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 10,
    processingDaysMax: 15,
    processingTimeDisplay: '10–15 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Valid for at least 3 months after departure from Schengen area',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'insurance',
        name: 'Travel Medical Insurance (€30,000)',
        description:
          'Covering emergency medical expenses and repatriation across all Schengen states',
        required: true,
        format: 'PDF',
      },
      {
        id: 'itinerary',
        name: 'Flight Itinerary & Hotel Confirmations',
        description: 'Round-trip flight reservations and booked accommodations',
        required: true,
        format: 'PDF',
      },
    ],
  },
  {
    id: 'schengen-business',
    name: 'Schengen Business Visa (Type C)',
    destination: 'Schengen',
    category: 'business',
    purposes: ['business'],
    description:
      'For short-term business activities, meetings, trade shows, and client visits in Schengen countries.',
    visaFee: 6500,
    govtFee: GOVERNMENT_FEE,
    platformFee: PLATFORM_FEE,
    totalCost: 6500 + GOVERNMENT_FEE + PLATFORM_FEE,
    processingDaysMin: 7,
    processingDaysMax: 12,
    processingTimeDisplay: '7–12 business days',
    requiredDocuments: [
      {
        id: 'passport',
        name: 'Passport (Pages 1–2)',
        description: 'Valid passport with blank pages',
        required: true,
        format: 'PDF / JPEG',
      },
      {
        id: 'invitation',
        name: 'Company Invitation Letter from Europe',
        description:
          'Formal letter on company letterhead stating purpose, dates, and cost coverage',
        required: true,
        format: 'PDF',
      },
      {
        id: 'insurance',
        name: 'Travel Medical Insurance (€30,000)',
        description: 'Comprehensive medical insurance covering stay duration',
        required: true,
        format: 'PDF',
      },
    ],
  },
] as const;

/**
 * Returns filtered and ranked visas for destination and optional purpose.
 * Sets isRecommended on the best matching visa.
 */
export function getVisaOptions(
  destination: DestinationCountry | '',
  purpose?: TripPurpose | '',
): VisaItem[] {
  if (!destination) return [];

  const matched = VISA_CATALOG.filter((v) => v.destination === destination);

  if (!purpose) {
    return matched.map((v, i) => ({
      ...v,
      isRecommended: i === 0,
    }));
  }

  // Exact purpose match first
  const exactMatches = matched.filter((v) => v.purposes.includes(purpose));
  const otherMatches = matched.filter((v) => !v.purposes.includes(purpose));

  const ranked = [...exactMatches, ...otherMatches];

  return ranked.map((v, index) => ({
    ...v,
    isRecommended: index === 0 && exactMatches.length > 0,
  }));
}

/**
 * Looks up single visa by ID.
 */
export function getVisaById(id: string): VisaItem | undefined {
  return VISA_CATALOG.find((v) => v.id === id);
}
