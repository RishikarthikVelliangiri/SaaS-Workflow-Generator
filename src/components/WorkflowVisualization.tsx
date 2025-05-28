
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface WorkflowNode {
  id: string;
  label: string;
  type: 'frontend' | 'backend' | 'database' | 'api' | 'auth' | 'payment';
  x: number;
  y: number;
  connections: string[];
}

const workflowNodes: WorkflowNode[] = [
  { id: 'frontend', label: 'React Frontend', type: 'frontend', x: 100, y: 200, connections: ['auth', 'api'] },
  { id: 'auth', label: 'Authentication', type: 'auth', x: 300, y: 100, connections: ['backend'] },
  { id: 'api', label: 'REST API', type: 'api', x: 300, y: 200, connections: ['backend'] },
  { id: 'backend', label: 'Node.js Backend', type: 'backend', x: 500, y: 150, connections: ['database', 'payment'] },
  { id: 'database', label: 'PostgreSQL', type: 'database', x: 700, y: 100, connections: [] },
  { id: 'payment', label: 'Stripe Integration', type: 'payment', x: 700, y: 200, connections: [] }
];

const getNodeColor = (type: string) => {
  switch (type) {
    case 'frontend': return 'from-blue-500 to-cyan-500';
    case 'backend': return 'from-purple-500 to-pink-500';
    case 'database': return 'from-green-500 to-teal-500';
    case 'api': return 'from-orange-500 to-red-500';
    case 'auth': return 'from-indigo-500 to-purple-500';
    case 'payment': return 'from-yellow-500 to-orange-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

interface WorkflowVisualizationProps {
  onContinue: () => void;
  onBack: () => void;
}

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ onContinue, onBack }) => {
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);

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
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            className="animate-pulse"
          />
        );
      })
    ).filter(Boolean);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-8 mb-6 animate-fade-in">
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Your SaaS Architecture
          </h2>
          <p className="text-xl text-muted-foreground">
            Here's the generated workflow for your project. Click on any component to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Diagram */}
          <div className="lg:col-span-2">
            <Card className="glass-panel p-6 h-96">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 300"
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
                
                {/* Render connections */}
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
                      <div className={`workflow-node h-full flex items-center justify-center text-center p-2 ${
                        selectedNode === node.id ? 'neon-border' : ''
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getNodeColor(node.type)} mr-2`}></div>
                        <span className="text-sm font-medium">{node.label}</span>
                      </div>
                    </foreignObject>
                  </g>
                ))}
              </svg>
            </Card>
          </div>

          {/* Node Details */}
          <div className="space-y-4">
            <Card className="glass-panel p-6">
              <h3 className="text-xl font-semibold gradient-text mb-4">Component Details</h3>
              {selectedNode ? (
                <div className="space-y-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getNodeColor(workflowNodes.find(n => n.id === selectedNode)?.type || '')} mx-auto`}></div>
                  <h4 className="font-semibold text-center">
                    {workflowNodes.find(n => n.id === selectedNode)?.label}
                  </h4>
                  <p className="text-sm text-muted-foreground text-center">
                    Click on components in the diagram to explore their details and configurations.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center">
                  Select a component to view its details
                </p>
              )}
            </Card>

            <Card className="glass-panel p-6">
              <h3 className="text-xl font-semibold gradient-text mb-4">Architecture Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Components</span>
                  <span className="font-semibold">{workflowNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integrations</span>
                  <span className="font-semibold">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity</span>
                  <span className="font-semibold text-neon-blue">Medium</span>
                </div>
              </div>
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
            Back to Requirements
          </Button>
          
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-cyan px-8 py-6 neon-glow"
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
