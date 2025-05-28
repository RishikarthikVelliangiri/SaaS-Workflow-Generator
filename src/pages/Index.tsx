
import React from 'react';
import LandingScreen from '@/components/LandingScreen';
import RequirementsGathering from '@/components/RequirementsGathering';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import TechStackSuggestions from '@/components/TechStackSuggestions';
import ProjectSummary from '@/components/ProjectSummary';

type AppState = 'landing' | 'requirements' | 'workflow' | 'techstack' | 'summary';

const Index = () => {
  const [currentState, setCurrentState] = React.useState<AppState>('landing');
  const [projectData, setProjectData] = React.useState({
    idea: '',
    requirements: {},
    workflowData: null
  });

  console.log('Current app state:', currentState);
  console.log('Project data:', projectData);

  const handleStart = (idea: string) => {
    console.log('Starting project with idea:', idea);
    setProjectData(prev => ({ ...prev, idea }));
    setCurrentState('requirements');
  };

  const handleRequirementsComplete = (responses: Record<string, any>) => {
    console.log('Requirements completed:', responses);
    setProjectData(prev => ({ ...prev, requirements: responses }));
    setCurrentState('workflow');
  };

  const handleWorkflowComplete = (workflowData: any) => {
    console.log('Workflow completed:', workflowData);
    setProjectData(prev => ({ ...prev, workflowData }));
    setCurrentState('techstack');
  };

  const handleTechStackContinue = () => {
    console.log('Moving from tech stack to summary');
    setCurrentState('summary');
  };

  const handleRestart = () => {
    console.log('Restarting application');
    setCurrentState('landing');
    setProjectData({ idea: '', requirements: {}, workflowData: null });
  };

  const goBack = (targetState: AppState) => {
    console.log('Going back to:', targetState);
    setCurrentState(targetState);
  };

  const renderCurrentScreen = () => {
    switch (currentState) {
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
        return (
          <WorkflowVisualization
            projectData={projectData}
            onComplete={handleWorkflowComplete}
            onBack={() => goBack('requirements')}
          />
        );
      
      case 'techstack':
        return (
          <TechStackSuggestions
            onContinue={handleTechStackContinue}
            onBack={() => goBack('workflow')}
          />
        );
      
      case 'summary':
        return <ProjectSummary onRestart={handleRestart} />;
      
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
