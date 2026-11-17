
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface OpenAIKeyInputProps {
  onKeySubmit: (key: string) => void;
  loading: boolean;
}

export const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onKeySubmit, loading }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="text-sm text-blue-800">
        <p className="font-medium mb-2">OpenAI API Key Required</p>
        <p>To generate AI-powered themes, please enter your OpenAI API key. You can get one from the OpenAI platform.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="openai-key">OpenAI API Key</Label>
          <div className="relative">
            <Input
              id="openai-key"
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <Button type="submit" disabled={!apiKey.trim() || loading} className="w-full">
          {loading ? 'Generating Themes...' : 'Generate Themes'}
        </Button>
      </form>
      
      <p className="text-xs text-gray-600">
        Your API key is only used for this session and is not stored anywhere.
      </p>
    </div>
  );
};
