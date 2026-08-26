import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders compact theme toggle button', () => {
    render(<ThemeSwitcher />);
    const btn = screen.getByTestId('theme-switcher-btn');
    expect(btn).toBeDefined();
  });

  it('cycles theme when clicked', () => {
    render(<ThemeSwitcher />);
    const btn = screen.getByTestId('theme-switcher-btn');

    // Click to cycle to dark
    fireEvent.click(btn);
    expect(localStorage.getItem('horizon-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click to cycle to contrast
    fireEvent.click(btn);
    expect(localStorage.getItem('horizon-theme')).toBe('contrast');
    expect(document.documentElement.getAttribute('data-theme')).toBe('contrast');
  });

  it('renders full radio variant', () => {
    render(<ThemeSwitcher variant="full" />);
    expect(screen.getByText('Light')).toBeDefined();
    expect(screen.getByText('Dark')).toBeDefined();
    expect(screen.getByText('Contrast')).toBeDefined();
  });
});
