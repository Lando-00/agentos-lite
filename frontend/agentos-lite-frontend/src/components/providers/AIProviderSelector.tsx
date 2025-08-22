import React, { useState, useEffect } from 'react';
import './AIProviderSelector.css';

// Interface for AI Provider options
export interface AIProvider {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// Mock data for available AI providers - in a real app, this might come from an API
const defaultProviders: AIProvider[] = [
  {
    id: 'mock',
    name: 'Mock Provider',
    description: 'A mock AI provider for testing',
    icon: '🤖'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'ChatGPT and other OpenAI models',
    icon: '🧠'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude and other Anthropic models',
    icon: '🌟'
  }
];

interface AIProviderSelectorProps {
  onProviderChange?: (provider: AIProvider) => void;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ onProviderChange }) => {
  const [providers, setProviders] = useState<AIProvider[]>(defaultProviders);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  // Load saved provider from localStorage
  useEffect(() => {
    const savedProviderId = localStorage.getItem('aiProvider');
    const savedApiKey = localStorage.getItem('aiProviderApiKey');
    
    if (savedProviderId) {
      const provider = providers.find(p => p.id === savedProviderId);
      if (provider) {
        setSelectedProvider(provider);
      }
    } else {
      // Default to first provider
      setSelectedProvider(providers[0]);
    }
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, [providers]);

  // Save provider preference when it changes
  useEffect(() => {
    if (selectedProvider) {
      localStorage.setItem('aiProvider', selectedProvider.id);
      
      if (onProviderChange) {
        onProviderChange(selectedProvider);
      }
    }
  }, [selectedProvider, onProviderChange]);

  // Save API key when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('aiProviderApiKey', apiKey);
    }
  }, [apiKey]);

  const handleProviderSelect = (provider: AIProvider) => {
    setSelectedProvider(provider);
  };

  return (
    <div className="ai-provider-selector">
      <h2>Select AI Provider</h2>
      <div className="provider-list">
        {providers.map(provider => (
          <div 
            key={provider.id} 
            className={`provider-item ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
            onClick={() => handleProviderSelect(provider)}
          >
            <div className="provider-icon">{provider.icon}</div>
            <div className="provider-info">
              <h3>{provider.name}</h3>
              <p>{provider.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedProvider && (
        <div className="provider-settings">
          <h3>Provider Settings</h3>
          <div className="form-group">
            <label htmlFor="apiKey">API Key:</label>
            <input 
              type="password" 
              id="apiKey" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${selectedProvider.name} API key`}
            />
          </div>
          <p className="key-security-note">
            Your API key is stored in your browser's localStorage and is only sent to the provider's API.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIProviderSelector;
