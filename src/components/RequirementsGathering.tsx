
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: string[];
  placeholder?: string;
  allowAiDecision?: boolean;
}

const questions: Question[] = [
  {
    id: 'audience',
    question: 'Who is your target audience?',
    type: 'textarea',
    placeholder: 'Describe your ideal users, their needs, and pain points...',
    allowAiDecision: true
  },
  {
    id: 'features',
    question: 'What are the core features you envision?',
    type: 'textarea',
    placeholder: 'List the main features and functionalities...',
    allowAiDecision: true
  },
  {
    id: 'authentication',
    question: 'What authentication methods do you need?',
    type: 'multiselect',
    options: ['Email/Password', 'Social Login (Google, GitHub)', 'SSO', 'Multi-factor Authentication'],
    allowAiDecision: true
  },
  {
    id: 'payment',
    question: 'Do you need payment processing?',
    type: 'select',
    options: ['No payments needed', 'One-time payments', 'Subscriptions', 'Both one-time and subscriptions'],
    allowAiDecision: true
  },
  {
    id: 'scale',
    question: 'What scale are you planning for?',
    type: 'select',
    options: ['MVP (< 1K users)', 'Growing (1K-10K users)', 'Scale (10K-100K users)', 'Enterprise (100K+ users)'],
    allowAiDecision: true
  },
  {
    id: 'integrations',
    question: 'Any specific third-party integrations needed?',
    type: 'textarea',
    placeholder: 'APIs, services, or tools you want to integrate...',
    allowAiDecision: true
  }
];

interface RequirementsGatheringProps {
  idea: string;
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
}

const RequirementsGathering: React.FC<RequirementsGatheringProps> = ({ idea, onComplete, onBack }) => {
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

  const handleAiDecision = () => {
    updateResponse('AI_DECIDE');
  };

  const renderInput = () => {
    const value = responses[currentQuestion.id] || '';
    const isAiDecision = value === 'AI_DECIDE';

    if (isAiDecision) {
      return (
        <div className="bg-light_blue-100/10 border border-light_blue-300/30 rounded-2xl p-8 text-center">
          <Sparkles className="h-12 w-12 text-light_blue-500 mx-auto mb-4" />
          <p className="text-lg text-light_blue-600 font-medium">AI will decide this for you</p>
          <p className="text-rose_taupe-400 mt-2">Our AI will analyze your project idea and make the best recommendation</p>
          <Button
            onClick={() => updateResponse('')}
            variant="outline"
            className="mt-4 bg-white/60 border-light_blue-200 hover:bg-white/80"
          >
            Change my mind
          </Button>
        </div>
      );
    }

    switch (currentQuestion.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => updateResponse(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="min-h-32 text-lg bg-white/80 border-light_blue-200 rounded-2xl focus:border-light_blue-400 focus:ring-2 focus:ring-light_blue-400/20 resize-none transition-all"
          />
        );
      
      case 'select':
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option) => (
              <Card
                key={option}
                className={`bg-white/70 border-light_blue-200/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-white/80 hover:shadow-md ${
                  value === option ? 'ring-2 ring-light_blue-400 bg-white/90' : ''
                }`}
                onClick={() => updateResponse(option)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                    value === option ? 'bg-light_blue-500 border-light_blue-500' : 'border-light_blue-300'
                  }`}></div>
                  <span className="text-lg text-onyx-300">{option}</span>
                </div>
              </Card>
            ))}
          </div>
        );
      
      case 'multiselect':
        const selectedOptions = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option) => (
              <Card
                key={option}
                className={`bg-white/70 border-light_blue-200/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:bg-white/80 hover:shadow-md ${
                  selectedOptions.includes(option) ? 'ring-2 ring-light_blue-400 bg-white/90' : ''
                }`}
                onClick={() => {
                  const newSelected = selectedOptions.includes(option)
                    ? selectedOptions.filter(item => item !== option)
                    : [...selectedOptions, option];
                  updateResponse(newSelected);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-5 h-5 rounded border-2 transition-all ${
                    selectedOptions.includes(option) ? 'bg-light_blue-500 border-light_blue-500' : 'border-light_blue-300'
                  }`}></div>
                  <span className="text-lg text-onyx-300">{option}</span>
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
            className="h-16 text-lg bg-white/80 border-light_blue-200 rounded-2xl focus:border-light_blue-400 focus:ring-2 focus:ring-light_blue-400/20 transition-all"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-mint_cream-500 flex items-center justify-center p-6">
      <div className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-12 max-w-4xl w-full shadow-lg animate-fade-in">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-rose_taupe-400 mb-3">
            <span>Step {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-light_blue-100 rounded-full h-3">
            <div 
              className="bg-light_blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-onyx-200 mb-8 leading-tight">
            {currentQuestion.question}
          </h2>
          
          {/* AI Decision Button */}
          {currentQuestion.allowAiDecision && responses[currentQuestion.id] !== 'AI_DECIDE' && (
            <div className="mb-8">
              <Button
                onClick={handleAiDecision}
                className="bg-gradient-to-r from-light_blue-500 to-light_blue-400 hover:from-light_blue-400 hover:to-light_blue-300 text-white px-6 py-3 rounded-2xl transition-all mb-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Let AI decide
              </Button>
            </div>
          )}
          
          {renderInput()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="bg-white/60 border-light_blue-200 hover:bg-white/80 px-8 py-4 rounded-2xl transition-all"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            {currentStep === 0 ? 'Back to Start' : 'Previous'}
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-light_blue-500 hover:bg-light_blue-400 text-white px-8 py-4 rounded-2xl transition-all"
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
