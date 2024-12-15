'use client';

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useLanguage from '@/hooks/useLanguage';
import { type ModeStore, useClientMode } from '@/hooks/useMode';
import { Code2, InfoIcon, Settings2, Zap } from 'lucide-react';
import React from 'react';

export default function LLMSettingsPage() {
  const { preciseMode, balancedMode, creativeMode, setMode }: ModeStore =
    useClientMode();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-sm border border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-foreground">
              UI Configuration
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Choose which modes to generate code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6">
            <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="preciseMode"
                    className="text-sm font-medium text-foreground flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Precise mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Delivers highly accurate, detail-oriented results with
                    minimal creativity.
                  </p>
                </div>
                <Switch
                  id="preciseMode"
                  disabled
                  checked={preciseMode}
                  onCheckedChange={(val) => setMode('preciseMode', val)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="balancedMode"
                    className="text-sm font-medium text-foreground flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span>Balanced mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Blends accuracy and creativity for engaging, well-structured
                    output.
                  </p>
                </div>
                <Switch
                  id="balancedMode"
                  checked={balancedMode}
                  onCheckedChange={(val) => setMode('balancedMode', val)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="creativeMode"
                    className="text-sm font-medium text-foreground flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4 text-green-500" />
                    <span>Creative mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Focuses on generating unique, imaginative, and innovative
                    results.
                  </p>
                </div>
                <Switch
                  id="creativeMode"
                  checked={creativeMode}
                  onCheckedChange={(val) => setMode('creativeMode', val)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="diyMode"
                    className="text-sm font-medium text-foreground flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span>v0.diy mode</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Optimized and fine-tuned to generate the most efficient and
                    high-quality code
                  </p>
                </div>
                <Switch
                  id="diyMode"
                  disabled
                  checked={false}
                  onCheckedChange={(val) => setMode('creativeMode', val)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-lg flex items-start space-x-2 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">v0.diy mode coming soon.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-sm border border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold text-foreground">
              Language Settings
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Choose the language and framework to be used for generating code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6">
            <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-all duration-200">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">
                    Default language
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred programming language
                  </p>
                </div>
                <Select onValueChange={setLanguage} defaultValue={language}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">Javascript</SelectItem>
                    <SelectItem disabled value="typescript">
                      Typescript
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-lg flex items-start space-x-2 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Typescript is in beta. It may not work as expected in some
                cases.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-all duration-200">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">
                    Framework
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred framework
                  </p>
                </div>
                <Select defaultValue="react">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem disabled value="angular">
                      Angular
                    </SelectItem>
                    <SelectItem disabled value="vue">
                      Vue
                    </SelectItem>
                    <SelectItem disabled value="svelte">
                      Svelte
                    </SelectItem>
                    <SelectItem disabled value="nuxt">
                      Nuxt
                    </SelectItem>
                    <SelectItem disabled value="gastby">
                      Gastby
                    </SelectItem>
                    <SelectItem disabled value="ember">
                      Ember
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-lg flex items-start space-x-2 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Support for other frameworks is coming later this decade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
