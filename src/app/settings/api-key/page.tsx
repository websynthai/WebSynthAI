'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, KeyRound, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const ApiKeyPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('apiKey', newApiKey);
  };

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-foreground">
              API Keys
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Manage your API keys for accessing external services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="openai-key"
                className="text-sm font-medium text-foreground"
              >
                OpenAI API Key
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={isRevealed ? 'text' : 'password'}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    className="pr-10 font-mono bg-background border-border"
                  />
                  <Button
                    onClick={handleReveal}
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full
                      bg-muted/50 hover:bg-muted
                      text-muted-foreground hover:text-foreground
                      transition-all duration-200
                      hover:scale-105
                      focus:ring-2 focus:ring-primary/20
                      active:scale-95"
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleApiKeyChange('')}
                  className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                >
                  Clear
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/50 p-4 rounded-md flex items-start space-x-2 text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Security Notice</p>
                <p className="text-sm">
                  Keep your API keys secure and never share them publicly. If
                  you suspect your key has been compromised, regenerate it
                  immediately from your OpenAI dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground">
            Usage & Billing
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Monitor your API usage and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-md flex items-start space-x-2 text-blue-800 dark:text-blue-300">
            <p className="text-sm">
              Coming soon. You'll be able to track your API usage and manage
              billing settings here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyPage;
