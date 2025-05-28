
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectSummaryProps {
  onRestart: () => void;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-mint_cream-500 p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full space-y-12">
        <div className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-16 text-center shadow-lg animate-fade-in">
          <div className="mb-8">
            <div className="w-24 h-24 bg-light_blue-500 rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-semibold text-onyx-200 mb-8">
            Project Complete!
          </h1>
          <p className="text-xl text-rose_taupe-400 mb-12 leading-relaxed">
            Your SaaS application architecture is ready. You now have everything needed to start building.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/60 border border-light_blue-200/50 rounded-3xl p-8 shadow-md">
              <div className="w-16 h-16 bg-light_blue-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-light_blue-500 rounded-xl"></div>
              </div>
              <h3 className="font-semibold text-onyx-300 mb-3">Architecture Designed</h3>
              <p className="text-sm text-rose_taupe-400 leading-relaxed">Complete system architecture with all components mapped</p>
            </Card>
            
            <Card className="bg-white/60 border border-timberwolf-200/50 rounded-3xl p-8 shadow-md">
              <div className="w-16 h-16 bg-timberwolf-400/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-timberwolf-400 rounded-xl"></div>
              </div>
              <h3 className="font-semibold text-onyx-300 mb-3">Tech Stack Selected</h3>
              <p className="text-sm text-rose_taupe-400 leading-relaxed">Optimal technology choices for your requirements</p>
            </Card>
            
            <Card className="bg-white/60 border border-rose_taupe-200/50 rounded-3xl p-8 shadow-md">
              <div className="w-16 h-16 bg-rose_taupe-400/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-rose_taupe-400 rounded-xl"></div>
              </div>
              <h3 className="font-semibold text-onyx-300 mb-3">Code Generated</h3>
              <p className="text-sm text-rose_taupe-400 leading-relaxed">Production-ready starter code and documentation</p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-10 shadow-lg">
            <h2 className="text-2xl font-semibold text-onyx-200 mb-8">What You Received</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-onyx-300">Project Architecture</span>
                <Badge className="bg-light_blue-500/20 text-light_blue-600 rounded-xl">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-onyx-300">Tech Stack Recommendations</span>
                <Badge className="bg-light_blue-500/20 text-light_blue-600 rounded-xl">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-onyx-300">Starter Code</span>
                <Badge className="bg-light_blue-500/20 text-light_blue-600 rounded-xl">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-onyx-300">API Integrations</span>
                <Badge className="bg-light_blue-500/20 text-light_blue-600 rounded-xl">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-onyx-300">Deployment Guide</span>
                <Badge className="bg-light_blue-500/20 text-light_blue-600 rounded-xl">Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-onyx-300">Documentation</span>
                <Badge className="bg-light_blue-500/20 text-light_blue-600 rounded-xl">Complete</Badge>
              </div>
            </div>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-10 shadow-lg">
            <h2 className="text-2xl font-semibold text-onyx-200 mb-8">Recommended Next Steps</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-light_blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white mt-1">1</div>
                <div>
                  <h4 className="font-semibold text-onyx-300 mb-1">Set Up Development Environment</h4>
                  <p className="text-sm text-rose_taupe-400 leading-relaxed">Install dependencies and configure your local setup</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-timberwolf-400 rounded-full flex items-center justify-center text-sm font-bold text-white mt-1">2</div>
                <div>
                  <h4 className="font-semibold text-onyx-300 mb-1">Configure Third-party Services</h4>
                  <p className="text-sm text-rose_taupe-400 leading-relaxed">Set up Auth0, Stripe, and database connections</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-rose_taupe-400 rounded-full flex items-center justify-center text-sm font-bold text-white mt-1">3</div>
                <div>
                  <h4 className="font-semibold text-onyx-300 mb-1">Customize and Extend</h4>
                  <p className="text-sm text-rose_taupe-400 leading-relaxed">Adapt the code to your specific requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-light_blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white mt-1">4</div>
                <div>
                  <h4 className="font-semibold text-onyx-300 mb-1">Deploy and Launch</h4>
                  <p className="text-sm text-rose_taupe-400 leading-relaxed">Deploy to production and start onboarding users</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={onRestart}
            className="bg-light_blue-500 hover:bg-light_blue-400 text-white px-16 py-6 text-lg rounded-3xl shadow-lg transition-all"
          >
            Create Another Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
