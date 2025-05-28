
import React from 'react';
import LandingScreen from '@/components/LandingScreen';
import RequirementsGathering from '@/components/RequirementsGathering';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import TechStackSuggestions from '@/components/TechStackSuggestions';
import CodeGeneration from '@/components/CodeGeneration';
import ProjectSummary from '@/components/ProjectSummary';

type AppState = 'landing' | 'requirements' | 'workflow' | 'techstack' | 'codegen' | 'summary';

const Index = () => {
  const [currentState, setCurrentState] = React.useState<AppState>('landing');
  const [projectData, setProjectData] = React.useState({
    idea: '',
    requirements: {}
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

  const handleWorkflowContinue = () => {
    console.log('Moving from workflow to tech stack');
    setCurrentState('techstack');
  };

  const handleTechStackContinue = () => {
    console.log('Moving from tech stack to code generation');
    setCurrentState('codegen');
  };

  const handleCodeGenComplete = () => {
    console.log('Code generation complete, moving to summary');
    setCurrentState('summary');
  };

  const handleRestart = () => {
    console.log('Restarting application');
    setCurrentState('landing');
    setProjectData({ idea: '', requirements: {} });
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
            onComplete={handleRequirementsComplete}
            onBack={() => goBack('landing')}
          />
        );
      
      case 'workflow':
        return (
          <WorkflowVisualization
            onContinue={handleWorkflowContinue}
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
      
      case 'codegen':
        return (
          <CodeGeneration
            onComplete={handleCodeGenComplete}
            onBack={() => goBack('techstack')}
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
