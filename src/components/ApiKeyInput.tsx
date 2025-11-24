// Re-export the cleaned API key input from `ApiKeyInputClean` so existing imports remain stable.
export { default } from './ApiKeyInputClean';

// Note: The old file contained duplicate code and a test UI. The application now uses a cleaned
// version `ApiKeyInputClean.tsx`. This file exists only as a stable import path.
// Re-export the clean API key input component.
export { default } from './ApiKeyInputClean';
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const keySet = isApiKeySet();
    setIsKeySet(keySet);
    onApiKeySet(keySet);
  }, [onApiKeySet]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }
    if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
      setError('Invalid API key format');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setDeepSeekApiKey(apiKey.trim());
      setIsKeySet(true);
      onApiKeySet(true);
      setApiKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set API key');
      setIsKeySet(false);
      onApiKeySet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsKeySet(false);
    setApiKey('');
    setError('');
    onApiKeySet(false);
  };

  return (
    <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">OpenRouter API Key Required</h3>
            <p className="text-sm text-red-200">Enter your API key to start generating architectures</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div className="text-red-200 text-sm">{error}</div>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSetApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
            >
              {isLoading ? 'Setting Key...' : 'Set API Key'}
            </Button>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="w-full bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
            >
              Clear Key
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your OpenRouter API key at openrouter.ai</p>
          <p>• Your key is stored securely in browser memory only</p>
        </div>
      </div>
    </Card>
  );
};

// Old code removed: the previous file contained multiple duplicate component definitions and test UI elements. This file now delegates to ApiKeyInputClean.
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';
import { setApiKey as setDeepSeekApiKey, clearApiKey, isApiKeySet } from '@/utils/deepseekApi';

interface ApiKeyInputProps {
  onApiKeySet: (isSet: boolean) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const keySet = isApiKeySet();
    setIsKeySet(keySet);
    onApiKeySet(keySet);
  }, [onApiKeySet]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }
    if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
      setError('Invalid API key format');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setDeepSeekApiKey(apiKey.trim());
      setIsKeySet(true);
      onApiKeySet(true);
      setApiKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set API key');
      setIsKeySet(false);
      onApiKeySet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsKeySet(false);
    setApiKey('');
    setError('');
    onApiKeySet(false);
  };

  return (
    <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">OpenRouter API Key Required</h3>
            <p className="text-sm text-red-200">Enter your API key to start generating architectures</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div className="text-red-200 text-sm">{error}</div>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSetApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
            >
              {isLoading ? 'Setting Key...' : 'Set API Key'}
            </Button>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="w-full bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
            >
              Clear Key
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your OpenRouter API key at openrouter.ai</p>
          <p>• Your key is stored securely in browser memory only</p>
        </div>
      </div>
    </Card>
  );
};

// The original content has been removed, re-exporting the clean component instead.
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';
import { setApiKey as setDeepSeekApiKey, clearApiKey, isApiKeySet } from '@/utils/deepseekApi';

interface ApiKeyInputProps {
  onApiKeySet: (isSet: boolean) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const keySet = isApiKeySet();
    setIsKeySet(keySet);
    onApiKeySet(keySet);
  }, [onApiKeySet]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
      setError('Invalid API key format');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      setDeepSeekApiKey(apiKey.trim());
      setIsKeySet(true);
      onApiKeySet(true);
      setApiKey(''); // Clear input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set API key');
      setIsKeySet(false);
      onApiKeySet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsKeySet(false);
    setApiKey('');
    setError('');
    onApiKeySet(false);
  };

  return (
    <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">OpenRouter API Key Required</h3>
            <p className="text-sm text-red-200">Enter your API key to start generating architectures</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div className="text-red-200 text-sm">{error}</div>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSetApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
            >
              {isLoading ? 'Setting Key...' : 'Set API Key'}
            </Button>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="w-full bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
            >
              Clear Key
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your OpenRouter API key at openrouter.ai</p>
          <p>• Your key is stored securely in browser memory only</p>
        </div>
      </div>
    </Card>
  );
};

// End of file: re-export only the clean component.
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';
import { setApiKey as setDeepSeekApiKey, clearApiKey, isApiKeySet } from '@/utils/deepseekApi';

interface ApiKeyInputProps {
  onApiKeySet: (isSet: boolean) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    const keySet = isApiKeySet();
    setIsKeySet(keySet);
    onApiKeySet(keySet);
  }, [onApiKeySet]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
      setError('Invalid API key format');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      setDeepSeekApiKey(apiKey.trim());
      setIsKeySet(true);
      onApiKeySet(true);
      setApiKey(''); // Clear input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set API key');
      setIsKeySet(false);
      onApiKeySet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsKeySet(false);
    setApiKey('');
    setError('');
    onApiKeySet(false);
  };

  return (
    <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">OpenRouter API Key Required</h3>
            <p className="text-sm text-red-200">Enter your API key to start generating architectures</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <div className="text-red-200 text-sm">{error}</div>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSetApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
            >
              {isLoading ? 'Setting Key...' : 'Set API Key'}
            </Button>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="w-full bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
            >
              Clear Key
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your OpenRouter API key at openrouter.ai</p>
          <p>• Your key is stored securely in browser memory only</p>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Shield } from 'lucide-react';
import { setApiKey as setDeepSeekApiKey, clearApiKey, isApiKeySet } from '@/utils/deepseekApi';

interface ApiKeyInputProps {
  onApiKeySet: (isSet: boolean) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    // Check if API key already set in memory
    const keySet = isApiKeySet();
    setIsKeySet(keySet);
    onApiKeySet(keySet);
  }, [onApiKeySet]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }
    // Basic validation but keep it permissive
    if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
      setError('Invalid API key format');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      setDeepSeekApiKey(apiKey.trim());
      setIsKeySet(true);
      onApiKeySet(true);
      setApiKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set API key');
      setIsKeySet(false);
      onApiKeySet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsKeySet(false);
    setApiKey('');
    setError('');
    onApiKeySet(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSetApiKey();
    }
  };

  return (
    <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">OpenRouter API Key Required</h3>
            <p className="text-sm text-red-200">Enter your API key to start generating architectures</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSetApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
            >
              {isLoading ? 'Setting Key...' : 'Set API Key'}
            </Button>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="w-full bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
            >
              Clear Key
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your free API key at openrouter.ai</p>
          <p>• Your key is stored securely in browser memory only</p>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';
import { setApiKey as setDeepSeekApiKey, clearApiKey, isApiKeySet } from '@/utils/deepseekApi';

interface ApiKeyInputProps {
  onApiKeySet: (isSet: boolean) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Removed testing UI variables
  const models = [
    'deepseek/deepseek-r1:free',
    'deepseek/deepseek-r1',
    'openai/gpt-4o-mini'
  ];
  const [selectedModel, setSelectedModel] = useState<string>(getCurrentModel());
  const [error, setError] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    // Check if API key is already set
    const keySet = isApiKeySet();
    setIsKeySet(keySet);
    onApiKeySet(keySet);
  }, [onApiKeySet]);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }

    if (!apiKey.startsWith('sk-or-')) {
      setError('Invalid API key format. OpenRouter keys should start with "sk-or-"');
      return;
    }

    setIsLoading(true);
    setError('');    try {
      setDeepSeekApiKey(apiKey.trim());
      setIsKeySet(true);
      onApiKeySet(true);
      setApiKey(''); // Clear the input for security
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set API key');
      setIsKeySet(false);
      onApiKeySet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setIsKeySet(false);
    setApiKey('');
    setError('');
    onApiKeySet(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSetApiKey();
    }
  };
                  const res = await testApiKey(undefined, selectedModel);
                  setTestResult(res);
                } catch (err) {
                  setTestResult({ status: 0, body: { error: err instanceof Error ? err.message : String(err) } });
                } finally {
                  setIsTesting(false);
                }
              }}
              variant="ghost"
              size="sm"
              className="bg-gray-900/60 border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-200"
              disabled={isTesting}
            >
              {isTesting ? 'Testing...' : 'Test Key'}
            </Button>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
            >
              Clear Key
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/60 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">OpenRouter API Key Required</h3>
            <p className="text-sm text-red-200">Enter your API key to start generating architectures</p>
          </div>
        </div>

        <Alert className="bg-yellow-500/10 border-yellow-500/30">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200 text-sm">
            Your API key is stored locally in memory only and is never sent to our servers. 
            Get your free key at <span className="font-mono text-yellow-100">openrouter.ai</span>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-2">
            <label htmlFor="model-select" className="text-xs text-gray-400">Model (select to test)</label>
            <select
              id="model-select"
              className="w-full bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 mt-1 p-2 rounded"
              value={selectedModel}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedModel(val);
                setCurrentModel(val);
              }}
            >
              {models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSetApiKey}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
            >
              {isLoading ? 'Setting Key...' : 'Set API Key'}
            </Button>
            <Button
              onClick={async () => {
                if (!apiKey.trim()) {
                  setInputTestResult({ status: 0, body: { error: 'Please enter an API key to test' } });
                  return;
                }
                setIsInputTesting(true);
                setInputTestResult(null);
                try {
                    const res = await testApiKey(apiKey.trim(), selectedModel);
                  setInputTestResult(res);
                } catch (err) {
                  setInputTestResult({ status: 0, body: { error: err instanceof Error ? err.message : String(err) } });
                }
                setIsInputTesting(false);
              }}
              variant="outline"
              size="sm"
              className="w-full bg-gray-900/60 border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-200"
              disabled={isInputTesting}
            >
              {isInputTesting ? 'Testing...' : 'Test Key'}
            </Button>
          </div>
          {isKeySet && (
            <div className="mt-2">
              <Button
                onClick={async () => {
                  setIsTesting(true);
                  setTestResult(null);
                  try {
                    const res = await testApiKey(undefined, selectedModel);
                    setTestResult(res);
                  } catch (err) {
                    setTestResult({ status: 0, body: { error: err instanceof Error ? err.message : String(err) } });
                  } finally {
                    setIsTesting(false);
                  }
                }}
                variant="ghost"
                size="sm"
                className="w-full bg-gray-900/60 border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-200"
                disabled={isTesting}
              >
                {isTesting ? 'Testing...' : 'Test Key'}
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your free API key at openrouter.ai</p>
          <p>• Key format: sk-or-v1-...</p>
          <p>• Your key is stored securely in browser memory</p>
        </div>
        {testResult && (
          <div className="mt-4">
            {testResult.status === 200 ? (
              <Alert className="bg-green-500/10 border-green-500/30">
                <AlertTriangle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200 text-sm">
                  Connection successful (200). Response: {JSON.stringify(testResult.body).slice(0, 200)}
                </AlertDescription>
              </Alert>
              ) : (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200 text-sm">
                  Error: status {testResult.status}. {typeof testResult.body === 'string' ? testResult.body : JSON.stringify(testResult.body).slice(0, 200)}
                </AlertDescription>
                {testResult.status === 429 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedModel('deepseek/deepseek-r1');
                        setTestResult(null);
                        // re-run test quickly
                        setIsTesting(true);
                        testApiKey(undefined, 'deepseek/deepseek-r1')
                          .then(res => setTestResult(res))
                          .catch(e => setTestResult({ status: 0, body: { error: String(e) } }))
                          .finally(() => setIsTesting(false));
                      }}
                    >
                      Try paid model
                    </Button>
                    <a href="https://openrouter.ai/credits" target="_blank" rel="noreferrer" className="text-yellow-300 text-sm underline">Add credits</a>
                  </div>
                )}
              </Alert>
            )}
          </div>
        )}
        {inputTestResult && (
          <div className="mt-4">
            {inputTestResult.status === 200 ? (
              <Alert className="bg-green-500/10 border-green-500/30">
                <AlertTriangle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200 text-sm">
                  Connection successful (200). Response: {JSON.stringify(inputTestResult.body).slice(0, 200)}
                </AlertDescription>
              </Alert>
              ) : (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200 text-sm">
                  Error: status {inputTestResult.status}. {typeof inputTestResult.body === 'string' ? inputTestResult.body : JSON.stringify(inputTestResult.body).slice(0, 200)}
                </AlertDescription>
                {inputTestResult.status === 429 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        setSelectedModel('deepseek/deepseek-r1');
                        setInputTestResult(null);
                        setIsInputTesting(true);
                        const res = await testApiKey(apiKey.trim(), 'deepseek/deepseek-r1');
                        setInputTestResult(res);
                        setIsInputTesting(false);
                      }}
                    >
                      Try paid model
                    </Button>
                    <a href="https://openrouter.ai/credits" target="_blank" rel="noreferrer" className="text-yellow-300 text-sm underline">Add credits</a>
                  </div>
                )}
              </Alert>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApiKeyInput;
