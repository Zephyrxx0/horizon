import { describe, it, expect } from 'vitest';
import { ALL_DOCUMENT_SLOTS, getDocumentSlotsForVisa } from './requirements';

describe('Document Requirements Catalog', () => {
  it('defines core mandatory slots for all visa categories', () => {
    expect(ALL_DOCUMENT_SLOTS.passport).toBeDefined();
    expect(ALL_DOCUMENT_SLOTS.passport.isMandatory).toBe(true);
    expect(ALL_DOCUMENT_SLOTS.passport.subSlots).toHaveLength(2);
    expect(ALL_DOCUMENT_SLOTS.photo).toBeDefined();
    expect(ALL_DOCUMENT_SLOTS.photo.isMandatory).toBe(true);
  });

  it('returns mandatory passport and photo for tourist visas', () => {
    const tourist = getDocumentSlotsForVisa('us-tourist');
    const mandatoryIds = tourist.mandatory.map((s) => s.id);
    expect(mandatoryIds).toContain('passport');
    expect(mandatoryIds).toContain('photo');
    expect(tourist.mandatory).toHaveLength(2);
    expect(tourist.optional.length).toBeGreaterThan(0);
  });

  it('returns additional mandatory slots for student visas', () => {
    const student = getDocumentSlotsForVisa('uk-student');
    const mandatoryIds = student.mandatory.map((s) => s.id);
    expect(mandatoryIds).toContain('passport');
    expect(mandatoryIds).toContain('photo');
    expect(mandatoryIds).toContain('bank_statement');
    expect(mandatoryIds).toContain('address_proof');
  });

  it('returns employment_noc and bank_statement for work visas', () => {
    const work = getDocumentSlotsForVisa('ca-work');
    const mandatoryIds = work.mandatory.map((s) => s.id);
    expect(mandatoryIds).toContain('passport');
    expect(mandatoryIds).toContain('photo');
    expect(mandatoryIds).toContain('employment_noc');
    expect(mandatoryIds).toContain('bank_statement');
  });
});
