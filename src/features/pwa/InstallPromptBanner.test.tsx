import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { InstallPromptBanner } from './InstallPromptBanner';

describe('InstallPromptBanner component', () => {
  it('renders nothing by default when not installable', () => {
    const { container } = render(<InstallPromptBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders card variant when forced/installable and passes axe check', async () => {
    const onDismiss = vi.fn();
    const { container } = render(<InstallPromptBanner forceShow onDismiss={onDismiss} />);

    expect(screen.getByTestId('pwa-install-card')).toBeInTheDocument();
    expect(screen.getByText(/install visarethink for seamless offline use/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    const user = userEvent.setup();
    const dismissBtn = screen.getByTestId('pwa-dismiss-btn');
    await user.click(dismissBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders header button variant when specified', () => {
    render(<InstallPromptBanner variant="button" forceShow />);
    expect(screen.getByTestId('pwa-install-header-btn')).toBeInTheDocument();
    expect(screen.getByText('Install App')).toBeInTheDocument();
  });
});
