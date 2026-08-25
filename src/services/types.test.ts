import { describe, it, expect } from 'vitest';
import {
  getService,
  PORTS,
  GOVERNMENT_FEE,
  PLATFORM_FEE,
  processingFeeFor,
  type IPassportLookupService,
  type IPaymentService,
  type IOtpService,
  type INotificationService,
  type ITrackingService,
} from './index';

describe('Service Layer - Types, Ports and Factory', () => {
  it('defines exactly 5 ports in PORTS registry', () => {
    const keys = Object.keys(PORTS);
    expect(keys).toEqual(['passportLookup', 'payment', 'otp', 'notification', 'tracking']);
  });

  it('returns singleton instances for all ports via getService', () => {
    const passport1 = getService<IPassportLookupService>(PORTS.passportLookup);
    const passport2 = getService<IPassportLookupService>(PORTS.passportLookup);
    expect(passport1).toBe(passport2);
    expect(typeof passport1.lookup).toBe('function');

    const payment = getService<IPaymentService>(PORTS.payment);
    expect(typeof payment.initiate).toBe('function');
    expect(typeof payment.confirm).toBe('function');

    const otp = getService<IOtpService>(PORTS.otp);
    expect(typeof otp.send).toBe('function');
    expect(typeof otp.verify).toBe('function');

    const notification = getService<INotificationService>(PORTS.notification);
    expect(typeof notification.sendEmail).toBe('function');
    expect(typeof notification.sendSms).toBe('function');

    const tracking = getService<ITrackingService>(PORTS.tracking);
    expect(typeof tracking.getTimeline).toBe('function');
  });

  it('provides verified fee constants and calculator', () => {
    expect(GOVERNMENT_FEE).toBe(5000);
    expect(PLATFORM_FEE).toBe(1500);

    const feeUS = processingFeeFor('US', 'Tourist Visa');
    const feeUK = processingFeeFor('UK', 'Business Visa');
    expect(feeUS).toBe(2000);
    expect(feeUK).toBe(3200);
  });
});
