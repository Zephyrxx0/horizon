import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SecuritySealBadge } from './SecuritySealBadge';

describe('SecuritySealBadge Component', () => {
  it('renders application integrity seal and security features', () => {
    render(<SecuritySealBadge referenceNumber="VRK-2026-981245" />);

    expect(screen.getByText(/Application Integrity & Security Seal/i)).toBeInTheDocument();
    expect(screen.getByText(/TLS 1.3 \/ AES-256/i)).toBeInTheDocument();
    expect(screen.getByText(/MEA Technical Standards/i)).toBeInTheDocument();
    expect(screen.getByText(/SHA-256 Payload Seal/i)).toBeInTheDocument();
    expect(screen.getByText(/Draft Checksum #981245/i)).toBeInTheDocument();
  });
});
