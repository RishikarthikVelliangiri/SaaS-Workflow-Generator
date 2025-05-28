
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
    case 'frontend': return 'bg-light_blue-400';
    case 'backend': return 'bg-rose_taupe-400';
    case 'database': return 'bg-timberwolf-400';
    case 'api': return 'bg-light_blue-500';
    case 'auth': return 'bg-rose_taupe-500';
    case 'payment': return 'bg-timberwolf-500';
    default: return 'bg-onyx-400';
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
            stroke="#93b7be"
            strokeWidth="2"
            opacity="0.6"
          />
        );
      })
    ).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-mint_cream-500 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-12 mb-8 shadow-lg animate-fade-in">
          <h2 className="text-4xl font-semibold text-onyx-200 mb-4">
            Your SaaS Architecture
          </h2>
          <p className="text-xl text-rose_taupe-400 leading-relaxed">
            Here's the generated workflow for your project. Click on any component to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow Diagram */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border border-light_blue-300/30 rounded-3xl p-8 h-96 shadow-lg">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 300"
                className="overflow-visible"
              >
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
                      <div className={`h-full flex items-center justify-center text-center p-3 bg-white/80 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                        selectedNode === node.id ? 'ring-2 ring-light_blue-400 shadow-lg' : 'border-light_blue-200'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${getNodeColor(node.type)} mr-2 flex-shrink-0`}></div>
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
                  <div className={`w-8 h-8 rounded-full ${getNodeColor(workflowNodes.find(n => n.id === selectedNode)?.type || '')} mx-auto`}></div>
                  <h4 className="font-semibold text-center text-onyx-300">
                    {workflowNodes.find(n => n.id === selectedNode)?.label}
                  </h4>
                  <p className="text-sm text-rose_taupe-400 text-center leading-relaxed">
                    Click on components in the diagram to explore their details and configurations.
                  </p>
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
                  <span className="text-rose_taupe-400">Integrations</span>
                  <span className="font-semibold text-onyx-300">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose_taupe-400">Complexity</span>
                  <span className="font-semibold text-light_blue-500">Medium</span>
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
            onClick={onContinue}
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
