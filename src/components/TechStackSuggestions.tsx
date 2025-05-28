
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface TechOption {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'deployment' | 'authentication' | 'payment';
  description: string;
  pros: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  popular: boolean;
  recommended?: boolean;
}

const techOptions: TechOption[] = [
  {
    id: 'react',
    name: 'React + TypeScript',
    category: 'frontend',
    description: 'Modern React with TypeScript for type safety and better developer experience.',
    pros: ['Large ecosystem', 'Strong typing', 'Great tooling'],
    complexity: 'Intermediate',
    popular: true,
    recommended: true
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    description: 'Full-stack React framework with SSR, API routes, and excellent performance.',
    pros: ['SEO friendly', 'Built-in API', 'Great performance'],
    complexity: 'Intermediate',
    popular: true
  },
  {
    id: 'nodejs',
    name: 'Node.js + Express',
    category: 'backend',
    description: 'JavaScript runtime with Express framework for building scalable APIs.',
    pros: ['Same language as frontend', 'Fast development', 'Large ecosystem'],
    complexity: 'Beginner',
    popular: true,
    recommended: true
  },
  {
    id: 'python',
    name: 'Python + FastAPI',
    category: 'backend',
    description: 'Modern Python framework with automatic API documentation and type hints.',
    pros: ['Easy to learn', 'Great for AI/ML', 'Excellent docs'],
    complexity: 'Beginner',
    popular: true
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Powerful open-source relational database with advanced features.',
    pros: ['ACID compliant', 'Rich data types', 'Great performance'],
    complexity: 'Intermediate',
    popular: true,
    recommended: true
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    description: 'NoSQL document database for flexible, scalable applications.',
    pros: ['Flexible schema', 'Easy scaling', 'JSON-like documents'],
    complexity: 'Beginner',
    popular: true
  },
  {
    id: 'auth0',
    name: 'Auth0',
    category: 'authentication',
    description: 'Complete authentication and authorization platform.',
    pros: ['Easy integration', 'Many providers', 'Enterprise ready'],
    complexity: 'Beginner',
    popular: true,
    recommended: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    description: 'Complete payment platform with powerful APIs and webhooks.',
    pros: ['Developer friendly', 'Global coverage', 'Great docs'],
    complexity: 'Intermediate',
    popular: true,
    recommended: true
  }
];

const categoryColors = {
  frontend: 'from-blue-500 to-cyan-500',
  backend: 'from-purple-500 to-pink-500',
  database: 'from-green-500 to-teal-500',
  deployment: 'from-orange-500 to-red-500',
  authentication: 'from-indigo-500 to-purple-500',
  payment: 'from-yellow-500 to-orange-500'
};

const complexityColors = {
  'Beginner': 'bg-green-500/20 text-green-300',
  'Intermediate': 'bg-yellow-500/20 text-yellow-300',
  'Advanced': 'bg-red-500/20 text-red-300'
};

interface TechStackSuggestionsProps {
  onContinue: () => void;
  onBack: () => void;
}

const TechStackSuggestions: React.FC<TechStackSuggestionsProps> = ({ onContinue, onBack }) => {
  const [selectedTech, setSelectedTech] = React.useState<Set<string>>(
    new Set(techOptions.filter(t => t.recommended).map(t => t.id))
  );

  const categories = [...new Set(techOptions.map(t => t.category))];

  const toggleTech = (techId: string) => {
    const newSelected = new Set(selectedTech);
    if (newSelected.has(techId)) {
      newSelected.delete(techId);
    } else {
      newSelected.add(techId);
    }
    setSelectedTech(newSelected);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-8 mb-6 animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Choose Your Tech Stack
          </h2>
          <p className="text-xl text-muted-foreground">
            We've recommended the best technologies for your project. Customize your selection below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tech Options */}
          <div className="lg:col-span-3 space-y-8">
            {categories.map(category => (
              <div key={category} className="space-y-4">
                <h3 className="text-2xl font-semibold capitalize gradient-text">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {techOptions
                    .filter(tech => tech.category === category)
                    .map(tech => (
                      <Card
                        key={tech.id}
                        className={`glass-card p-6 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                          selectedTech.has(tech.id) ? 'neon-border bg-white/10' : ''
                        }`}
                        onClick={() => toggleTech(tech.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${categoryColors[category]}`}></div>
                            <h4 className="font-semibold text-lg">{tech.name}</h4>
                          </div>
                          <div className="flex space-x-2">
                            {tech.recommended && (
                              <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                                Recommended
                              </Badge>
                            )}
                            {tech.popular && (
                              <Badge variant="outline" className="border-white/30">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 text-sm">
                          {tech.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Complexity:</span>
                            <Badge className={complexityColors[tech.complexity]}>
                              {tech.complexity}
                            </Badge>
                          </div>
                          
                          <div>
                            <span className="text-sm text-muted-foreground mb-2 block">Key Benefits:</span>
                            <div className="flex flex-wrap gap-2">
                              {tech.pros.map(pro => (
                                <Badge key={pro} variant="outline" className="text-xs border-white/20">
                                  {pro}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Stack Summary */}
          <div className="space-y-4">
            <Card className="glass-panel p-6 sticky top-6">
              <h3 className="text-xl font-semibold gradient-text mb-4">Your Stack</h3>
              <div className="space-y-3">
                {selectedTech.size === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Select technologies to build your stack
                  </p>
                ) : (
                  Array.from(selectedTech).map(techId => {
                    const tech = techOptions.find(t => t.id === techId);
                    if (!tech) return null;
                    return (
                      <div key={techId} className="flex items-center space-x-3 p-2 glass-card rounded">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColors[tech.category]}`}></div>
                        <span className="text-sm font-medium">{tech.name}</span>
                      </div>
                    );
                  })
                )}
              </div>
              
              {selectedTech.size > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between mb-2">
                      <span>Complexity:</span>
                      <span className="text-neon-cyan">Medium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technologies:</span>
                      <span className="text-neon-cyan">{selectedTech.size}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="glass-card border-white/20 hover:bg-white/10 px-8 py-6"
          >
            Back to Workflow
          </Button>
          
          <Button
            onClick={onContinue}
            disabled={selectedTech.size === 0}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-cyan px-8 py-6 neon-glow"
          >
            Generate Code
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechStackSuggestions;
