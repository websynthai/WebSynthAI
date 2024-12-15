'use client';
import { Badge, Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { themes as defaultThemes } from '@/lib/themes';
import {
  ArrowLeft,
  Palette,
  PlusCircle,
  Save,
  Settings2,
  Type,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, use } from 'react';

type ColorProperty = {
  name: string;
  color: string;
};

const initialProperties: ColorProperty[] = [
  { name: 'Background', color: '#ffffff' },
  { name: 'Foreground', color: '#0a0a0a' },
  { name: 'Primary', color: '#1a1a1a' },
  { name: 'Primary Foreground', color: '#fafafa' },
  { name: 'Secondary', color: '#f4f4f5' },
  { name: 'Secondary Foreground', color: '#1a1a1a' },
  { name: 'Accent', color: '#f4f4f5' },
  { name: 'Accent Foreground', color: '#1a1a1a' },
  { name: 'Muted', color: '#f4f4f5' },
  { name: 'Muted Foreground', color: '#737373' },
  { name: 'Card', color: '#ffffff' },
  { name: 'Card Foreground', color: '#0a0a0a' },
  { name: 'Destructive', color: '#ef4444' },
  { name: 'Destructive Foreground', color: '#fafafa' },
  { name: 'Popover', color: '#ffffff' },
  { name: 'Popover Foreground', color: '#0a0a0a' },
  { name: 'Border', color: '#e5e5e5' },
  { name: 'Input', color: '#e5e5e5' },
  { name: 'Ring', color: '#1a1a1a' },
];

export default function ThemeCustomizer(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const router = useRouter();
  const [properties, setProperties] =
    useState<ColorProperty[]>(initialProperties);
  const [heading, setHeading] = useState('Inter');
  const [body, setBody] = useState('Inter');
  const [radius, setRadius] = useState(0.5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVariableName, setNewVariableName] = useState('');

  useEffect(() => {
    const loadTheme = () => {
      const savedTheme = localStorage.getItem(`theme_${params.id}`);
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setProperties(parsedTheme.properties);
        setHeading(parsedTheme.heading);
        setBody(parsedTheme.body);
        setRadius(parsedTheme.radius);
      } else {
        const customThemes = JSON.parse(
          localStorage.getItem('customThemes') || '[]',
        );
        const themeExists = [...defaultThemes, ...customThemes].some(
          (theme) => theme.id === params.id,
        );

        if (!themeExists) {
          router.push('/themes');
        }
      }
    };

    loadTheme();
  }, [params.id, router]);

  const handleColorChange = (name: string, color: string) => {
    setProperties((prevProperties) =>
      prevProperties.map((prop) =>
        prop.name === name ? { ...prop, color } : prop,
      ),
    );
  };

  const addNewVariable = () => {
    setIsDialogOpen(true);
  };

  const handleNewVariableSubmit = () => {
    if (newVariableName.trim() !== '') {
      setProperties([
        ...properties,
        { name: newVariableName.trim(), color: '#000000' },
      ]);
      setNewVariableName('');
      setIsDialogOpen(false);
    }
  };

  const saveTheme = () => {
    const themeData = {
      properties,
      heading,
      body,
      radius,
    };
    localStorage.setItem(`theme_${params.id}`, JSON.stringify(themeData));
    alert('Theme saved successfully!');
  };

  const ColorInput = ({ property }: { property: ColorProperty }) => (
    <div className="flex items-center space-x-2">
      <Input
        className="!w-8 !h-8 !p-0 rounded-md border border-gray-300 cursor-pointer"
        type="color"
        value={property.color}
        onChange={(e) => handleColorChange(property.name, e.target.value)}
      />
      <Badge className="flex-grow text-center" variant="outline">
        {property.color}
      </Badge>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Button
          onClick={() => router.push('/themes')}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Themes</span>
        </Button>
        <Button
          onClick={() => saveTheme()}
          className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Typography and Border Radius Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card shadow-sm border border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/50">
              <div className="flex items-center space-x-2">
                <Type className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold text-foreground">
                  Typography & Radius
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Typography Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Heading Font
                  </Label>
                  <Select value={heading} onValueChange={setHeading}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Body Font
                  </Label>
                  <Select value={body} onValueChange={setBody}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Border Radius Section */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Border Radius (rem)
                  </Label>
                  <Input
                    type="number"
                    value={radius}
                    onChange={(e) =>
                      setRadius(Number.parseFloat(e.target.value))
                    }
                    step={0.1}
                    min={0}
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 0.5, 1, 1.5].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => setRadius(value)}
                      className={`${
                        radius === value ? 'border-primary' : ''
                      } hover:border-primary/50`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Variables Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card shadow-sm border border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Color Variables
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Beta
                  </Badge>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addNewVariable()}
                        className="flex items-center space-x-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Add Variable</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Color Variable</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="newVariableName">Variable Name</Label>
                          <Input
                            id="newVariableName"
                            value={newVariableName}
                            onChange={(e) => setNewVariableName(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <DialogClose asChild>
                          <Button onClick={handleNewVariableSubmit}>
                            Add Variable
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <div
                    key={property.name}
                    className="group p-4 rounded-lg border border-border bg-muted/50 space-y-2 hover:bg-muted/70 hover:border-primary/20 transition-all duration-200"
                  >
                    <Label className="text-sm font-medium text-muted-foreground">
                      {property.name}
                    </Label>
                    <ColorInput property={property} />
                    <div
                      className="h-2 rounded-full mt-2"
                      style={{ backgroundColor: property.color }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="bg-card shadow-sm border border-border overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/50">
              <div className="flex items-center space-x-2">
                <Settings2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold text-foreground">
                  Theme Preview
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Add preview components here */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
