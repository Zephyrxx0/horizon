import { describe, it, expect } from 'vitest';
import { getInterviewChecklistItems, generateChecklistText } from './checklist';

describe('Interview Checklist Engine', () => {
  it('returns base documents for any visa type', () => {
    const items = getInterviewChecklistItems('US', 'Tourist Visa');
    const titles = items.map((i) => i.title);
    expect(titles).toContain('Current Original Passport + All Expired Passports');
    expect(titles).toContain('Printed Application Confirmation & Payment Receipt');
  });

  it('customizes items for Student Visas', () => {
    const items = getInterviewChecklistItems('US', 'Student Visa (F-1)');
    const titles = items.map((i) => i.title);
    expect(titles).toContain('Official University Admission Letter / I-20 / CAS');
    expect(titles).toContain('Proof of Funds & Sponsorship Affidavit');
  });

  it('customizes items for Business Visas', () => {
    const items = getInterviewChecklistItems('UK', 'Business Visa');
    const titles = items.map((i) => i.title);
    expect(titles).toContain('Official Business Invitation Letter');
    expect(titles).toContain('Employer Deputation Letter & NOC');
  });

  it('customizes items for Medical Visas', () => {
    const items = getInterviewChecklistItems('India', 'Medical Visa');
    const titles = items.map((i) => i.title);
    expect(titles).toContain('Hospital Acceptance & Treatment Estimate Letter');
  });

  it('generates structured plain-text checklist string', () => {
    const items = getInterviewChecklistItems('US', 'Tourist Visa');
    const text = generateChecklistText(
      'VR-2026-849201',
      'Priya Sharma',
      'Tourist Visa',
      'US',
      items,
    );

    expect(text).toContain('VR-2026-849201');
    expect(text).toContain('Priya Sharma');
    expect(text).toContain('REQUIRED PHYSICAL DOCUMENTS CHECKLIST');
    expect(text).toContain('CONSULATE ARRIVAL ESSENTIALS');
    expect(text).toContain('[ ]');
  });
});
