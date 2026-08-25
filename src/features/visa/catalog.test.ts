import { describe, it, expect } from 'vitest';
import { getVisaOptions, getVisaById, VISA_CATALOG, GOVERNMENT_FEE, PLATFORM_FEE } from './catalog';

describe('Visa Catalog & Recommendation Engine', () => {
  it('contains valid fee math for all entries', () => {
    expect(VISA_CATALOG.length).toBeGreaterThan(10);

    for (const visa of VISA_CATALOG) {
      expect(visa.govtFee).toBe(GOVERNMENT_FEE);
      expect(visa.platformFee).toBe(PLATFORM_FEE);
      expect(visa.totalCost).toBe(visa.visaFee + GOVERNMENT_FEE + PLATFORM_FEE);
      expect(visa.requiredDocuments.length).toBeGreaterThan(0);
      expect(visa.processingDaysMin).toBeLessThanOrEqual(visa.processingDaysMax);
    }
  });

  it('returns empty array when destination is not specified', () => {
    expect(getVisaOptions('')).toEqual([]);
  });

  it('filters by destination country', () => {
    const usaVisas = getVisaOptions('USA');
    expect(usaVisas.length).toBe(3);
    expect(usaVisas.every((v) => v.destination === 'USA')).toBe(true);
  });

  it('ranks recommended visa to the top based on purpose', () => {
    // Tourist search for USA -> B1/B2 should be recommended and 1st
    const touristUsa = getVisaOptions('USA', 'tourism');
    expect(touristUsa[0].id).toBe('usa-b1b2');
    expect(touristUsa[0].isRecommended).toBe(true);

    // Study search for USA -> F1 should be recommended and 1st
    const studentUsa = getVisaOptions('USA', 'study');
    expect(studentUsa[0].id).toBe('usa-f1');
    expect(studentUsa[0].isRecommended).toBe(true);

    // Work search for UK -> Skilled Worker should be recommended and 1st
    const workUk = getVisaOptions('UK', 'work');
    expect(workUk[0].id).toBe('uk-skilled-worker');
    expect(workUk[0].isRecommended).toBe(true);
  });

  it('fetches single visa by ID', () => {
    const visa = getVisaById('usa-b1b2');
    expect(visa).toBeDefined();
    expect(visa?.name).toBe('B1/B2 Visitor Visa');
    expect(visa?.totalCost).toBe(14000);
  });
});
