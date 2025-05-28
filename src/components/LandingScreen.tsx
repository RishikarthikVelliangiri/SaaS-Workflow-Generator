
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-panel p-12 max-w-2xl w-full text-center animate-fade-in">
        <div className="floating-animation">
          <h1 className="text-6xl font-bold gradient-text mb-6">
            SaaS Designer
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto mb-8 rounded-full glow-animation"></div>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          Transform your SaaS idea into a complete project architecture with the power of AI. 
          From concept to code, we'll guide you through every step.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Describe your SaaS idea..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="glass-card text-lg py-6 px-6 text-center border-0 focus:neon-border transition-all duration-300"
            />
          </div>
          
          <Button
            type="submit"
            disabled={!idea.trim()}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all duration-300 transform hover:scale-105 neon-glow"
          >
            Start Building
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <div className="mt-12 grid grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="glass-card p-4 rounded-lg">
            <div className="w-8 h-8 bg-neon-blue/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-neon-blue rounded-full pulse-neon"></div>
            </div>
            <span>AI-Powered</span>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="w-8 h-8 bg-neon-purple/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-neon-purple rounded-full pulse-neon"></div>
            </div>
            <span>Full Stack</span>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <div className="w-8 h-8 bg-neon-cyan/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-neon-cyan rounded-full pulse-neon"></div>
            </div>
            <span>Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
