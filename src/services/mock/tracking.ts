import type { ITrackingService, TimelineEntry, ServiceOutcome } from '../types';
import { resolveWithScenario } from './scenarios';

export class MockTrackingService implements ITrackingService {
  async getTimeline(reference: string): Promise<ServiceOutcome<TimelineEntry[]>> {
    return resolveWithScenario('tracking', () => {
      // Deterministic timeline based on reference string hash
      const hash = reference.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const stage = hash % 4; // 0, 1, 2, or 3

      const timeline: TimelineEntry[] = [
        {
          status: 'Application Received',
          date: '2026-08-20',
          completed: stage >= 0,
        },
        {
          status: 'Documents Under Review',
          date: '2026-08-22',
          completed: stage >= 1,
        },
        {
          status: 'Interview Scheduling',
          date: '2026-08-24',
          completed: stage >= 2,
        },
        {
          status: 'Visa Decision',
          date: '2026-08-25',
          completed: stage >= 3,
        },
      ];

      return timeline;
    });
  }
}
