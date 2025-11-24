import React from 'react';
import LandingScreen from '@/components/LandingScreen';
import RequirementsGathering from '@/components/RequirementsGathering';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import ApiKeyInput from '@/components/ApiKeyInputClean';

type AppState = 'apikey' | 'landing' | 'requirements' | 'workflow';

const Index = () => {
  const [currentState, setCurrentState] = React.useState<AppState>('apikey');
  const [isApiKeySet, setIsApiKeySet] = React.useState(false);  const [projectData, setProjectData] = React.useState({
    idea: '',
    requirements: {},
    workflowData: null,
    techStackData: null
  });

  console.log('Current app state:', currentState);
  console.log('Project data:', projectData);
  console.log('API Key set:', isApiKeySet);

  const handleApiKeySet = (isSet: boolean) => {
    setIsApiKeySet(isSet);
    if (isSet && currentState === 'apikey') {
      setCurrentState('landing');
    } else if (!isSet && currentState !== 'apikey') {
      setCurrentState('apikey');
    }
  };

  const handleStart = (idea: string) => {
    console.log('Starting project with idea:', idea);
    setProjectData(prev => ({ ...prev, idea }));
    setCurrentState('requirements');
  };

  const handleRequirementsComplete = (responses: Record<string, any>) => {
    console.log('Requirements completed:', responses);
    setProjectData(prev => ({ ...prev, requirements: responses }));
    setCurrentState('workflow');
  };  const handleWorkflowComplete = (workflowData: any, techStackData: any) => {
    console.log('Workflow and tech stack completed:', { workflowData, techStackData });
    setProjectData(prev => ({ 
      ...prev, 
      workflowData,
      techStackData    }));
    // No state change - stay on workflow page
  };
  const goBack = (targetState: AppState) => {
    console.log('Going back to:', targetState);
    setCurrentState(targetState);
  };

  const renderCurrentScreen = () => {
    switch (currentState) {
      case 'apikey':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-red-900/80 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">SaaS Architect Genesis</h1>
                <p className="text-gray-300">AI-Powered SaaS Architecture Design</p>
              </div>
              <ApiKeyInput onApiKeySet={handleApiKeySet} />
            </div>
          </div>
        );
      
      case 'landing':
        return <LandingScreen onStart={handleStart} />;
      
      case 'requirements':
        return (
          <RequirementsGathering
            idea={projectData.idea}
            onComplete={handleRequirementsComplete}
            onBack={() => goBack('landing')}
          />
        );
        case 'workflow':
        return (          <WorkflowVisualization
            projectData={projectData}
            onComplete={handleWorkflowComplete}
            onBack={() => goBack('requirements')}
          />
        );
      
      default:
        return <LandingScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
