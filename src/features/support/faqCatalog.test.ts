import { describe, it, expect } from 'vitest';
import { FAQ_ITEMS, JARGON_DEFINITIONS, HELPLINE_INFO, searchFaqs } from './faqCatalog';

describe('faqCatalog', () => {
  it('contains 18 curated FAQ questions', () => {
    expect(FAQ_ITEMS).toHaveLength(18);
  });

  it('returns all FAQs when query is empty and category is all', () => {
    const results = searchFaqs('', 'all');
    expect(results).toHaveLength(18);
  });

  it('filters FAQs by category', () => {
    const passportFaqs = searchFaqs('', 'passport');
    expect(passportFaqs.length).toBeGreaterThan(0);
    expect(passportFaqs.every((item) => item.category === 'passport')).toBe(true);

    const paymentFaqs = searchFaqs('', 'payment');
    expect(paymentFaqs.length).toBeGreaterThan(0);
    expect(paymentFaqs.every((item) => item.category === 'payment')).toBe(true);

    const docFaqs = searchFaqs('', 'documents');
    expect(docFaqs.length).toBeGreaterThan(0);
    expect(docFaqs.every((item) => item.category === 'documents')).toBe(true);

    const trackingFaqs = searchFaqs('', 'tracking');
    expect(trackingFaqs.length).toBeGreaterThan(0);
    expect(trackingFaqs.every((item) => item.category === 'tracking')).toBe(true);
  });

  it('searches FAQs by keyword in tags and question text', () => {
    const photoResults = searchFaqs('photograph', 'all');
    expect(photoResults.some((item) => item.id === 'q2_photo_specs')).toBe(true);

    const upiResults = searchFaqs('UPI', 'all');
    expect(upiResults.some((item) => item.id === 'q5_payment_methods')).toBe(true);

    const refundResults = searchFaqs('refund', 'payment');
    expect(refundResults.some((item) => item.id === 'q15_refund_policy')).toBe(true);
  });

  it('searches FAQs using translation callback', () => {
    const mockT = (key: string, def?: string) => {
      if (key === 'help:faqs.q1_passport_validity.question') {
        return 'पासपोर्ट की कितनी वैधता आवश्यक है?';
      }
      return def || '';
    };

    const results = searchFaqs('वैधता', 'all', mockT);
    expect(results.some((item) => item.id === 'q1_passport_validity')).toBe(true);
  });

  it('returns empty array when no matches found', () => {
    const results = searchFaqs('xyznonexistentquery999', 'all');
    expect(results).toHaveLength(0);
  });

  it('contains comprehensive jargon definitions', () => {
    expect(JARGON_DEFINITIONS.givenNameVsSurname).toBeDefined();
    expect(JARGON_DEFINITIONS.givenNameVsSurname.hasDiagram).toBe(true);
    expect(JARGON_DEFINITIONS.dateOfIssueVsExpiry).toBeDefined();
    expect(JARGON_DEFINITIONS.placeOfIssue).toBeDefined();
    expect(JARGON_DEFINITIONS.cvv).toBeDefined();
    expect(JARGON_DEFINITIONS.vpa).toBeDefined();
    expect(JARGON_DEFINITIONS.mrz).toBeDefined();
  });

  it('contains helpline contact info', () => {
    expect(HELPLINE_INFO.number).toContain('1800-VISA-HELP');
    expect(HELPLINE_INFO.hours).toBeDefined();
  });
});
