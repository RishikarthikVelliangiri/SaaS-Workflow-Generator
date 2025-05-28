
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
      throw new Error(`DeepSeek API error: ${response.status}`);
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
      content: 'You are a SaaS architecture expert. Generate realistic, modern architecture workflows based on project requirements. Always return valid JSON arrays with workflow nodes.'
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
        - type: component type like frontend, backend, database, api, auth, payment, storage, cache, cdn, notification (string)
        - x: x coordinate between 50-750 (number)
        - y: y coordinate between 50-350 (number)
        - connections: array of node IDs this connects to (array of strings)
        - description: brief description of what this component does (string)
        
        Create 5-10 nodes for a realistic, modern SaaS architecture. Position them logically (frontend on left, database on right, etc.).
        
        Return only the JSON array, no markdown formatting or extra text.
      `
    }
  ];

  const response = await callDeepSeekAPI(messages);
  
  try {
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Failed to parse workflow JSON:', error);
    throw new Error('Invalid JSON response from AI');
  }
};
