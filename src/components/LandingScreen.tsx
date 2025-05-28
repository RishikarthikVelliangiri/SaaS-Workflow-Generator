
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
    <div className="min-h-screen bg-mint_cream-500 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 pt-20">
          <h1 className="text-6xl font-light text-onyx-200 mb-6 tracking-tight">
            SaaS Architect
          </h1>
          <p className="text-xl text-rose_taupe-400 max-w-2xl mx-auto leading-relaxed">
            Transform your idea into a structured project plan with intelligent guidance
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-12 max-w-3xl mx-auto mb-20 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-onyx-300 mb-4">
                Describe your SaaS idea
              </label>
              <Input
                type="text"
                placeholder="e.g., A project management tool for remote teams..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="h-16 text-lg bg-white/80 border-light_blue-200 rounded-2xl focus:border-light_blue-400 focus:ring-2 focus:ring-light_blue-400/20 transition-all"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!idea.trim()}
              className="w-full h-16 bg-light_blue-500 hover:bg-light_blue-400 text-white font-medium rounded-2xl transition-all duration-300 text-lg"
            >
              Start Planning
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm border border-light_blue-200/50 rounded-3xl p-8 text-center hover:bg-white/70 transition-all duration-300">
            <div className="w-16 h-16 bg-light_blue-100/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Lightbulb className="h-8 w-8 text-light_blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-onyx-300 mb-3">Smart Planning</h3>
            <p className="text-rose_taupe-400 leading-relaxed">
              AI-guided requirements gathering for comprehensive project scope
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-timberwolf-300/50 rounded-3xl p-8 text-center hover:bg-white/70 transition-all duration-300">
            <div className="w-16 h-16 bg-timberwolf-200/30 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Settings className="h-8 w-8 text-timberwolf-400" />
            </div>
            <h3 className="text-xl font-semibold text-onyx-300 mb-3">Architecture Design</h3>
            <p className="text-rose_taupe-400 leading-relaxed">
              Visual workflow generation with modern tech stack recommendations
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-rose_taupe-300/50 rounded-3xl p-8 text-center hover:bg-white/70 transition-all duration-300">
            <div className="w-16 h-16 bg-rose_taupe-200/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Code className="h-8 w-8 text-rose_taupe-400" />
            </div>
            <h3 className="text-xl font-semibold text-onyx-300 mb-3">Code Generation</h3>
            <p className="text-rose_taupe-400 leading-relaxed">
              Production-ready starter code and comprehensive documentation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
