import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterProvider, useRouter, Link } from './Router';

function TestRouteConsumer() {
  const { currentRoute, navigate } = useRouter();
  return (
    <div>
      <span data-testid="current-route">{currentRoute}</span>
      <button type="button" onClick={() => navigate('/apply')}>
        Go Apply
      </button>
      <Link to="/track">Go Track</Link>
    </div>
  );
}

describe('Router', () => {
  it('provides current route and allows navigation', () => {
    window.location.hash = '';
    render(
      <RouterProvider>
        <TestRouteConsumer />
      </RouterProvider>,
    );

    expect(screen.getByTestId('current-route').textContent).toBe('/');

    fireEvent.click(screen.getByText('Go Apply'));
    expect(screen.getByTestId('current-route').textContent).toBe('/apply');

    fireEvent.click(screen.getByText('Go Track'));
    expect(screen.getByTestId('current-route').textContent).toBe('/track');
  });
});
