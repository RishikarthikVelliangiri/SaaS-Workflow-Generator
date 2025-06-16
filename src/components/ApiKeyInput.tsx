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

  if (isKeySet) {
    return (
      <Card className="bg-gray-900/60 backdrop-blur-2xl border border-green-500/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">API Key Set</h3>
              <p className="text-sm text-green-200">Ready to generate architecture</p>
            </div>
          </div>
          <Button
            onClick={handleClearApiKey}
            variant="outline"
            size="sm"
            className="bg-gray-900/60 border-red-500/30 hover:bg-red-500/20 text-red-200 hover:text-red-100"
          >
            Clear Key
          </Button>
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

          {error && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSetApiKey}
            disabled={isLoading || !apiKey.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-gray-700 hover:from-red-500 hover:to-gray-600 text-white"
          >
            {isLoading ? 'Setting Key...' : 'Set API Key'}
          </Button>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• Get your free API key at openrouter.ai</p>
          <p>• Key format: sk-or-v1-...</p>
          <p>• Your key is stored securely in browser memory</p>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
