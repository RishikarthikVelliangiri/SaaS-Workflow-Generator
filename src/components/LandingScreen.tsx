
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Lightbulb, Code, Settings } from 'lucide-react';

interface LandingScreenProps {
  onStart: (idea: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [idea, setIdea] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onStart(idea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint_cream-500 to-timberwolf-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 pt-16">
          <h1 className="text-5xl font-light text-onyx-200 mb-4">
            SaaS Architect
          </h1>
          <p className="text-xl text-rose_taupe-300 max-w-2xl mx-auto">
            Transform your idea into a structured project plan with intelligent guidance
          </p>
        </div>

        {/* Main Form */}
        <div className="minimal-panel p-8 max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-onyx-300 mb-3">
                Describe your SaaS idea
              </label>
              <Input
                type="text"
                placeholder="e.g., A project management tool for remote teams..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="h-12 text-base bg-mint_cream-600 border-light_blue-300 focus:border-light_blue-500 focus:ring-light_blue-500/20"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!idea.trim()}
              className="w-full h-12 bg-light_blue-500 hover:bg-light_blue-400 text-light_blue-100 font-medium transition-all duration-200"
            >
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="simple-card p-6 text-center">
            <div className="w-12 h-12 bg-light_blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-light_blue-500" />
            </div>
            <h3 className="font-medium text-onyx-300 mb-2">Smart Planning</h3>
            <p className="text-sm text-rose_taupe-400">
              AI-guided requirements gathering
            </p>
          </div>

          <div className="simple-card p-6 text-center">
            <div className="w-12 h-12 bg-timberwolf-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-6 w-6 text-timberwolf-100" />
            </div>
            <h3 className="font-medium text-onyx-300 mb-2">Architecture Design</h3>
            <p className="text-sm text-rose_taupe-400">
              Visual workflow generation
            </p>
          </div>

          <div className="simple-card p-6 text-center">
            <div className="w-12 h-12 bg-rose_taupe-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Code className="h-6 w-6 text-rose_taupe-100" />
            </div>
            <h3 className="font-medium text-onyx-300 mb-2">Code Generation</h3>
            <p className="text-sm text-rose_taupe-400">
              Ready-to-use project scaffolds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
