import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Loader2, Eye, BarChart3, GripVertical, ChevronRight, CornerRightDown, Settings, Code, Database, Cloud } from 'lucide-react';
import { generateWorkflowNodes, generateWorkflowExplanation, generateNodeDescription, generateTechStackWithReasons } from '@/utils/deepseekApi';

interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: string[];
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'active' | 'pending' | 'offline';
  aiSuggestion?: string;
  group?: string; // e.g., 'microservice', 'core', 'infra'
  microservice?: boolean;
}

interface WorkflowVisualizationProps {
  projectData: {
    idea: string;
    requirements: Record<string, any>;
  };
  onComplete: (workflowData: any, techStackData: any) => void;
  onBack: () => void;
}

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ 
  projectData, 
  onComplete, 
  onBack 
}): JSX.Element => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [workflowNodes, setWorkflowNodes] = React.useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  const [workflowGenerated, setWorkflowGenerated] = React.useState(false);
  const [workflowExplanation, setWorkflowExplanation] = React.useState<string>('');
  const [nodeDescription, setNodeDescription] = React.useState<string>('');
  const [nodeDescriptions, setNodeDescriptions] = React.useState<Record<string, string>>({});
  const [isLoadingDescription, setIsLoadingDescription] = React.useState<boolean>(false);
  const [diagramSize, setDiagramSize] = React.useState({ width: 800, height: 500 });
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeCount, setResizeCount] = React.useState(0); // Debug counter
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedNode, setDraggedNode] = React.useState<string | null>(null);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  
  // Tech stack related state
  const [techStack, setTechStack] = React.useState<any[]>([]);
  const [isTechStackLoading, setIsTechStackLoading] = React.useState(false);
  const [techStackError, setTechStackError] = React.useState<string | null>(null);
  const diagramRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Tech stack category icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Eye className="w-4 h-4" />;
      case 'backend':
        return <Settings className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'deployment':
        return <Cloud className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };
  React.useEffect(() => {
    generateBothWorkflowAndTechStack();
  }, []);

  const generateBothWorkflowAndTechStack = async () => {
    setIsGenerating(true);
    setIsTechStackLoading(true);
    
    try {
      console.log('Generating workflow and tech stack simultaneously...');
      
      // Generate both workflow and tech stack in parallel
      const [nodes, techStackData] = await Promise.all([
        generateWorkflowNodes(projectData.idea, projectData.requirements),
        generateTechStackWithReasons(projectData.idea, projectData.requirements)
      ]);
      
      console.log('Generated nodes:', nodes);
      console.log('Generated tech stack:', techStackData);
      
      setWorkflowNodes(nodes);
      setTechStack(techStackData);
      setWorkflowGenerated(true);
      
    } catch (error) {
      console.error('Error generating workflow and/or tech stack:', error);
      if (error.message?.includes('tech stack')) {
        setTechStackError('Failed to generate tech stack recommendations');
      }
      // Show fallback for workflow
      setWorkflowGenerated(true);
    } finally {
      setIsGenerating(false);
      setIsTechStackLoading(false);
    }
  };
  const fetchWorkflowExplanation = async (idea: string, requirements: Record<string, any>, nodes: WorkflowNode[]) => {
    try {
      const explanation = await generateWorkflowExplanation(idea, requirements, nodes);
      setWorkflowExplanation(explanation);
    } catch (err) {
      console.error('Failed to generate explanation:', err);
      setWorkflowExplanation('This workflow is tailored to your project\'s requirements, connecting each component for optimal scalability, security, and user experience.');
    }
  };
  
  // Function to fetch AI-generated description when a node is selected
  const fetchNodeDescription = React.useCallback(async (nodeId: string) => {
    const node = workflowNodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setIsLoadingDescription(true);
    try {
      console.log(`Fetching description for ${node.label} (${nodeId})...`);
      
      // Check if we already have this description in our cache first
      if (nodeDescriptions[nodeId] && nodeDescriptions[nodeId].length > 5) {
        console.log(`Using cached description for ${node.label}`);
        setNodeDescription(nodeDescriptions[nodeId]);
        setIsLoadingDescription(false);
        return;
      }
      
      // Otherwise fetch it from the API
      console.log(`Calling API for ${node.label} description...`);
      const description = await generateNodeDescription(node.type, node.label);
      console.log(`API returned description for ${node.label}:`, description?.substring(0, 40) + '...');
      
      if (!description || description.trim().length < 5) {
        throw new Error('Empty or invalid description received from API');
      }
      
      // Save to our cache for future use
      const formattedDescription = description.trim();
      
      // Update state with the new description
      setNodeDescription(formattedDescription);
      
      // Also save to our cache for future use
      setNodeDescriptions(prev => ({
        ...prev,
        [nodeId]: formattedDescription
      }));
    } catch (error) {
      console.error('Error fetching node description:', error);
      // Create a nicely formatted fallback description with proper markdown
      const fallbackDescription = `**${node.type.toUpperCase()} Component**\n\n*${node.label}* provides essential functionality for your architecture. It integrates with other services to ensure seamless operation.\n\n- Handles data processing for the ${node.type} layer\n- Communicates with ${node.connections.length} connected components\n- Ensures secure and reliable service delivery`;
      
      console.log("Using fallback description:", fallbackDescription);
      setNodeDescription(fallbackDescription);
      
      // Also save this fallback to the cache
      setNodeDescriptions(prev => ({
        ...prev,
        [nodeId]: fallbackDescription
      }));
    } finally {
      setIsLoadingDescription(false);
    }
  }, [workflowNodes, nodeDescriptions]);  // Pre-generate descriptions is now handled by the sequential implementation below
  // This parallel implementation has been removed to avoid rate limiting
  React.useEffect(() => {
    // This code has been replaced by the sequential implementation below
  }, []);
  
  // Effect to fetch description when selected node changes (now uses pre-generated descriptions when available)
  React.useEffect(() => {
    if (selectedNode) {
      // If we have a pre-generated description, use it
      if (nodeDescriptions[selectedNode]) {
        setNodeDescription(nodeDescriptions[selectedNode]);
      } else {
        // Otherwise fetch it on-demand
        fetchNodeDescription(selectedNode);
      }
    } else {
      setNodeDescription('');
    }
  }, [selectedNode, fetchNodeDescription, nodeDescriptions]);  // Format explanation text with proper HTML
  const formatExplanation = (text: string) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-red-300 font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-red-200 italic">$1</em>')
      .split(/\.\s+/)
      .filter(sentence => sentence.trim())
      .map((sentence, index) => {
        const trimmed = sentence.trim();
        if (!trimmed) return '';
        
        // Add period if missing
        const formatted = trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
        return `<p key="${index}" class="mb-3 text-sm leading-relaxed">${formatted}</p>`;
      })
      .join('');
  };
  // Enhanced markdown formatting for node descriptions with debugging
  const formatMarkdownDescription = (text: string) => {
    if (!text) return 'No description available';
    
    console.log("Raw text to format:", text);
    
    try {
      // Clean up the text first (remove any unwanted formatting and standardize newlines)
      let cleanedText = text
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\r/g, '')
        .trim();
      
      // First, escape any HTML that might be in the text
      const escapedText = cleanedText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Then apply our markdown formatting
      let formattedText = escapedText;
      
      // Format bold text - handle ** markdown
      formattedText = formattedText.replace(
        /\*\*([^*]+)\*\*/g, 
        '<strong class="text-white font-semibold">$1</strong>'
      );
      
      // Format italic text - handle single * with non-greedy matching
      formattedText = formattedText.replace(
        /\*([^*\n]+?)\*/g, 
        '<em class="text-red-200 italic">$1</em>'
      );
      
      // Format code blocks
      formattedText = formattedText.replace(
        /`([^`]+)`/g, 
        '<code class="bg-gray-800/60 text-red-300 px-1.5 py-0.5 rounded text-xs">$1</code>'
      );
      
      // Handle bullet points with more robust matching
      formattedText = formattedText.replace(
        /^[\s]*-[\s]+(.+)$/gm, 
        '<div class="flex items-start mb-2"><span class="mr-2 text-red-400">•</span><span class="text-gray-300">$1</span></div>'
      );
      
      // Convert double line breaks to paragraphs
      const paragraphs = formattedText.split(/\n\n+/);
      formattedText = paragraphs
        .map(para => {
          const trimmedPara = para.trim();
          if (!trimmedPara) return '';
          
          // If paragraph already has HTML formatting, leave it alone
          if (/<(div|strong|em|code|p|span)/.test(trimmedPara)) {
            return trimmedPara;
          }
          
          // Otherwise wrap in paragraph tags
          return `<p class="mb-2 text-gray-300">${trimmedPara}</p>`;
        })
        .join('\n');
      
      // Replace remaining single newlines with line breaks
      formattedText = formattedText.replace(/\n(?!<\/?(div|p))/g, '<br />');
      
      console.log("Formatted output:", formattedText);
      return formattedText;
    }
    catch (error) {
      console.error("Error formatting markdown:", error);
      // If formatting fails, return the original text with minimal formatting
      return `<p class="text-gray-300">${text.replace(/\n/g, '<br />')}</p>`;
    }
  };
  
  // Format node description with proper markdown rendering
  const formatNodeDescription = (text: string) => {
    if (!text) return '';
    
    return text
      // Handle bold text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      // Handle italic text
      .replace(/\*([^*]+)\*/g, '<em class="text-gray-200 italic">$1</em>')
      // Handle code blocks (backticks)
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1 rounded text-xs text-red-300">$1</code>')
      // Handle links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-300 hover:text-red-200 underline" target="_blank">$1</a>')
      // Handle lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>')
      // Add paragraph styling
      .split(/\n\n+/)
      .map((paragraph, index) => {
        if (!paragraph.trim()) return '';
        if (paragraph.startsWith('<li>')) {
          return `<ul class="my-2 list-disc">${paragraph}</ul>`;
        }
        return `<p class="mb-2 text-gray-300">${paragraph}</p>`;
      })
      .join('');
  };

  const getNodeIcon = (type: string) => {
    const icons = {
      frontend: '🖥️',
      backend: '🧠',
      database: '💾',
      api: '🔗',
      auth: '🔒',
      payment: '💳',
      storage: '🗄️',
      notification: '🔔',
      cache: '⚡',
      cdn: '🌐',
      analytics: '📈',
      monitoring: '👁️',
      ai: '🤖',
      queue: '📬',
      search: '🔍',
      logging: '📝',
      infra: '🛠️',
    };
    return icons[type as keyof typeof icons] || '🔧';
  };
  const getNodeGradient = (type: string, priority: string = 'medium') => {
    const baseGradients = {
      frontend: 'from-blue-500/40 to-blue-700/60',
      backend: 'from-green-500/40 to-green-700/60',
      database: 'from-yellow-500/40 to-yellow-700/60',
      api: 'from-purple-500/40 to-purple-700/60',
      auth: 'from-red-500/40 to-red-700/60',
      payment: 'from-pink-500/40 to-pink-700/60',
      storage: 'from-indigo-500/40 to-indigo-700/60',
      notification: 'from-orange-500/40 to-orange-700/60',
      cache: 'from-cyan-500/40 to-cyan-700/60',
      cdn: 'from-teal-500/40 to-teal-700/60',
      analytics: 'from-violet-500/40 to-violet-700/60',
      monitoring: 'from-slate-500/40 to-slate-700/60',
      ai: 'from-emerald-500/40 to-emerald-700/60',
      queue: 'from-rose-500/40 to-rose-700/60',
      search: 'from-amber-500/40 to-amber-700/60',
      logging: 'from-stone-500/40 to-stone-700/60',
      infra: 'from-zinc-500/40 to-zinc-700/60',
    };
    return baseGradients[type as keyof typeof baseGradients] || 'from-gray-500/40 to-gray-700/60';
  };
  const getComplexityColor = (nodeCount: number) => {
    if (nodeCount > 10) return 'text-red-400';
    if (nodeCount > 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getComplexityLabel = (nodeCount: number) => {
    if (nodeCount > 10) return 'Enterprise';
    if (nodeCount > 6) return 'Advanced';
    return 'Simple';
  };  const getNodeBorderClass = (nodeId: string) => {
    if (selectedNode === nodeId) return 'border-red-400 shadow-red-500/50';
    if (hoveredNode === nodeId) return 'border-gray-400/60';
    return 'border-gray-600/40';
  };  const getStatusIndicatorClass = (status: string | undefined) => {
    if (status === 'active') return 'bg-green-400';
    if (status === 'pending') return 'bg-yellow-400';
    return 'bg-gray-400';
  };

  const getPriorityIndicatorClass = (priority: string | undefined) => {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'low') return 'bg-gray-500';
    return 'bg-yellow-500';
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDraggedNode(nodeId);
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const node = workflowNodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate offset from mouse to node position
    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y
    });
  };
  
  // Handle mouse move for dragging with enhanced bounds checking
  const updateNodePosition = React.useCallback((nodeId: string, newX: number, newY: number) => {
    setWorkflowNodes(prev => 
      prev.map(node => {
        if (node.id === nodeId) {
          const constrainedNode = ensureNodeWithinBounds(
            { ...node, x: newX, y: newY }, 
            diagramSize.width, 
            diagramSize.height
          );
          return constrainedNode;
        }
        return node;
      })
    );
  }, [diagramSize.width, diagramSize.height]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !draggedNode) return;
      
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate new position (before bounds checking)
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;
      
      updateNodePosition(draggedNode, newX, newY);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setDraggedNode(null);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggedNode, dragOffset, diagramSize, updateNodePosition]);
  // Helper function to render a single connection with glassy futuristic lines but without costly animations
  const renderConnection = (sourceNode: WorkflowNode, targetId: string) => {
    const target = workflowNodes.find(n => n.id === targetId);
    if (!target) return null;
    
    const isHighlighted = hoveredNode === sourceNode.id || hoveredNode === targetId;
    const connectionId = `${sourceNode.id}-${targetId}`;
    
    // Calculate control points for curved lines
    const sourceX = sourceNode.x + 85;
    const sourceY = sourceNode.y + 50;
    const targetX = target.x + 85;
    const targetY = target.y + 50;
    
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    const offsetY = Math.abs(targetX - sourceX) * 0.3;
    
    const pathData = `M ${sourceX} ${sourceY} Q ${midX} ${midY - offsetY} ${targetX} ${targetY}`;
    
    return (
      <g key={connectionId}>
        <defs>
          <linearGradient id={`gradient-${connectionId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6b7280" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6b7280" stopOpacity="0.6" />
          </linearGradient>
          {/* Enhanced glassmorphic glow filter */}
          <filter id={`glow-${connectionId}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
          
        {/* Outer glow path for glassy effect */}
        <path
          d={pathData}
          stroke={`url(#gradient-${connectionId})`}
          strokeWidth="5"
          fill="none"
          opacity="0.2"
          filter={`url(#glow-${connectionId})`}
          className="transition-all duration-500"
        />
        
        {/* Main dotted connection path */}
        <path
          d={pathData}
          stroke={`url(#gradient-${connectionId})`}
          strokeWidth="1.5"
          fill="none"
          opacity={isHighlighted ? "0.95" : "0.8"}
          strokeDasharray="6,4"
          className="transition-all duration-300"
        />

        {/* Connection endpoint indicators */}
        <circle
          cx={sourceX}
          cy={sourceY}
          r={isHighlighted ? "4" : "2"}
          fill={isHighlighted ? "#ef4444" : "#6b7280"}
          opacity="0.9"
          className="transition-all duration-300"
          filter={isHighlighted ? `url(#glow-${connectionId})` : ""}
        />
        <circle
          cx={targetX}
          cy={targetY}
          r={isHighlighted ? "4" : "2"}
          fill={isHighlighted ? "#dc2626" : "#6b7280"}
          opacity="0.9"
          className="transition-all duration-300"
          filter={isHighlighted ? `url(#glow-${connectionId})` : ""}
        />
      </g>
    );
  };

  // Render connections between nodes
  const renderConnections = () => {
    if (!Array.isArray(workflowNodes)) return null;
    
    const connections: JSX.Element[] = [];
    workflowNodes.forEach(node => {
      const nodeConnections = Array.isArray(node.connections) ? node.connections : [];
      nodeConnections.forEach(targetId => {
        const connection = renderConnection(node, targetId);
        if (connection) connections.push(connection);
      });
    });
      return connections;
  };
  
  // Enhanced bounds checking function with improved calculations
  const ensureNodeWithinBounds = (node: WorkflowNode, width: number, height: number): WorkflowNode => {
    const nodeWidth = 170;
    const nodeHeight = 100;
    const padding = 20;
    const headerHeight = 70;
    const panelPadding = 48;
    const extraBuffer = 10; // Additional buffer for safety
    
    // Calculate available space more precisely
    const availableWidth = width - panelPadding;
    const availableHeight = height - headerHeight;
    
    const maxX = Math.max(0, availableWidth - nodeWidth - padding - extraBuffer);
    const maxY = Math.max(0, availableHeight - nodeHeight - padding - extraBuffer);
    const minX = padding;
    const minY = padding;
    
    const constrainedX = Math.max(minX, Math.min(maxX, node.x));
    const constrainedY = Math.max(minY, Math.min(maxY, node.y));
    
    return {
      ...node,
      x: constrainedX,
      y: constrainedY
    };
  };

  // Effect to reposition nodes when diagram is resized
  React.useEffect(() => {
    if (workflowNodes.length > 0) {
      const repositionedNodes = workflowNodes.map(node => 
        ensureNodeWithinBounds(node, diagramSize.width, diagramSize.height)
      );
      
      // Only update if positions actually changed
      const hasPositionChanges = repositionedNodes.some((node, index) => 
        node.x !== workflowNodes[index].x || node.y !== workflowNodes[index].y
      );
      
      if (hasPositionChanges) {
        setWorkflowNodes(repositionedNodes);
      }
    }
  }, [diagramSize.width, diagramSize.height]);

  // Better organized layout system
  React.useEffect(() => {
    if (workflowNodes.length > 0 && workflowGenerated) {
      // Define logical workflow groups with better positioning
      const nodeTypes = {
        client: ['frontend', 'cdn'],
        security: ['auth'],
        api: ['api'],
        core: ['backend'],
        data: ['database', 'storage', 'cache'],
        services: ['payment', 'notification', 'analytics', 'monitoring'],
        infra: ['ai', 'queue', 'search', 'logging', 'infra']
      };
      
      // Group nodes by their types
      const nodesByGroup: Record<string, WorkflowNode[]> = {};
      
      workflowNodes.forEach(node => {
        let group = 'infra'; // default
        for (const [groupName, types] of Object.entries(nodeTypes)) {
          if (types.includes(node.type)) {
            group = groupName;
            break;
          }
        }
        
        if (!nodesByGroup[group]) {
          nodesByGroup[group] = [];
        }
        nodesByGroup[group].push(node);
      });
        
      // Calculate dynamic positions based on panel size
      const nodeWidth = 170;
      const nodeHeight = 100;
      const padding = 20;
      const headerHeight = 70;
      const panelPadding = 48;
      const spacing = 160;
      
      const availableWidth = diagramSize.width - panelPadding - (2 * padding);
      const availableHeight = diagramSize.height - headerHeight - (2 * padding);
      
      // Dynamic group positioning based on available space
      const getGroupPosition = (groupIndex: number, totalGroups: number) => {
        const cols = Math.max(2, Math.min(4, Math.floor(availableWidth / (nodeWidth + spacing))));
        const rows = Math.ceil(totalGroups / cols);
        
        const col = groupIndex % cols;
        const row = Math.floor(groupIndex / cols);
        
        const xSpacing = availableWidth / cols;
        const ySpacing = availableHeight / Math.max(rows, 1);
        
        return {
          x: padding + (col * xSpacing),
          y: padding + (row * ySpacing)
        };
      };
      
      const groupNames = Object.keys(nodesByGroup);
      
      // Position nodes with enhanced bounds checking
      const updatedNodes = workflowNodes.map(node => {
        let group = 'infra';
        for (const [groupName, types] of Object.entries(nodeTypes)) {
          if (types.includes(node.type)) {
            group = groupName;
            break;
          }
        }
        
        const groupIndex = groupNames.indexOf(group);
        const groupPosition = getGroupPosition(groupIndex, groupNames.length);
        const nodesInGroup = nodesByGroup[group] || [];
        const indexInGroup = nodesInGroup.indexOf(node);
        
        // Calculate initial position
        let x = groupPosition.x + (indexInGroup * spacing);
        let y = groupPosition.y;
        
        // If nodes would go beyond available width, wrap to next row
        const maxNodesPerRow = Math.floor(availableWidth / spacing);
        if (indexInGroup >= maxNodesPerRow) {
          x = groupPosition.x + ((indexInGroup % maxNodesPerRow) * spacing);
          y = groupPosition.y + (Math.floor(indexInGroup / maxNodesPerRow) * (nodeHeight + 40));
        }
        
        // Apply bounds checking
        const constrainedNode = ensureNodeWithinBounds(
          { ...node, x, y }, 
          diagramSize.width, 
          diagramSize.height
        );
        
        return {
          ...constrainedNode,
          status: ['active', 'pending'][Math.floor(Math.random() * 2)] as 'active' | 'pending',
          group,
          microservice: ['backend', 'api'].includes(node.type),
        };
      });
      
      setWorkflowNodes(updatedNodes);
    }
  }, [workflowGenerated, diagramSize.width, diagramSize.height]);  // Pre-generate descriptions when workflow is created  // Pre-generate node descriptions as soon as workflow nodes are available
  React.useEffect(() => {
    if (workflowNodes.length > 0 && workflowGenerated) {
      // Generate workflow explanation
      fetchWorkflowExplanation(projectData.idea, projectData.requirements, workflowNodes);
      
      // Pre-generate descriptions for all nodes with improved error handling and feedback
      const generateAllNodeDescriptions = async () => {
        console.log('Starting pre-generation of node descriptions...');
        const descriptions: Record<string, string> = { ...nodeDescriptions };
        let updatedCount = 0;
        let attemptedCount = 0;
        
        try {
          // Process nodes one at a time to avoid rate limiting
          for (const node of workflowNodes) {
            attemptedCount++;
            
            // Skip nodes that already have valid descriptions
            if (descriptions[node.id] && descriptions[node.id].length > 10) {
              console.log(`Description for ${node.label} already exists, skipping`);
              continue;
            }
            
            console.log(`Pre-generating description for ${node.label} (${attemptedCount}/${workflowNodes.length})...`);
            try {
              // Generate description from API with timeout safety
              const descriptionPromise = generateNodeDescription(node.type, node.label);
              
              // Set a timeout to prevent hanging
              const timeoutPromise = new Promise<string>((_, reject) => {
                setTimeout(() => reject(new Error('Description generation timed out')), 8000);
              });
              
              // Race between the actual API call and the timeout
              const description = await Promise.race([descriptionPromise, timeoutPromise]);
              
              // Validate the description format and content
              if (description && description.length > 10) {
                console.log(`Got description for ${node.label}:`, description.substring(0, 40) + '...');
                
                // Check for proper markdown formatting
                const hasMarkdown = description.includes('**') || description.includes('*') || description.includes('- ');
                const formattedDescription = hasMarkdown ? description : 
                  `**${node.label}**\n\n*${description}*\n\n- Core ${node.type} functionality\n- Seamless integration`;
                
                descriptions[node.id] = formattedDescription;
                updatedCount++;
                
                // Update descriptions state immediately after each successful generation
                // This provides real-time feedback in the UI
                setNodeDescriptions(prev => ({
                  ...prev,
                  [node.id]: formattedDescription
                }));
              } else {
                throw new Error('Empty or invalid description received');
              }
            } catch (error) {
              console.error(`Failed to pre-generate description for ${node.label}:`, error);
              // Create a meaningful fallback with proper markdown
              const fallbackDesc = `**${node.type.toUpperCase()} Component**\n\n*${node.label}* provides essential functionality for your architecture.\n\n- Handles ${node.type} operations\n- Connects with ${node.connections.length} other components\n- Ensures reliable service delivery`;
              
              descriptions[node.id] = fallbackDesc;
              
              // Update state with fallback
              setNodeDescriptions(prev => ({
                ...prev,
                [node.id]: fallbackDesc
              }));
              
              // Still count this as an update as we have a fallback
              updatedCount++;
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
          console.log(`✅ Finished pre-generating descriptions for ${updatedCount}/${workflowNodes.length} nodes`);
        } catch (error) {
          console.error('Error during node description pre-generation:', error);
        }
      };
      
      generateAllNodeDescriptions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowGenerated, workflowNodes, nodeDescriptions]);  const handleContinue = () => {
    onComplete({ nodes: workflowNodes }, techStack);
  };

  const handleRestart = () => {
    // Reset to landing page
    window.location.reload();
  };
    // Corner resize functionality  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = diagramSize.width;
    const startHeight = diagramSize.height;
    
    setIsResizing(true);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newWidth = Math.max(500, Math.min(1200, startWidth + deltaX));
      const newHeight = Math.max(350, Math.min(700, startHeight + deltaY));
      
      setDiagramSize({
        width: newWidth,
        height: newHeight
      });
      setResizeCount(prev => prev + 1); // Debug counter
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'nwse-resize';
  };

  // --- Progress bar overlay when AI is generating ---
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-red-900/80 flex items-center justify-center p-6 relative">
        <div className="absolute top-0 left-0 w-full h-2 z-20">
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-gray-700 h-2 rounded-full animate-[pulse_4s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/20 to-gray-700/20 rounded-3xl blur-2xl animate-[pulse_6s_ease-in-out_infinite]"></div>
          <div className="relative bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-16 text-center shadow-2xl">
            <Brain className="h-16 w-16 text-red-400 mx-auto mb-8 animate-[pulse_5s_ease-in-out_infinite]" />
            <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">AI Generating Workflow</h2>
            <p className="text-base text-red-200 mb-8 max-w-md mx-auto">Analyzing your requirements and generating a futuristic architecture...</p>
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-7 w-7 animate-spin text-red-400" />
              <span className="text-red-300 font-medium text-base">Processing...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-red-900/80 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/20 to-gray-700/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-10 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Your AI-Generated SaaS Architecture</h2>
            <p className="text-base text-red-200 leading-relaxed">Explore your custom workflow. Click on any component to learn more about its role.</p>
          </div>
        </div>        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Left side: Workflow Diagram and explanation */}
          <div className="flex-1">
            <div className="relative">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-red-700/10 to-gray-700/10 rounded-3xl blur-2xl"
                style={{ 
                  width: `${diagramSize.width}px`,
                  height: `${diagramSize.height}px`
                }}
              ></div>              <Card 
                className="relative bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-6 shadow-2xl"
                style={{ 
                  height: `${diagramSize.height}px`,
                  width: `${diagramSize.width}px`,
                  minHeight: '400px',
                  maxHeight: '800px',
                  minWidth: '500px',
                  maxWidth: '1200px',
                  flexShrink: 0,
                  overflow: 'visible'
                }}
                ref={diagramRef}
              >                <div className="mb-4 flex items-center justify-between">                <h3 className="text-xl font-semibold text-white">Architecture Workflow</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
                      {diagramSize.width} × {diagramSize.height}
                    </div>                    {workflowNodes.length > 0 && (
                      <div 
                        className={`text-xs ${
                          Object.keys(nodeDescriptions).length === workflowNodes.length
                            ? "text-green-300 bg-green-500/20 border-green-500/30"
                            : Object.keys(nodeDescriptions).length > 0
                              ? "text-yellow-300 bg-yellow-500/20 border-yellow-500/30" 
                              : "text-red-300 bg-red-500/20 border-red-500/30"
                        } px-2 py-1 rounded border flex items-center`}
                      >
                        <div 
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            Object.keys(nodeDescriptions).length === workflowNodes.length
                              ? "bg-green-400"
                              : Object.keys(nodeDescriptions).length > 0
                                ? "bg-yellow-400" 
                                : "bg-red-400"
                          }`}
                        ></div>
                        <span>
                          {Object.keys(nodeDescriptions).length}/{workflowNodes.length} descriptions ready
                        </span>
                      </div>
                    )}
                    {resizeCount > 0 && (
                      <div className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded border border-green-500/30">
                        Resized {resizeCount}x
                      </div>
                    )}
                    {isResizing && (
                      <div className="text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded border border-red-500/30 animate-pulse">
                        Resizing...
                      </div>
                    )}
                  </div>
                </div><svg
                  ref={svgRef}
                  width={diagramSize.width - 48}
                  height={diagramSize.height - 70}
                  viewBox={`0 0 ${diagramSize.width - 48} ${diagramSize.height - 70}`}
                  className="overflow-visible"
                  style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                >
                  {/* Render connections */}
                  {renderConnections()}
                  
                  {/* Render nodes */}
                  {workflowNodes.map(node => (
                    <g key={node.id}>
                      <foreignObject
                        x={node.x}
                        y={node.y}                        width="170"
                        height="100"
                        className={`cursor-${draggedNode === node.id ? 'grabbing' : 'grab'}`}                        onClick={() => {
                          setSelectedNode(node.id);
                          
                          // Always show loading indicator briefly (better UX)
                          setIsLoadingDescription(true);
                          
                          // Let React update the UI with the loading state
                          setTimeout(() => {
                            // Use cached description if available and valid with enhanced validation
                            const cachedDescription = nodeDescriptions[node.id];
                            
                            if (cachedDescription && cachedDescription.length > 10) {
                              console.log("Using cached description for node:", node.id);
                              
                              // Validate markdown formatting in the cached description
                              const hasMarkdown = cachedDescription.includes('**') || 
                                                cachedDescription.includes('*') || 
                                                cachedDescription.includes('- ');
                              
                              if (hasMarkdown) {
                                // Cached description has proper formatting
                                setNodeDescription(cachedDescription);
                              } else {
                                // Add formatting to plain text description
                                const formattedDesc = `**${node.label}**\n\n*${cachedDescription}*`;
                                setNodeDescription(formattedDesc);
                                
                                // Also update cache with better formatting
                                setNodeDescriptions(prev => ({
                                  ...prev,
                                  [node.id]: formattedDesc
                                }));
                              }
                              setIsLoadingDescription(false);
                            } else {
                              // Fetch from API if not cached or cache was empty
                              console.log("Fetching new description for node:", node.id);
                              fetchNodeDescription(node.id);
                            }
                          }, 100);
                        }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                      >                        <div className={`h-full relative group transition-all duration-300 transform ${
                          hoveredNode === node.id ? 'scale-105' : 'scale-100'                        } ${selectedNode === node.id ? 'scale-102' : ''} ${
                          draggedNode === node.id ? 'opacity-80 shadow-2xl' : ''
                        }`}>{/* Background glow */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${getNodeGradient(node.type, node.priority)} rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                          
                          {/* Futuristic scanning line effect */}
                          <div className="absolute inset-0 rounded-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-30 animate-[scan-line_3s_ease-in-out_infinite]"></div>
                          </div>
                            {/* Node container */}                          <div className={`relative h-full bg-gray-900/80 backdrop-blur-sm border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300 ${getNodeBorderClass(node.id)}`}>{/* Drag handle */}
                            <div 
                              className="absolute top-1 right-1 opacity-70 group-hover:opacity-100 transition-opacity cursor-grab hover:cursor-grab active:cursor-grabbing"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleMouseDown(e, node.id);
                              }}
                            >
                              <GripVertical className="h-4 w-4 text-gray-300 hover:text-white transition-colors" />
                            </div>                              {/* Priority indicator - top left corner */}
                            <div className={`absolute -top-2 -left-2 w-5 h-5 rounded-full border-2 border-gray-900 ${getPriorityIndicatorClass(node.priority)} shadow-lg`} title={`${node.priority || 'medium'} priority`}></div>
                            
                            {/* Status indicator - moved to top right */}
                            <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusIndicatorClass(node.status)}`}></div>
                            
                            {/* Microservice badge */}
                            {node.microservice && (
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs bg-blue-500/80 text-white rounded-full border border-blue-400">
                                μService
                              </div>
                            )}
                            
                            {/* Icon */}
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                              {getNodeIcon(node.type)}
                            </div>
                            
                            {/* Label */}
                            <span className="text-xs font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                              {node.label}
                            </span>
                            
                            {/* Type badge */}
                            <span className="text-xs text-gray-300 mt-1 opacity-80">
                              {node.type}
                            </span>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                </svg>                  {/* Corner resize handle */}
                <button 
                  className="absolute bottom-2 right-2 w-12 h-12 cursor-nwse-resize group z-30 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500/70 rounded-lg transition-all duration-200 shadow-lg"
                  onMouseDown={handleResizeStart}
                  aria-label="Resize diagram"
                  title="Drag to resize diagram"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <CornerRightDown className="h-6 w-6 text-red-300 group-hover:text-red-100 group-hover:scale-110 transition-all duration-200" />
                  </div>
                </button>
              </Card>
            </div>            {/* Workflow Explanation Section */}
            <div className="mt-8" style={{ width: `${diagramSize.width}px` }}>
              <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">How this Workflow Works</h3>
                <div 
                  className="text-sm text-red-200 leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ 
                    __html: formatExplanation(workflowExplanation || 'Loading explanation...') 
                  }}
                />
              </Card>
            </div>

            {/* Tech Stack Section - Below Workflow Explanation */}
            <div className="mt-8" style={{ width: `${diagramSize.width}px` }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/10 to-purple-700/10 rounded-3xl blur-2xl"></div>
                <Card className="relative bg-gray-900/60 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-400" />
                    Recommended Tech Stack
                  </h3>
                  
                  {/* Loading State */}
                  {isTechStackLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                      <span className="ml-2 text-blue-200">Generating recommendations...</span>
                    </div>
                  ) : techStackError ? (
                    <div className="text-center py-8">
                      <div className="text-red-400 mb-2">⚠️</div>
                      <p className="text-red-300 text-sm">{techStackError}</p>
                    </div>
                  ) : techStack.length > 0 ? (
                    <div>
                      <div className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded border border-green-500/30 inline-block mb-4">
                        {techStack.length} recommendations ready
                      </div>
                      
                      {/* Tech Stack Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from(new Set(techStack.map(t => t.category))).map(category => (
                          <div key={category} className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-blue-700/10 rounded-xl blur-lg"></div>
                            <Card className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-500/20 rounded-xl p-4 shadow-lg">
                              <h4 className="text-sm font-semibold text-white mb-3 flex items-center capitalize">
                                {getCategoryIcon(category)}
                                <span className="ml-2">{category}</span>
                              </h4>
                              <div className="space-y-2">
                                {techStack
                                  .filter(tech => tech.category === category)
                                  .map(tech => (
                                    <div
                                      key={tech.id}
                                      className="group p-3 rounded-lg border border-gray-600/30 bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-200 hover:border-blue-500/40"
                                    >
                                      <h5 className="text-white font-medium text-sm group-hover:text-blue-100 transition-colors">
                                        {tech.name}
                                      </h5>
                                      <p className="text-gray-300 text-xs mt-1 leading-relaxed group-hover:text-gray-200 transition-colors">
                                        {tech.reason}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>
              </div>
            </div></div>
              {/* Component Details Side Panel */}
            <div className="w-full lg:w-80 xl:w-96 space-y-6 flex-shrink-0">
              {/* Node Details */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/10 to-gray-700/10 rounded-3xl blur-2xl"></div>
              <Card className="relative bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center tracking-tight">
                  <Eye className="mr-2 h-4 w-4 text-red-400" />
                  Component Details
                </h3>
                {selectedNode ? (
                  <div className="space-y-4">
                    {(() => {
                      const node = workflowNodes.find(n => n.id === selectedNode);
                      return node ? (
                        <>                          <div className="text-center">
                            <div className="text-2xl mb-2">{getNodeIcon(node.type)}</div>
                            <h4 className="font-semibold text-white text-base mb-1">
                              {node.label}
                            </h4>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              node.priority === 'high' ? 'bg-red-500/20 text-red-200 border border-red-500/30' :
                              node.priority === 'low' ? 'bg-gray-500/20 text-gray-200 border border-gray-500/30' :
                              'bg-gray-500/20 text-gray-200 border border-gray-500/30'
                            }`}>
                              {node.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                            </span>
                          </div>
                            {/* AI-Generated Component Description */}
                          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3">
                            {isLoadingDescription ? (
                              <div className="flex items-center justify-center py-2">
                                <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                                <span className="text-xs text-red-200">Generating insights...</span>
                              </div>
                            ) : nodeDescription ? (
                              <div 
                                className="text-xs leading-relaxed text-gray-300"
                                dangerouslySetInnerHTML={{ 
                                  __html: formatMarkdownDescription(nodeDescription)
                                }}
                              />
                            ) : (
                              <div className="text-center py-2">
                                <div className="text-xs text-red-200">Click a component for description</div>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 space-y-2 mt-3">
                            <div className="flex justify-between">
                              <span className="text-red-200 text-xs">Type:</span>
                              <span className="text-white text-xs font-medium">{node.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-200 text-xs">Connections:</span>
                              <span className="text-white text-xs font-medium">{node.connections.length}</span>
                            </div>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-xs">Select a component to view its details</p>
                  </div>
                )}
              </Card>
            </div>
              {/* Architecture Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-red-700/10 rounded-3xl blur-2xl"></div>
              <Card className="relative bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center tracking-tight">
                  <BarChart3 className="mr-2 h-4 w-4 text-red-400" />
                  Architecture Stats
                </h3>                {/* Enhanced status indicator for pre-generated descriptions */}
                {workflowNodes.length > 0 && (
                  <div className={`rounded-lg p-1 px-2 mb-3 flex items-center text-xs ${
                    Object.keys(nodeDescriptions).length === workflowNodes.length
                      ? "bg-green-500/10 border border-green-500/30"
                      : Object.keys(nodeDescriptions).length > workflowNodes.length / 2
                        ? "bg-yellow-500/10 border border-yellow-500/30"
                        : "bg-red-500/10 border border-red-500/30"
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      Object.keys(nodeDescriptions).length === workflowNodes.length
                        ? "bg-green-400"
                        : Object.keys(nodeDescriptions).length > workflowNodes.length / 2
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    }`}></div>
                    <span className={`${
                      Object.keys(nodeDescriptions).length === workflowNodes.length
                        ? "text-green-300"
                        : Object.keys(nodeDescriptions).length > workflowNodes.length / 2
                          ? "text-yellow-300"
                          : "text-red-300"
                    }`}>
                      {Object.keys(nodeDescriptions).length === workflowNodes.length 
                        ? 'All component descriptions ready' 
                        : `${Object.keys(nodeDescriptions).length}/${workflowNodes.length} descriptions ready`}
                      {Object.keys(nodeDescriptions).length < workflowNodes.length && ' - generating...'}
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs">Components</span>
                    <span className="text-lg font-bold text-white">{workflowNodes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs">Connections</span>
                    <span className="text-lg font-bold text-white">
                      {workflowNodes.reduce((acc, node) => acc + (Array.isArray(node.connections) ? node.connections.length : 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">                    <span className="text-gray-300 text-xs">Complexity</span>
                    <span className={`text-base font-bold ${getComplexityColor(workflowNodes.length)}`}>
                      {getComplexityLabel(workflowNodes.length)}
                    </span>
                  </div>
                  
                  {/* Priority breakdown */}
                  <div className="pt-3 border-t border-red-500/30">
                    <div className="text-xs text-gray-300 mb-1">Priority Distribution</div>
                    <div className="space-y-1">
                      {['high', 'medium', 'low'].map(priority => {
                        const count = workflowNodes.filter(n => n.priority === priority).length;
                        return count > 0 ? (
                          <div key={priority} className="flex justify-between text-xs">
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
          {/* Project Summary Section */}
        <div className="mt-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-blue-700/10 rounded-3xl blur-2xl"></div>
            <Card className="relative bg-gray-900/60 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center tracking-tight">
                <Brain className="mr-3 h-6 w-6 text-green-400" />
                Project Architecture Summary
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workflow Summary */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-3">Architecture Overview</h4>                  <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                    <p className="text-gray-200 mb-4">
                      <strong>Your SaaS architecture</strong> consists of <strong>{workflowNodes.length} interconnected components</strong> designed to work together seamlessly. This architecture follows modern microservices patterns and ensures scalability, maintainability, and security.
                    </p>
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                      <h5 className="text-green-300 font-medium mb-2">Key Architecture Highlights:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• <strong>{workflowNodes.filter(n => n.priority === 'high').length} high-priority components</strong> for core functionality</li>
                        <li>• <strong>{workflowNodes.reduce((acc, node) => acc + (Array.isArray(node.connections) ? node.connections.length : 0), 0)} interconnections</strong> ensuring seamless data flow</li>
                        <li>• <strong>{getComplexityLabel(workflowNodes.length)} complexity</strong> level appropriate for your requirements</li>
                        <li>• <strong>Modular design</strong> allowing for independent scaling and maintenance</li>
                      </ul>
                    </div>
                    
                    <p className="text-gray-200">
                      Each component has been strategically positioned to optimize performance, security, and user experience. The architecture supports both horizontal and vertical scaling as your SaaS grows.
                    </p>
                  </div>
                </div>

                {/* Tech Stack Summary */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue-300 mb-3">Technology Stack Rationale</h4>                  <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                    <p className="text-gray-200 mb-4">
                      <strong>{techStack.length} carefully selected technologies</strong> have been recommended based on your project requirements, industry best practices, and long-term maintainability considerations.
                    </p>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                      <h5 className="text-blue-300 font-medium mb-2">Stack Composition:</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Array.from(new Set(techStack.map(t => t.category))).map(category => (
                          <div key={category} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{category}:</span>
                            <span className="text-blue-300 font-medium">{techStack.filter(t => t.category === category).length}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-200 mb-3">
                      <strong>Why these technologies?</strong> Each recommendation considers factors like:
                    </p>
                    <ul className="text-gray-300 text-sm space-y-1 mb-4">
                      <li>• <strong>Community support</strong> and long-term viability</li>
                      <li>• <strong>Performance</strong> characteristics for your use case</li>
                      <li>• <strong>Learning curve</strong> and developer availability</li>
                      <li>• <strong>Ecosystem compatibility</strong> and integration ease</li>
                      <li>• <strong>Scalability</strong> and production readiness</li>
                    </ul>
                      <p className="text-gray-200">
                      This stack provides a solid foundation for building, deploying, and maintaining your SaaS application while allowing for future growth and technology evolution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Implementation Roadmap */}
              <div className="mt-8 pt-6 border-t border-gray-600/30">
                <h4 className="text-lg font-semibold text-purple-300 mb-4">Implementation Roadmap</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h5 className="text-purple-300 font-medium mb-2">Phase 1: Foundation</h5>
                    <p className="text-gray-300 text-sm">
                      Set up core infrastructure, databases, and authentication systems. Establish development environment and CI/CD pipelines.
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h5 className="text-purple-300 font-medium mb-2">Phase 2: Core Features</h5>
                    <p className="text-gray-300 text-sm">
                      Implement primary business logic, API endpoints, and user-facing features. Focus on high-priority components first.
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h5 className="text-purple-300 font-medium mb-2">Phase 3: Scale & Optimize</h5>
                    <p className="text-gray-300 text-sm">
                      Add monitoring, analytics, and performance optimizations. Implement advanced features and scaling strategies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-6 pt-6 border-t border-gray-600/30">
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <ChevronRight className="mr-2 h-5 w-5 text-green-400" />
                    Ready to Start Building?
                  </h5>
                  <p className="text-gray-200 text-sm mb-4">
                    Your architecture is now complete! Use this as a blueprint for your development team. Consider starting with the high-priority components and gradually building out the full system.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Architecture: Ready</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Tech Stack: Validated</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Roadmap: Defined</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-gray-900/60 border-red-500/30 hover:bg-gray-900/80 text-white px-8 py-4 rounded-2xl transition-all backdrop-blur-2xl"
          >
            Back to Requirements
          </Button>          <Button
            onClick={handleRestart}
            className="bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-green-500/25"
          >
            Start New Project
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualization;
