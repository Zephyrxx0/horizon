import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createActor } from 'xstate';
import './styles/theme.css';
import App from './App';
import { wizardMachine } from './features/wizard/machine';
import { WizardContext } from './features/wizard/context';
import {
  loadAnswersEnvelope,
  saveAnswersEnvelope,
  clearAnswersEnvelope,
} from './persistence/answers';
import { createAutosaveController, installAutosave } from './persistence/autosave';

function createWizardBootstrap() {
  const envelope = loadAnswersEnvelope();
  const actor = createActor(
    wizardMachine,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    envelope?.snapshot ? { snapshot: envelope.snapshot as any } : undefined,
  );
  actor.start();

  const flush = () => {
    const persistedSnapshot = actor.getPersistedSnapshot();
    return saveAnswersEnvelope({
      schemaVersion: 1,
      savedAt: Date.now(),
      snapshot: persistedSnapshot,
    });
  };

  const controller = createAutosaveController({ flush, delayMs: 10000 });
  return { actor, controller };
}

function Root() {
  const [bootstrap, setBootstrap] = useState(createWizardBootstrap);

  useEffect(() => {
    const sub = bootstrap.actor.subscribe(() => {
      bootstrap.controller.scheduleEdit();
    });

    const flush = () => {
      const persistedSnapshot = bootstrap.actor.getPersistedSnapshot();
      return saveAnswersEnvelope({
        schemaVersion: 1,
        savedAt: Date.now(),
        snapshot: persistedSnapshot,
      });
    };

    const uninstall = installAutosave(flush);

    return () => {
      sub.unsubscribe();
      uninstall();
    };
  }, [bootstrap]);

  const resetDraft = () => {
    clearAnswersEnvelope();
    bootstrap.actor.stop();
    const freshActor = createActor(wizardMachine);
    freshActor.start();

    const flush = () => {
      const persistedSnapshot = freshActor.getPersistedSnapshot();
      return saveAnswersEnvelope({
        schemaVersion: 1,
        savedAt: Date.now(),
        snapshot: persistedSnapshot,
      });
    };

    const freshController = createAutosaveController({ flush, delayMs: 10000 });
    setBootstrap({ actor: freshActor, controller: freshController });
  };

  return (
    <StrictMode>
      <WizardContext.Provider
        value={{
          actor: bootstrap.actor,
          controller: bootstrap.controller,
          resetDraft,
        }}
      >
        <App />
      </WizardContext.Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
