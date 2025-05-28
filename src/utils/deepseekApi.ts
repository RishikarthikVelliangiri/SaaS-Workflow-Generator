
const DEEPSEEK_API_KEY = 'sk-111000fcf2644c5fb01aaab14447cdcb';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export const callDeepSeekAPI = async (messages: DeepSeekMessage[]): Promise<string> => {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API error details:', errorData);
      
      if (response.status === 402) {
        throw new Error('DeepSeek API key has insufficient balance. Please check your account.');
      }
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
};

export const generateWorkflowNodes = async (idea: string, requirements: Record<string, any>): Promise<any[]> => {
  const requirementsText = Object.entries(requirements)
    .map(([key, value]) => {
      if (value === 'AI_DECIDE') {
        return `${key}: Let AI decide based on best practices`;
      }
      if (Array.isArray(value)) {
        return `${key}: ${value.join(', ')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');

  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: 'You are a SaaS architecture expert. Generate realistic, modern architecture workflows based on project requirements. Always return valid JSON arrays with workflow nodes. Focus on creating comprehensive, scalable architectures.'
    },
    {
      role: 'user',
      content: `
        Generate a detailed SaaS architecture workflow for the following project:
        
        Idea: ${idea}
        Requirements:
        ${requirementsText}
        
        Create a JSON array of workflow nodes. Each node should have:
        - id: unique identifier (string)
        - label: display name (string)
        - type: component type like frontend, backend, database, api, auth, payment, storage, cache, cdn, notification, analytics, monitoring (string)
        - x: x coordinate between 50-750 (number)
        - y: y coordinate between 50-350 (number)
        - connections: array of node IDs this connects to (array of strings)
        - description: brief description of what this component does (string)
        - priority: "high", "medium", or "low" based on importance (string)
        
        Create 8-12 nodes for a realistic, modern SaaS architecture. Position them logically (frontend on left, database on right, etc.).
        Make sure to include appropriate services based on the scale and features mentioned.
        
        Return only the JSON array, no markdown formatting or extra text.
      `
    }
  ];

  try {
    const response = await callDeepSeekAPI(messages);
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Failed to generate workflow with AI:', error);
    
    // Enhanced fallback based on the idea and requirements
    return generateEnhancedFallbackWorkflow(idea, requirements);
  }
};

const generateEnhancedFallbackWorkflow = (idea: string, requirements: Record<string, any>): any[] => {
  // Create a more dynamic fallback based on the idea
  const isVideoRelated = idea.toLowerCase().includes('video') || idea.toLowerCase().includes('youtube');
  const needsPayments = requirements.payment !== 'No payments needed';
  const isLargeScale = requirements.scale?.includes('Scale') || requirements.scale?.includes('Enterprise');

  const baseNodes = [
    { 
      id: 'frontend', 
      label: 'React Frontend', 
      type: 'frontend', 
      x: 80, 
      y: 180, 
      connections: ['auth', 'api'], 
      description: 'Modern React application with responsive design',
      priority: 'high'
    },
    { 
      id: 'auth', 
      label: 'Authentication', 
      type: 'auth', 
      x: 250, 
      y: 120, 
      connections: ['backend'], 
      description: 'User authentication and authorization system',
      priority: 'high'
    },
    { 
      id: 'api', 
      label: 'REST API', 
      type: 'api', 
      x: 250, 
      y: 240, 
      connections: ['backend'], 
      description: 'RESTful API endpoints for data access',
      priority: 'high'
    },
    { 
      id: 'backend', 
      label: 'Backend Service', 
      type: 'backend', 
      x: 420, 
      y: 180, 
      connections: ['database'], 
      description: 'Core business logic and data processing',
      priority: 'high'
    },
    { 
      id: 'database', 
      label: 'Database', 
      type: 'database', 
      x: 590, 
      y: 180, 
      connections: [], 
      description: 'Primary data storage and management',
      priority: 'high'
    }
  ];

  // Add conditional nodes based on requirements
  if (isVideoRelated) {
    baseNodes.push({
      id: 'storage',
      label: 'Video Storage',
      type: 'storage',
      x: 590,
      y: 280,
      connections: [],
      description: 'Cloud storage for video files and media',
      priority: 'high'
    });
    baseNodes.push({
      id: 'cdn',
      label: 'CDN',
      type: 'cdn',
      x: 420,
      y: 80,
      connections: ['frontend'],
      description: 'Content delivery network for fast video streaming',
      priority: 'medium'
    });
  }

  if (needsPayments) {
    baseNodes.push({
      id: 'payment',
      label: 'Payment Gateway',
      type: 'payment',
      x: 250,
      y: 320,
      connections: ['backend'],
      description: 'Secure payment processing system',
      priority: 'medium'
    });
  }

  if (isLargeScale) {
    baseNodes.push({
      id: 'cache',
      label: 'Redis Cache',
      type: 'cache',
      x: 590,
      y: 80,
      connections: [],
      description: 'High-performance caching layer',
      priority: 'medium'
    });
    baseNodes.push({
      id: 'monitoring',
      label: 'Monitoring',
      type: 'monitoring',
      x: 750,
      y: 180,
      connections: [],
      description: 'Application performance monitoring',
      priority: 'low'
    });
  }

  return baseNodes;
};
