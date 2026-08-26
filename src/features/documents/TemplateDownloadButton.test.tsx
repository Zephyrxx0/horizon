import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TemplateDownloadButton } from './TemplateDownloadButton';

describe('TemplateDownloadButton Component', () => {
  it('renders download button and passes axe checks', async () => {
    const { container } = render(
      <TemplateDownloadButton templateType="employment_noc" label="Download NOC Template" />,
    );

    expect(screen.getByText('Download NOC Template')).toBeDefined();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
