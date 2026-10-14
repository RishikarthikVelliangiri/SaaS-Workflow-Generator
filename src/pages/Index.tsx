import React from 'react';
import AppShell from '@/components/AppShell';
import ApiKeyInput from '@/components/ApiKeyInput';
import LandingScreen from '@/components/LandingScreen';
import RequirementsGathering from '@/components/RequirementsGathering';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import { clearApiKey, isApiKeySet } from '@/utils/deepseekApi';

type AppState = 'apikey' | 'landing' | 'requirements' | 'workflow';

const STEP_INDEX: Record<AppState, number> = { apikey: 0, landing: 1, requirements: 2, workflow: 3 };

const Index = () => {
  // A dev key from VITE_OPENROUTER_API_KEY is already loaded at import time, so skip the key step then.
  const [state, setState] = React.useState<AppState>(isApiKeySet() ? 'landing' : 'apikey');
  const [idea, setIdea] = React.useState('');
  const [requirements, setRequirements] = React.useState<Record<string, any>>({});

  const removeKey = () => {
    clearApiKey();
    setState('apikey');
  };

  const startOver = () => {
    setIdea('');
    setRequirements({});
    setState('landing');
  };

  return (
    <AppShell step={STEP_INDEX[state]} keyActive={state !== 'apikey'} onRemoveKey={removeKey}>
      {state === 'apikey' && <ApiKeyInput onReady={() => setState('landing')} />}
      {state === 'landing' && (
        <LandingScreen
          initialIdea={idea}
          onStart={value => {
            setIdea(value);
            setState('requirements');
          }}
        />
      )}
      {state === 'requirements' && (
        <RequirementsGathering
          idea={idea}
          initial={requirements}
          onBack={answers => {
            setRequirements(answers);
            setState('landing');
          }}
          onComplete={answers => {
            setRequirements(answers);
            setState('workflow');
          }}
        />
      )}
      {state === 'workflow' && (
        <WorkflowVisualization
          projectData={{ idea, requirements }}
          onBack={() => setState('requirements')}
          onRestart={startOver}
        />
      )}
    </AppShell>
  );
};

export default Index;
