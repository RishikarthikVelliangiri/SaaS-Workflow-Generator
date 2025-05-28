
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Brain, Loader2 } from 'lucide-react';
import { callDeepSeekAPI } from '@/utils/deepseekApi';

interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: string[];
  description?: string;
}

interface WorkflowVisualizationProps {
  projectData: {
    idea: string;
    requirements: Record<string, any>;
  };
  onComplete: (workflowData: any) => void;
  onBack: () => void;
}

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ 
  projectData, 
  onComplete, 
  onBack 
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [workflowNodes, setWorkflowNodes] = React.useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [workflowGenerated, setWorkflowGenerated] = React.useState(false);

  React.useEffect(() => {
    generateWorkflow();
  }, []);

  const generateWorkflow = async () => {
    setIsGenerating(true);
    try {
      const requirementsText = Object.entries(projectData.requirements)
        .map(([key, value]) => {
          if (value === 'AI_DECIDE') {
            return `${key}: Let AI decide`;
          }
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');

      const prompt = `
        Generate a detailed SaaS architecture workflow for the following project:
        
        Idea: ${projectData.idea}
        Requirements:
        ${requirementsText}
        
        Please create a JSON response with an array of workflow nodes. Each node should have:
        - id: unique identifier
        - label: display name
        - type: component type (frontend, backend, database, api, auth, payment, storage, etc.)
        - x: x coordinate (0-800)
        - y: y coordinate (0-400)
        - connections: array of node IDs this connects to
        - description: brief description of what this component does
        
        Create a realistic, modern SaaS architecture based on the requirements. Include appropriate services for the scale and features requested.
        
        Return only the JSON array, no other text.
      `;

      const response = await callDeepSeekAPI([
        {
          role: 'system',
          content: 'You are a SaaS architecture expert. Generate realistic, modern architecture workflows based on project requirements. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      // Parse the AI response
      let nodes: WorkflowNode[] = [];
      try {
        const cleanResponse = response.replace(/```json|```/g, '').trim();
        nodes = JSON.parse(cleanResponse);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        // Fallback to default workflow
        nodes = generateFallbackWorkflow();
      }

      setWorkflowNodes(nodes);
      setWorkflowGenerated(true);
    } catch (error) {
      console.error('Error generating workflow:', error);
      // Fallback to default workflow
      setWorkflowNodes(generateFallbackWorkflow());
      setWorkflowGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackWorkflow = (): WorkflowNode[] => {
    return [
      { id: 'frontend', label: 'React Frontend', type: 'frontend', x: 100, y: 200, connections: ['auth', 'api'], description: 'User interface built with React' },
      { id: 'auth', label: 'Authentication', type: 'auth', x: 300, y: 100, connections: ['backend'], description: 'User authentication and authorization' },
      { id: 'api', label: 'REST API', type: 'api', x: 300, y: 200, connections: ['backend'], description: 'API endpoints for data access' },
      { id: 'backend', label: 'Backend Service', type: 'backend', x: 500, y: 150, connections: ['database'], description: 'Core business logic and data processing' },
      { id: 'database', label: 'Database', type: 'database', x: 700, y: 150, connections: [], description: 'Data storage and management' }
    ];
  };

  const getNodeColor = (type: string) => {
    const colors = {
      frontend: 'bg-light_blue-400 border-light_blue-500',
      backend: 'bg-rose_taupe-400 border-rose_taupe-500',
      database: 'bg-timberwolf-400 border-timberwolf-500',
      api: 'bg-light_blue-500 border-light_blue-600',
      auth: 'bg-rose_taupe-500 border-rose_taupe-600',
      payment: 'bg-timberwolf-500 border-timberwolf-600',
      storage: 'bg-light_blue-300 border-light_blue-400',
      notification: 'bg-rose_taupe-300 border-rose_taupe-400',
      cache: 'bg-timberwolf-300 border-timberwolf-400',
      cdn: 'bg-light_blue-200 border-light_blue-300',
    };
    return colors[type as keyof typeof colors] || 'bg-onyx-400 border-onyx-500';
  };

  const renderConnections = () => {
    return workflowNodes.flatMap(node => 
      node.connections.map(targetId => {
        const target = workflowNodes.find(n => n.id === targetId);
        if (!target) return null;

        return (
          <line
            key={`${node.id}-${targetId}`}
            x1={node.x + 60}
            y1={node.y + 30}
            x2={target.x + 60}
            y2={target.y + 30}
            stroke="url(#glowGradient)"
            strokeWidth="3"
            opacity="0.8"
            className="animate-pulse"
          />
        );
      })
    ).filter(Boolean);
  };

  const handleContinue = () => {
    onComplete({ nodes: workflowNodes });
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-mint_cream-500 flex items-center justify-center p-6">
        <div className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-12 text-center shadow-lg">
          <Brain className="h-16 w-16 text-light_blue-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-semibold text-onyx-200 mb-4">
            AI Thinking & Creating Workflow
          </h2>
          <p className="text-xl text-rose_taupe-400 mb-8">
            Analyzing your requirements and generating the perfect architecture...
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-light_blue-500" />
            <span className="text-light_blue-600 font-medium">Processing...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint_cream-500 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-12 mb-8 shadow-lg animate-fade-in">
          <h2 className="text-4xl font-semibold text-onyx-200 mb-4">
            Your AI-Generated SaaS Architecture
          </h2>
          <p className="text-xl text-rose_taupe-400 leading-relaxed">
            Here's the custom workflow generated for your project. Click on any component to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow Diagram */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-lg border border-light_blue-300/30 rounded-3xl p-8 h-96 shadow-lg overflow-hidden relative">
              {/* Glassy background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-light_blue-50/20 to-timberwolf-50/20 rounded-3xl"></div>
              
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 400"
                className="overflow-visible relative z-10"
              >
                {/* Gradient definitions for glowing effects */}
                <defs>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#93b7be" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#a8c5cb" stopOpacity="1" />
                    <stop offset="100%" stopColor="#93b7be" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Render connections with glow effect */}
                {renderConnections()}
                
                {/* Render nodes */}
                {workflowNodes.map(node => (
                  <g key={node.id}>
                    <foreignObject
                      x={node.x}
                      y={node.y}
                      width="120"
                      height="60"
                      className="cursor-pointer"
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <div className={`h-full flex items-center justify-center text-center p-3 backdrop-blur-md bg-white/80 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                        selectedNode === node.id 
                          ? 'ring-4 ring-light_blue-400/50 shadow-2xl bg-white/90 scale-105' 
                          : 'border-light_blue-200/50 hover:border-light_blue-400/70'
                      }`}
                      style={{
                        filter: selectedNode === node.id ? 'drop-shadow(0 0 20px rgba(147, 183, 190, 0.5))' : 'none'
                      }}
                      >
                        <div className={`w-4 h-4 rounded-full ${getNodeColor(node.type)} mr-2 flex-shrink-0 shadow-lg`}></div>
                        <span className="text-sm font-medium text-onyx-300">{node.label}</span>
                      </div>
                    </foreignObject>
                  </g>
                ))}
              </svg>
            </Card>
          </div>

          {/* Node Details */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-onyx-200 mb-6">Component Details</h3>
              {selectedNode ? (
                <div className="space-y-4">
                  {(() => {
                    const node = workflowNodes.find(n => n.id === selectedNode);
                    return node ? (
                      <>
                        <div className={`w-8 h-8 rounded-full ${getNodeColor(node.type)} mx-auto shadow-lg`}></div>
                        <h4 className="font-semibold text-center text-onyx-300 text-lg">
                          {node.label}
                        </h4>
                        <p className="text-sm text-rose_taupe-400 text-center leading-relaxed">
                          {node.description || 'AI-generated component for your SaaS architecture.'}
                        </p>
                        <div className="mt-4 p-3 bg-light_blue-50/30 rounded-xl">
                          <p className="text-xs text-light_blue-600 font-medium">Type: {node.type}</p>
                          <p className="text-xs text-light_blue-600">Connections: {node.connections.length}</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              ) : (
                <p className="text-rose_taupe-400 text-center">
                  Select a component to view its details
                </p>
              )}
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-onyx-200 mb-6">Architecture Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-rose_taupe-400">Components</span>
                  <span className="font-semibold text-onyx-300">{workflowNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose_taupe-400">Connections</span>
                  <span className="font-semibold text-onyx-300">
                    {workflowNodes.reduce((acc, node) => acc + node.connections.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose_taupe-400">Complexity</span>
                  <span className="font-semibold text-light_blue-500">
                    {workflowNodes.length > 8 ? 'High' : workflowNodes.length > 5 ? 'Medium' : 'Simple'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/60 border-light_blue-200 hover:bg-white/80 px-8 py-4 rounded-2xl transition-all"
          >
            Back to Requirements
          </Button>
          
          <Button
            onClick={handleContinue}
            className="bg-light_blue-500 hover:bg-light_blue-400 text-white px-8 py-4 rounded-2xl transition-all"
          >
            Explore Tech Stack
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualization;
