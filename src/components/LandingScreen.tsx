import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Lightbulb, Code, Settings, Shield, Key } from 'lucide-react';
import { isApiKeySet, clearApiKey } from '@/utils/deepseekApi';

interface LandingScreenProps {
  onStart: (idea: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [idea, setIdea] = React.useState('');
  // Model selection removed; we use OpenAI by default
  // No model selection - OpenAI is enforced by default

  const handleClearApiKey = () => {
    clearApiKey();
    // Force a page refresh to go back to API key input
       globalThis.location.reload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onStart(idea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-red-900/80 p-6">
      <div className="max-w-6xl mx-auto">
        {/* API Key Status Header */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center space-x-2 bg-gray-900/60 backdrop-blur-2xl border border-green-500/30 rounded-xl px-3 py-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-200">API Key Active</span>
            <Button
              onClick={handleClearApiKey}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-green-300 hover:text-red-300 hover:bg-red-500/20"
            >
              <Key className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-20 pt-20">
          <h1 className="text-4xl font-light text-white mb-6 tracking-tight drop-shadow-neon">
            SaaS Architect
          </h1>
          <p className="text-base text-red-200 max-w-2xl mx-auto leading-relaxed">
            Transform your idea into a structured project plan with intelligent, futuristic guidance.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-12 max-w-3xl mx-auto mb-20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>              <label htmlFor="saas-idea-input" className="block text-base font-medium text-gray-200 mb-4">
                Describe your SaaS idea
              </label>
              <Input
                id="saas-idea-input"
                type="text"
                placeholder="e.g., A project management tool for remote teams..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="h-14 text-base bg-gray-800/80 border-red-400/30 rounded-2xl focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all text-white"
              />
            {/* Model dropdown removed - app uses OpenAI by default */}
            </div>
            
            <Button
              type="submit"
              disabled={!idea.trim()}
              className="w-full h-14 bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white font-medium rounded-2xl transition-all duration-300 text-base shadow-neon"
            >
              Start Planning
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 text-center hover:bg-gray-900/80 transition-all duration-300 shadow-neon">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Lightbulb className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Smart Planning</h3>
            <p className="text-xs text-red-200 leading-relaxed">
              AI-guided requirements gathering for comprehensive project scope
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 text-center hover:bg-gray-900/80 transition-all duration-300 shadow-neon">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Settings className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Architecture Design</h3>
            <p className="text-xs text-red-200 leading-relaxed">
              Visual workflow generation with modern tech stack recommendations
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 text-center hover:bg-gray-900/80 transition-all duration-300 shadow-neon">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Code className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Code Generation</h3>
            <p className="text-xs text-red-200 leading-relaxed">
              Production-ready starter code and comprehensive documentation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
