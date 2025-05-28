
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
        max_tokens: 1000,
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

export const generateRequirements = async (idea: string): Promise<string> => {
  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: 'You are a SaaS architecture expert. Generate a list of clarifying questions to better understand the user\'s SaaS idea. Focus on technical requirements, target audience, core features, and scalability needs.'
    },
    {
      role: 'user',
      content: `I want to build a SaaS application: ${idea}. What questions should I answer to clarify my requirements?`
    }
  ];

  return await callDeepSeekAPI(messages);
};
