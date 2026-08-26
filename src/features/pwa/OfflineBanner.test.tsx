import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { OfflineBanner } from './OfflineBanner';

describe('OfflineBanner component', () => {
  it('does not render when online', () => {
    const { container } = render(<OfflineBanner isOnline={true} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument();
  });

  it('renders ambient notification when offline with zero a11y violations', async () => {
    const { container } = render(<OfflineBanner isOnline={false} />);
    const banner = screen.getByTestId('offline-banner');
    expect(banner).toBeInTheDocument();
    expect(screen.getByText(/you are currently offline/i)).toBeInTheDocument();
    expect(screen.getByText(/safely saved on this device/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
