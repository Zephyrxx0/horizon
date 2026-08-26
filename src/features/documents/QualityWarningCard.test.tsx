import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { QualityWarningCard } from './QualityWarningCard';

describe('QualityWarningCard Component', () => {
  it('renders blur warning with retake and acknowledge actions', async () => {
    const onRetake = vi.fn();
    const onAcknowledge = vi.fn();

    const { container } = render(
      <QualityWarningCard
        warnings={['Image resolution is low. Clear text requires at least 600×600 pixels.']}
        onRetake={onRetake}
        onAcknowledge={onAcknowledge}
        isAcknowledged={false}
      />,
    );

    expect(screen.getByText('Image looks blurry or low-resolution')).toBeDefined();
    expect(screen.getByText(/Image resolution is low/)).toBeDefined();

    fireEvent.click(screen.getByText('Retake Photo'));
    expect(onRetake).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('✓ Use This Image Anyway'));
    expect(onAcknowledge).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders acknowledged state when isAcknowledged is true', () => {
    render(<QualityWarningCard onRetake={vi.fn()} onAcknowledge={vi.fn()} isAcknowledged={true} />);

    expect(screen.getByText('Warning acknowledged')).toBeDefined();
    expect(screen.queryByText('✓ Use This Image Anyway')).toBeNull();
  });
});
