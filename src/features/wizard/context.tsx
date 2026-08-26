import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ActorRefFrom } from 'xstate';
import type { wizardMachine } from './machine';
import type { AutosaveController, SaveState } from '../../persistence/autosave';

export interface WizardContextValue {
  actor: ActorRefFrom<typeof wizardMachine>;
  controller: AutosaveController;
  resetDraft: () => void;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizardActor() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizardActor must be used within WizardContext.Provider');
  return ctx.actor;
}

export function useSaveState(): SaveState {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useSaveState must be used within WizardContext.Provider');

  return useSyncExternalStore(
    ctx.controller.subscribe,
    ctx.controller.state,
    () => 'idle' as SaveState,
  );
}

export function useWizardReset() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizardReset must be used within WizardContext.Provider');
  return ctx.resetDraft;
}
