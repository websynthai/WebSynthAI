'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from 'lucide-react';
import { useState } from 'react';

export default function GeneralSettingsPage() {
  const [developerMode, setDeveloperMode] = useState(false);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground">
            General Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="preview-deployments"
              className="font-medium text-foreground"
            >
              Default visibility
            </Label>
            <Select defaultValue="public">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public (default)</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-md flex items-start space-x-2 text-blue-800 dark:text-blue-300">
            <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Under development. This setting will be used as the default
              visibility for new ui generation.
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Label
              htmlFor="production-deployments"
              className="font-medium text-foreground"
            >
              Image preview quality
            </Label>
            <Select defaultValue="low">
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (default)</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-md flex items-start space-x-2 text-blue-800 dark:text-blue-300">
            <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Under development. This setting will be used as the default
              quality for image previews. High quality previews may take longer
              to generate and sometime makes the tab unresponsive.
            </p>
          </div>
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="override" className="font-medium">Demo</Label>
            <Switch
              id="override"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div> */}
        </CardContent>
        {/* <CardFooter className="flex justify-between items-center border-t border-gray-200 pt-6">
          <Button variant="outline" className="text-blue-600">
            Learn more
          </Button>
          <Button>Save</Button>
        </CardFooter> */}
      </Card>

      {/* <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold">Transfer</CardTitle>
          <CardDescription>Transfer your projects to another team without downtime or workflow interruptions.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" className="text-blue-600">
              Learn more about Transferring Projects
            </Button>
            <Button>Transfer</Button>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-semibold">Leave Team</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Button variant="destructive">Leave Team</Button>
        </CardContent>
      </Card> */}

      <Card className="bg-card shadow-sm border border-border">
        <CardHeader
          className="border-b border-border cursor-pointer"
          onClick={() => setAdvancedSettingsOpen(!advancedSettingsOpen)}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-foreground">
              Advanced Settings (coming soon)
            </CardTitle>
            {advancedSettingsOpen ? (
              <ChevronUpIcon className="text-foreground" />
            ) : (
              <ChevronDownIcon className="text-foreground" />
            )}
          </div>
          <CardDescription className="text-muted-foreground">
            Configure advanced options for your account.
          </CardDescription>
        </CardHeader>
        {advancedSettingsOpen && (
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="developer-mode"
                  className="font-medium text-foreground"
                >
                  Developer Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable additional developer features and logs.
                </p>
              </div>
              <Switch
                id="developer-mode"
                checked={developerMode}
                onCheckedChange={setDeveloperMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="experimental-features"
                  className="font-medium text-foreground"
                >
                  Experimental Features
                </Label>
                <p className="text-sm text-muted-foreground">
                  Try out new experimental features before they&apos;re
                  released.
                </p>
              </div>
              <Switch
                id="experimental-features"
                checked={experimentalFeatures}
                onCheckedChange={setExperimentalFeatures}
              />
            </div>
          </CardContent>
        )}
        <CardFooter className="flex justify-end items-center border-t border-border pt-6">
          <Button variant="outline">Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
