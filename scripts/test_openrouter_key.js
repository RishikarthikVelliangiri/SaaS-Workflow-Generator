#!/usr/bin/env node

// Node script to test OpenRouter API key connectivity
// Usage: node scripts/test_openrouter_key.js [API_KEY]

const API_KEY = process.argv[2] || process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.error('No API key provided. Set OPENROUTER_API_KEY env var or pass it as argument.');
  process.exit(1);
}

(async () => {
  try {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const body = {
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Hello — minimal connectivity test' }
      ],
    };

    console.log('Testing OpenRouter with model:', body.model);
    console.log('Using API key (masked):', `${API_KEY.slice(0, 6)}...`);

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();

    console.log('Status:', resp.status);
    try {
      const json = JSON.parse(text);
      console.log('Response body (JSON):', JSON.stringify(json, null, 2));
    } catch (err) {
      console.log('Response body (text):', text);
    }

    if (resp.status === 200) {
      console.log('✅ API key works and model returned a response.');
    } else if (resp.status === 401) {
      console.log('❌ 401 - Unauthorized. Invalid or revoked API key.');
    } else if (resp.status === 402) {
      console.log('❌ 402 - Payment required. Check account credits.');
    } else if (resp.status === 429) {
      console.log('⚠️ 429 - Rate limited. Free tier limit reached for the key or model.');
    } else {
      console.log('⚠️ Unhandled status code — check the response for details.');
    }
  } catch (error) {
    console.error('Network error or constraint:', error);
    process.exit(1);
  }
})();
