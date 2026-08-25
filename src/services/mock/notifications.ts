import type { INotificationService } from '../types';

export class MockNotificationService implements INotificationService {
  async sendEmail(to: string, template: string, payload: Record<string, unknown>): Promise<void> {
    console.log(`[mock:email] To: ${to} | Template: ${template} | Data:`, payload);
  }

  async sendSms(to: string, template: string, payload: Record<string, unknown>): Promise<void> {
    console.log(`[mock:sms] To: ${to} | Template: ${template} | Data:`, payload);
  }
}
