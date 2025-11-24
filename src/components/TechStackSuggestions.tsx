import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateTechStackWithReasons } from '@/utils/deepseekApi';

interface TechStackSuggestionsProps {
  onContinue: () => void;
  onBack: () => void;
  projectData: {
    idea: string;
    requirements: Record<string, any>;
  };
}

const categoryColors: Record<string, string> = {
  frontend: 'from-red-400/60 to-gray-700/80',
  backend: 'from-gray-500/60 to-red-700/80',
  database: 'from-gray-400/60 to-red-900/80',
  deployment: 'from-gray-700/60 to-red-900/80',
  authentication: 'from-red-600/60 to-gray-900/80',
  payment: 'from-red-300/60 to-gray-600/80',
};

const TechStackSuggestions: React.FC<TechStackSuggestionsProps> = ({ onContinue, onBack, projectData }) => {
  const [techStack, setTechStack] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchStack = async () => {
      setLoading(true);
      setError(null);
      try {
        const stack = await generateTechStackWithReasons(projectData.idea, projectData.requirements);
        setTechStack(stack);
      } catch (err) {
        // Error is handled by setting error state for user feedback
        setError('Failed to fetch tech stack. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStack();
  }, [projectData]);

  const categories = Array.from(new Set(techStack.map(t => t.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-red-900/80 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-10 mb-8 animate-fade-in shadow-2xl border border-red-400/20 rounded-3xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-gray-500/10 rounded-3xl blur-xl"></div>
          <h2 className="text-5xl font-extrabold text-white mb-4 drop-shadow-neon tracking-tight" style={{fontFamily: 'Orbitron, Inter, sans-serif'}}>AI-Selected Tech Stack</h2>
          <p className="text-2xl text-red-200 mb-2">The optimal technologies for your futuristic SaaS project.</p>
          <p className="text-lg text-red-100/80">Each card is chosen by the AI model (OpenAI) and includes a reason for its selection.</p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-400 border-opacity-60"></div>
            <span className="ml-6 text-xl text-red-200 font-mono">Generating stack...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 font-semibold p-8 bg-gray-900/60 rounded-2xl border border-red-500/30 shadow-neon">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tech Options */}
            <div className="lg:col-span-3 space-y-10">
              {categories.map(category => (
                <div key={category} className="space-y-4">
                  <h3 className="text-3xl font-semibold capitalize text-white mb-2 drop-shadow-neon tracking-wide" style={{fontFamily: 'Orbitron, Inter, sans-serif'}}>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {techStack.filter(tech => tech.category === category).map(tech => (
                      <Card
                        key={tech.id}
                        className={`bg-gray-900/60 backdrop-blur-2xl border border-red-400/30 rounded-2xl p-8 transition-all duration-300 shadow-neon hover:bg-gray-900/80 group`}
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${categoryColors[category] ?? 'from-gray-700 to-red-700'} shadow-neon`}></div>
                          <h4 className="font-bold text-xl text-white drop-shadow-neon" style={{fontFamily: 'Orbitron, Inter, sans-serif'}}>{tech.name}</h4>
                        </div>
                        <p className="text-red-200/90 mb-4 text-base font-mono">{tech.reason}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Stack Summary */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-2xl border border-red-400/30 rounded-2xl p-8 shadow-neon sticky top-6">
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-neon" style={{fontFamily: 'Orbitron, Inter, sans-serif'}}>Your Stack</h3>
                <div className="space-y-4">
                  {techStack.length === 0 ? (
                    <p className="text-red-200/80 text-base">No stack generated.</p>                  ) : (
                    techStack.map(tech => (
                      <div key={tech.id} className="flex items-center space-x-4 p-3 bg-gray-900/60 rounded shadow-neon">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${categoryColors[tech.category] ?? 'from-gray-700 to-red-700'} shadow-neon`}></div>
                        <span className="text-base font-medium text-white drop-shadow-neon" style={{fontFamily: 'Orbitron, Inter, sans-serif'}}>{tech.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-gray-900/60 border-red-500/30 hover:bg-gray-900/80 text-white px-10 py-6 rounded-2xl shadow-neon"
          >
            Back to Workflow
          </Button>
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white px-10 py-6 rounded-2xl shadow-neon font-semibold"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechStackSuggestions;
