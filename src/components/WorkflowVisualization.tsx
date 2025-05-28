
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Brain, Loader2, Zap, Database, Shield, Cloud, CreditCard, Eye, BarChart3 } from 'lucide-react';
import { generateWorkflowNodes } from '@/utils/deepseekApi';

interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: string[];
  description?: string;
  priority?: 'high' | 'medium' | 'low';
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
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  const [workflowGenerated, setWorkflowGenerated] = React.useState(false);

  React.useEffect(() => {
    generateWorkflow();
  }, []);

  const generateWorkflow = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating workflow with DeepSeek...');
      const nodes = await generateWorkflowNodes(projectData.idea, projectData.requirements);
      console.log('Generated nodes:', nodes);
      setWorkflowNodes(nodes);
      setWorkflowGenerated(true);
    } catch (error) {
      console.error('Error generating workflow:', error);
      // Show error message to user but still show fallback
      setWorkflowGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const getNodeIcon = (type: string) => {
    const icons = {
      frontend: '🎨',
      backend: '⚙️',
      database: '🗄️',
      api: '🔌',
      auth: '🔐',
      payment: '💳',
      storage: '☁️',
      notification: '🔔',
      cache: '⚡',
      cdn: '🌐',
      analytics: '📊',
      monitoring: '👁️'
    };
    return icons[type as keyof typeof icons] || '🔧';
  };

  const getNodeGradient = (type: string, priority: string = 'medium') => {
    const baseGradients = {
      frontend: 'from-blue-400 to-blue-600',
      backend: 'from-green-400 to-green-600',
      database: 'from-purple-400 to-purple-600',
      api: 'from-orange-400 to-orange-600',
      auth: 'from-red-400 to-red-600',
      payment: 'from-yellow-400 to-yellow-600',
      storage: 'from-cyan-400 to-cyan-600',
      notification: 'from-pink-400 to-pink-600',
      cache: 'from-indigo-400 to-indigo-600',
      cdn: 'from-teal-400 to-teal-600',
      analytics: 'from-lime-400 to-lime-600',
      monitoring: 'from-gray-400 to-gray-600'
    };
    
    const gradient = baseGradients[type as keyof typeof baseGradients] || 'from-gray-400 to-gray-600';
    
    if (priority === 'high') {
      return `${gradient} shadow-lg shadow-blue-500/25`;
    } else if (priority === 'low') {
      return `${gradient} opacity-75`;
    }
    return gradient;
  };

  const renderConnections = () => {
    return workflowNodes.flatMap(node => 
      node.connections.map(targetId => {
        const target = workflowNodes.find(n => n.id === targetId);
        if (!target) return null;

        const isHighlighted = hoveredNode === node.id || hoveredNode === targetId;
        
        return (
          <g key={`${node.id}-${targetId}`}>
            {/* Glow effect */}
            <line
              x1={node.x + 75}
              y1={node.y + 40}
              x2={target.x + 75}
              y2={target.y + 40}
              stroke="url(#connectionGlow)"
              strokeWidth="8"
              opacity={isHighlighted ? "0.6" : "0.2"}
              className="transition-all duration-300"
            />
            {/* Main connection */}
            <line
              x1={node.x + 75}
              y1={node.y + 40}
              x2={target.x + 75}
              y2={target.y + 40}
              stroke="url(#connectionGradient)"
              strokeWidth="3"
              opacity={isHighlighted ? "1" : "0.7"}
              className="transition-all duration-300"
              strokeDasharray={isHighlighted ? "0" : "5,5"}
            />
            {/* Animated particles */}
            {isHighlighted && (
              <circle r="3" fill="white" opacity="0.8">
                <animateMotion dur="2s" repeatCount="indefinite">
                  <mpath href={`#path-${node.id}-${targetId}`}/>
                </animateMotion>
              </circle>
            )}
            {/* Hidden path for animation */}
            <path
              id={`path-${node.id}-${targetId}`}
              d={`M ${node.x + 75} ${node.y + 40} L ${target.x + 75} ${target.y + 40}`}
              stroke="transparent"
              fill="none"
            />
          </g>
        );
      })
    ).filter(Boolean);
  };

  const handleContinue = () => {
    onComplete({ nodes: workflowNodes });
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <div className="relative">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl animate-pulse"></div>
          
          <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-16 text-center shadow-2xl">
            {/* Floating orbs */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-purple-500 rounded-full opacity-60 animate-bounce delay-300"></div>
            <div className="absolute -bottom-4 -left-2 w-4 h-4 bg-cyan-500 rounded-full opacity-60 animate-bounce delay-700"></div>
            
            <Brain className="h-20 w-20 text-blue-400 mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-6">
              AI Thinking & Creating Workflow
            </h2>
            <p className="text-xl text-blue-200 mb-12 max-w-md">
              Analyzing your requirements and generating the perfect architecture...
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="text-blue-300 font-medium text-lg">Processing with DeepSeek AI...</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your AI-Generated SaaS Architecture
            </h2>
            <p className="text-xl text-blue-200 leading-relaxed">
              Explore your custom workflow. Click on any component to learn more about its role.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Futuristic Workflow Diagram */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
              <Card className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 h-[500px] shadow-2xl overflow-hidden">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 400"
                  className="overflow-visible"
                >
                  {/* Enhanced gradient definitions */}
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="connectionGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                    <filter id="nodeGlow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Render connections */}
                  {renderConnections()}
                  
                  {/* Render nodes */}
                  {workflowNodes.map(node => (
                    <g key={node.id}>
                      <foreignObject
                        x={node.x}
                        y={node.y}
                        width="150"
                        height="80"
                        className="cursor-pointer"
                        onClick={() => setSelectedNode(node.id)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className={`h-full relative group transition-all duration-300 transform ${
                          hoveredNode === node.id ? 'scale-110' : 'scale-100'
                        } ${
                          selectedNode === node.id ? 'scale-105' : ''
                        }`}>
                          {/* Glow effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${getNodeGradient(node.type, node.priority)} rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                          
                          {/* Main node */}
                          <div className={`relative h-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                            selectedNode === node.id 
                              ? 'border-blue-400 shadow-2xl shadow-blue-500/50' 
                              : 'hover:border-white/40'
                          }`}>
                            {/* Priority indicator */}
                            {node.priority === 'high' && (
                              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                            
                            {/* Icon */}
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                              {getNodeIcon(node.type)}
                            </div>
                            
                            {/* Label */}
                            <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                              {node.label}
                            </span>
                            
                            {/* Type badge */}
                            <span className="text-xs text-gray-300 mt-1 opacity-75">
                              {node.type}
                            </span>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                </svg>
              </Card>
            </div>
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-6">
            {/* Node Details */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
              <Card className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-blue-400" />
                  Component Details
                </h3>
                {selectedNode ? (
                  <div className="space-y-4">
                    {(() => {
                      const node = workflowNodes.find(n => n.id === selectedNode);
                      return node ? (
                        <>
                          <div className="text-center">
                            <div className="text-4xl mb-3">{getNodeIcon(node.type)}</div>
                            <h4 className="font-bold text-white text-lg mb-2">
                              {node.label}
                            </h4>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              node.priority === 'high' ? 'bg-red-500/20 text-red-200 border border-red-500/30' :
                              node.priority === 'low' ? 'bg-gray-500/20 text-gray-200 border border-gray-500/30' :
                              'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                            }`}>
                              {node.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-300 leading-relaxed text-center">
                            {node.description || 'AI-generated component for your SaaS architecture.'}
                          </p>
                          
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-blue-200 text-sm">Type:</span>
                              <span className="text-white text-sm font-medium">{node.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-200 text-sm">Connections:</span>
                              <span className="text-white text-sm font-medium">{node.connections.length}</span>
                            </div>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-4">🎯</div>
                    <p>Select a component to view its details</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Architecture Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl blur-xl"></div>
              <Card className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
                  Architecture Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Components</span>
                    <span className="text-2xl font-bold text-white">{workflowNodes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Connections</span>
                    <span className="text-2xl font-bold text-white">
                      {workflowNodes.reduce((acc, node) => acc + node.connections.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Complexity</span>
                    <span className={`text-lg font-bold ${
                      workflowNodes.length > 10 ? 'text-red-400' : 
                      workflowNodes.length > 6 ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {workflowNodes.length > 10 ? 'Enterprise' : 
                       workflowNodes.length > 6 ? 'Advanced' : 
                       'Simple'}
                    </span>
                  </div>
                  
                  {/* Priority breakdown */}
                  <div className="pt-4 border-t border-purple-500/30">
                    <div className="text-sm text-gray-300 mb-2">Priority Distribution</div>
                    <div className="space-y-2">
                      {['high', 'medium', 'low'].map(priority => {
                        const count = workflowNodes.filter(n => n.priority === priority).length;
                        return count > 0 ? (
                          <div key={priority} className="flex justify-between text-sm">
                            <span className="capitalize text-gray-400">{priority}</span>
                            <span className="text-white">{count}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-black/40 border-gray-500/30 hover:bg-black/60 text-white px-8 py-4 rounded-2xl transition-all backdrop-blur-xl"
          >
            Back to Requirements
          </Button>
          
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25"
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
