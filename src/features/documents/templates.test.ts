import { describe, it, expect } from 'vitest';
import { generateDocumentTemplateBlob, TEMPLATE_DEFINITIONS } from './templates';

describe('Document Template Generator', () => {
  it('generates non-empty text blobs for all defined template types', () => {
    const types = ['sponsorship', 'employment_noc', 'financial_declaration'] as const;

    for (const type of types) {
      const meta = TEMPLATE_DEFINITIONS[type];
      expect(meta).toBeDefined();
      expect(meta.title).toBeDefined();
      expect(meta.defaultFileName).toBeDefined();
      expect(meta.content.length).toBeGreaterThan(100);

      const blob = generateDocumentTemplateBlob(type);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
      expect(blob.type).toContain('text/plain');
    }
  });
});
