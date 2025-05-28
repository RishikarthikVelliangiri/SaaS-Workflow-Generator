
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectSummaryProps {
  onRestart: () => void;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="glass-panel p-12 text-center animate-fade-in">
          <div className="floating-animation mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Project Complete!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your SaaS application architecture is ready. You now have everything needed to start building.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card p-6">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-neon-blue rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Architecture Designed</h3>
              <p className="text-sm text-muted-foreground">Complete system architecture with all components mapped</p>
            </Card>
            
            <Card className="glass-card p-6">
              <div className="w-12 h-12 bg-neon-purple/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-neon-purple rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Tech Stack Selected</h3>
              <p className="text-sm text-muted-foreground">Optimal technology choices for your requirements</p>
            </Card>
            
            <Card className="glass-card p-6">
              <div className="w-12 h-12 bg-neon-cyan/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-neon-cyan rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Code Generated</h3>
              <p className="text-sm text-muted-foreground">Production-ready starter code and documentation</p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-panel p-8">
            <h2 className="text-2xl font-bold gradient-text mb-6">What You Received</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Project Architecture</span>
                <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Tech Stack Recommendations</span>
                <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Starter Code</span>
                <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>API Integrations</span>
                <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Deployment Guide</span>
                <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Documentation</span>
                <Badge className="bg-green-500/20 text-green-400">Complete</Badge>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-8">
            <h2 className="text-2xl font-bold gradient-text mb-6">Recommended Next Steps</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <div>
                  <h4 className="font-semibold">Set Up Development Environment</h4>
                  <p className="text-sm text-muted-foreground">Install dependencies and configure your local setup</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <div>
                  <h4 className="font-semibold">Configure Third-party Services</h4>
                  <p className="text-sm text-muted-foreground">Set up Auth0, Stripe, and database connections</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <div>
                  <h4 className="font-semibold">Customize and Extend</h4>
                  <p className="text-sm text-muted-foreground">Adapt the code to your specific requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                <div>
                  <h4 className="font-semibold">Deploy and Launch</h4>
                  <p className="text-sm text-muted-foreground">Deploy to production and start onboarding users</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-cyan px-12 py-6 text-lg neon-glow"
          >
            Create Another Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
