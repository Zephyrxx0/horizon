import type { ServiceOutcome } from '../types';

export type ScenarioName = 'success' | 'failure' | 'timeout';

export interface ScenarioConfig {
  defaultOutcome: ScenarioName;
  failureCode?: string;
  failureMessage?: string;
  latencyMs: [number, number];
  overrides: Record<string, ScenarioName>;
}

const DEFAULT_CONFIG: ScenarioConfig = {
  defaultOutcome: 'success',
  failureCode: 'SERVICE_ERROR',
  failureMessage: 'Simulated service failure occurred.',
  latencyMs: [800, 3000],
  overrides: {},
};

let activeConfig: ScenarioConfig = { ...DEFAULT_CONFIG };

export function setScenarios(patch: Partial<ScenarioConfig>) {
  activeConfig = {
    ...activeConfig,
    ...patch,
    overrides: { ...activeConfig.overrides, ...(patch.overrides || {}) },
  };
}

export function resetScenarios() {
  activeConfig = { ...DEFAULT_CONFIG };
}

export function getScenarioConfig(): ScenarioConfig {
  return activeConfig;
}

function getRandomLatency(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function resolveWithScenario<T>(
  portName: string,
  dataFn: () => T,
): Promise<ServiceOutcome<T>> {
  const config = getScenarioConfig();
  const outcome: ScenarioName = config.overrides[portName] ?? config.defaultOutcome;
  const [minLatency, maxLatency] = config.latencyMs;
  const latency = getRandomLatency(minLatency, maxLatency);

  await new Promise((resolve) => setTimeout(resolve, latency));

  if (outcome === 'timeout') {
    return { status: 'timeout' };
  }

  if (outcome === 'failure') {
    return {
      status: 'failure',
      code: config.failureCode ?? 'SERVICE_ERROR',
      message: config.failureMessage ?? 'Simulated service failure occurred.',
    };
  }

  return {
    status: 'success',
    data: dataFn(),
  };
}
