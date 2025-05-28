
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: string[];
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: 'audience',
    question: 'Who is your target audience?',
    type: 'textarea',
    placeholder: 'Describe your ideal users, their needs, and pain points...'
  },
  {
    id: 'features',
    question: 'What are the core features you envision?',
    type: 'textarea',
    placeholder: 'List the main features and functionalities...'
  },
  {
    id: 'authentication',
    question: 'What authentication methods do you need?',
    type: 'multiselect',
    options: ['Email/Password', 'Social Login (Google, GitHub)', 'SSO', 'Multi-factor Authentication']
  },
  {
    id: 'payment',
    question: 'Do you need payment processing?',
    type: 'select',
    options: ['No payments needed', 'One-time payments', 'Subscriptions', 'Both one-time and subscriptions']
  },
  {
    id: 'scale',
    question: 'What scale are you planning for?',
    type: 'select',
    options: ['MVP (< 1K users)', 'Growing (1K-10K users)', 'Scale (10K-100K users)', 'Enterprise (100K+ users)']
  },
  {
    id: 'integrations',
    question: 'Any specific third-party integrations needed?',
    type: 'textarea',
    placeholder: 'APIs, services, or tools you want to integrate...'
  }
];

interface RequirementsGatheringProps {
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
}

const RequirementsGathering: React.FC<RequirementsGatheringProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [responses, setResponses] = React.useState<Record<string, any>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const renderInput = () => {
    const value = responses[currentQuestion.id] || '';

    switch (currentQuestion.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => updateResponse(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="glass-card min-h-32 text-lg border-0 focus:neon-border resize-none"
          />
        );
      
      case 'select':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <Card
                key={option}
                className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                  value === option ? 'neon-border bg-white/10' : ''
                }`}
                onClick={() => updateResponse(option)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    value === option ? 'bg-neon-blue border-neon-blue' : 'border-gray-400'
                  }`}></div>
                  <span className="text-lg">{option}</span>
                </div>
              </Card>
            ))}
          </div>
        );
      
      case 'multiselect':
        const selectedOptions = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <Card
                key={option}
                className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                  selectedOptions.includes(option) ? 'neon-border bg-white/10' : ''
                }`}
                onClick={() => {
                  const newSelected = selectedOptions.includes(option)
                    ? selectedOptions.filter(item => item !== option)
                    : [...selectedOptions, option];
                  updateResponse(newSelected);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 ${
                    selectedOptions.includes(option) ? 'bg-neon-blue border-neon-blue' : 'border-gray-400'
                  }`}></div>
                  <span className="text-lg">{option}</span>
                </div>
              </Card>
            ))}
          </div>
        );
      
      default:
        return (
          <Input
            value={value}
            onChange={(e) => updateResponse(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="glass-card text-lg py-6 border-0 focus:neon-border"
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-panel p-8 max-w-3xl w-full animate-fade-in">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all duration-500 glow-animation"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-6">
            {currentQuestion.question}
          </h2>
          {renderInput()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="glass-card border-white/20 hover:bg-white/10 px-8 py-6"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            {currentStep === 0 ? 'Back to Start' : 'Previous'}
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-cyan px-8 py-6 neon-glow"
          >
            {currentStep === questions.length - 1 ? 'Generate Workflow' : 'Next'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsGathering;
