/**
 * Single swap point (D-04) — replacing mocks with real adapters changes only this file.
 * Consumers never import from services/mock/* directly.
 */
import type {
  IPassportLookupService,
  IPaymentService,
  IOtpService,
  INotificationService,
  ITrackingService,
  IBackupService,
} from './types';
import { MockPassportLookupService } from './mock/passport';
import { MockPaymentService } from './mock/payment';
import { MockOtpService } from './mock/otp';
import { MockNotificationService } from './mock/notifications';
import { MockTrackingService } from './mock/tracking';
import { MockBackupService } from './mock/backup';

export * from './types';
export * from './mock/duplicate';
export * from './mock/backup';

export const PORTS = {
  passportLookup: Symbol('passportLookup'),
  payment: Symbol('payment'),
  otp: Symbol('otp'),
  notification: Symbol('notification'),
  tracking: Symbol('tracking'),
  backup: Symbol('backup'),
} as const;

export type PortSymbol = (typeof PORTS)[keyof typeof PORTS];

// Singletons
const passportLookupAdapter: IPassportLookupService = new MockPassportLookupService();
const paymentAdapter: IPaymentService = new MockPaymentService();
const otpAdapter: IOtpService = new MockOtpService();
const notificationAdapter: INotificationService = new MockNotificationService();
const trackingAdapter: ITrackingService = new MockTrackingService();
const backupAdapter: IBackupService = new MockBackupService();

export function getService<T>(port: PortSymbol): T {
  switch (port) {
    case PORTS.passportLookup:
      return passportLookupAdapter as unknown as T;
    case PORTS.payment:
      return paymentAdapter as unknown as T;
    case PORTS.otp:
      return otpAdapter as unknown as T;
    case PORTS.notification:
      return notificationAdapter as unknown as T;
    case PORTS.tracking:
      return trackingAdapter as unknown as T;
    case PORTS.backup:
      return backupAdapter as unknown as T;
    default:
      throw new Error(`Unknown service port symbol: ${String(port)}`);
  }
}
