export type DocumentTemplateType = 'sponsorship' | 'employment_noc' | 'financial_declaration';

export interface TemplateMetadata {
  type: DocumentTemplateType;
  title: string;
  defaultFileName: string;
  content: string;
}

export const TEMPLATE_DEFINITIONS: Record<DocumentTemplateType, TemplateMetadata> = {
  sponsorship: {
    type: 'sponsorship',
    title: 'Sponsorship / Invitation Letter Template',
    defaultFileName: 'sponsorship_invitation_letter_template.txt',
    content: `SPONSORSHIP / INVITATION LETTER FOR VISA APPLICATION

Date: [Date of Letter, e.g. 15 September 2026]

To:
The Visa Officer / Consular Section
Embassy / Consulate of [Destination Country, e.g. United States / United Kingdom]

Subject: Letter of Sponsorship / Invitation for [Applicant Full Name]

Dear Visa Officer,

I, [Host/Sponsor Full Name], residing at [Host Full Address Abroad], citizen / permanent resident / visa holder of [Destination Country] (Passport/ID No: [Host Passport/ID Number]), am writing this letter to sponsor and invite [Applicant Full Name] (Passport No: [Applicant Passport Number]) for a temporary visit.

1. Relationship: [State relationship, e.g., Brother / Sister / Business Partner / Friend]
2. Purpose of Visit: [e.g., Family visit / Tourism / Attending graduation ceremony]
3. Duration of Stay: From [Expected Arrival Date] to [Expected Departure Date] (approx. [Number] days)
4. Accommodation: The applicant will stay at my residence at [Full Address] during their visit.
5. Financial Responsibility: [I will cover all travel, accommodation, and medical expenses / The applicant is self-funded].

I guarantee that [Applicant Full Name] will abide by all laws and visa regulations of [Destination Country] and will return to India before the expiration of their authorized stay.

Attached supporting documents:
- Copy of my passport bio page and valid visa / permanent resident card
- Proof of address (utility bill / tenancy agreement)
- Bank statements / proof of income

Sincerely,

_______________________________
[Host / Sponsor Full Name]
Phone: [Host Phone Number with country code]
Email: [Host Email Address]
Signature: ______________________
`,
  },
  employment_noc: {
    type: 'employment_noc',
    title: 'Employer No-Objection Certificate (NOC)',
    defaultFileName: 'employer_noc_leave_approval_template.txt',
    content: `[ON OFFICIAL COMPANY LETTERHEAD]

NO-OBJECTION CERTIFICATE (NOC) & LEAVE APPROVAL

Date: [Date, e.g. 15 September 2026]
Ref No: NOC/[Company Initials]/2026/[Serial]

To:
The Visa Officer / Consular Section
Embassy / Consulate of [Destination Country]

Subject: No-Objection Certificate for [Employee Full Name] (Passport No: [Passport Number])

This is to certify that [Employee Full Name] is a permanent, full-time employee of [Company Name], currently holding the position of [Job Title / Designation] in our [Department Name] department since [Date of Joining].

Key Employment Details:
- Employee ID: [Employee ID]
- Monthly / Annual Gross Salary: INR [Salary Amount, e.g. INR 1,20,000 per month]
- Approved Leave Period: From [Start Date] to [End Date] (Total: [Number] days)

Our organization has NO OBJECTION to [Employee Full Name] traveling to [Destination Country] for tourism / personal travel during the approved leave period.

We confirm that [Employee Full Name] will resume their active duties with our company upon returning to India on [Resumption Date].

Sincerely,

For [Company Name],

_______________________________
[Authorized Signatory Name]
[Designation, e.g., Head of Human Resources]
Company Name: [Company Name]
Company Address: [Full Office Address]
Official Email: [HR Official Email]
Official Phone: [Office Phone Number]

[COMPANY SEAL / STAMP]
`,
  },
  financial_declaration: {
    type: 'financial_declaration',
    title: 'Declaration of Financial Support / Solvency',
    defaultFileName: 'financial_declaration_template.txt',
    content: `SELF-DECLARATION OF FINANCIAL MEANS FOR VISA APPLICATION

Date: [Date, e.g. 15 September 2026]

To:
The Visa Officer / Consular Section
Embassy / Consulate of [Destination Country]

Subject: Declaration of Sufficient Financial Means for Travel

I, [Applicant Full Name], holding Indian Passport No: [Passport Number], residing at [Residential Address in India], hereby declare that I possess sufficient financial resources to fully fund my travel, accommodation, and personal expenses during my intended trip to [Destination Country] from [Arrival Date] to [Departure Date].

Financial Summary:
1. Primary Source of Funds: [Savings / Salary / Business Income / Fixed Deposits]
2. Total Liquid Funds Available: INR [Amount, e.g. INR 6,50,000]
3. Attached Financial Evidence:
   - Bank statements for the last 6 months (Account No: [Masked Account Number])
   - Income Tax Returns (ITR-V) for the last 2 assessment years
   - Fixed Deposit / Mutual Fund summary certificates

I solemnly declare that all funds shown are genuine, legally held in my name, and available for my travel expenses without recourse to public funds.

Sincerely,

_______________________________
[Applicant Full Name]
Phone: [Phone Number]
Email: [Email Address]
Signature: ______________________
`,
  },
};

/**
 * Generates a downloadable text Blob for the requested template type.
 */
export function generateDocumentTemplateBlob(templateType: DocumentTemplateType): Blob {
  const meta = TEMPLATE_DEFINITIONS[templateType];
  const content = meta ? meta.content : 'Document template not found.';
  return new Blob([content], { type: 'text/plain;charset=utf-8' });
}

/**
 * Triggers a browser download of the requested template.
 */
export function downloadTemplate(templateType: DocumentTemplateType): void {
  const meta = TEMPLATE_DEFINITIONS[templateType];
  if (!meta) return;

  const blob = generateDocumentTemplateBlob(templateType);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = meta.defaultFileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
