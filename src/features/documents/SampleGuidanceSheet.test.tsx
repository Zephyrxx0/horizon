import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SampleGuidanceSheet } from './SampleGuidanceSheet';

describe('SampleGuidanceSheet Component', () => {
  it('renders passport guidelines and good vs bad tips', async () => {
    const onClose = vi.fn();
    render(<SampleGuidanceSheet slotId="passport" isOpen={true} onClose={onClose} />);

    expect(screen.getByText(/Sample & Tips: Indian Passport/)).toBeDefined();
    expect(screen.getByText('Do This:')).toBeDefined();
    expect(screen.getByText('Avoid This:')).toBeDefined();

    fireEvent.click(screen.getByText('Got it, I understand'));
    expect(onClose).toHaveBeenCalledTimes(1);

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('renders photo guidelines and dos/donts', async () => {
    render(<SampleGuidanceSheet slotId="photo" isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Sample & Tips: Recent Passport Photograph/)).toBeDefined();
    expect(screen.getByText('Acceptable Photograph')).toBeDefined();
    expect(screen.getByText('Unacceptable Photos')).toBeDefined();

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
