'use client';
import { ForkThemeDialog } from '@/components/fork-theme-dialog';
import { NewThemeDialog } from '@/components/new-theme-dialog';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Theme, themes } from '@/lib/themes';
import { MoreVertical, Palette, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ThemeSelector() {
  const router = useRouter();
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);

  useEffect(() => {
    const storedThemes = localStorage.getItem('customThemes');
    if (storedThemes) {
      setCustomThemes(JSON.parse(storedThemes));
    }
  }, []);

  const handleThemeCreate = (
    themeId: string,
    themeName: string,
    description: string,
  ) => {
    const newTheme: Theme = {
      id: themeId,
      name: themeName,
      description: description,
      colors: {
        background: '0 0% 100%',
        foreground: '240 10% 3.9%',
        card: '0 0% 100%',
        cardForeground: '240 10% 3.9%',
        popover: '0 0% 100%',
        popoverForeground: '240 10% 3.9%',
        primary: '240 5.9% 10%',
        primaryForeground: '0 0% 98%',
        secondary: '240 4.8% 95.9%',
        secondaryForeground: '240 5.9% 10%',
        muted: '240 4.8% 95.9%',
        mutedForeground: '240 3.8% 46.1%',
        accent: '240 4.8% 95.9%',
        accentForeground: '240 5.9% 10%',
        destructive: '0 84.2% 60.2%',
        destructiveForeground: '0 0% 98%',
        border: '240 5.9% 90%',
        input: '240 5.9% 90%',
        ring: '240 10% 3.9%',
        radius: '0.5rem',
      },
    };
    const updatedThemes = [...customThemes, newTheme];
    setCustomThemes(updatedThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
    router.push(`/themes/${themeId}`);
  };

  const handleThemeDelete = (themeId: string, e: any) => {
    e.stopPropagation();
    const updatedThemes = customThemes.filter((theme) => theme.id !== themeId);
    setCustomThemes(updatedThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
    toast.success('Theme deleted successfully');
  };

  const handleThemeFork = (
    originalTheme: Theme,
    newId: string,
    newName: string,
    newDescription: string,
  ) => {
    const forkedTheme: Theme = {
      ...originalTheme,
      id: newId,
      name: newName,
      description: newDescription,
    };
    const updatedThemes = [...customThemes, forkedTheme];
    setCustomThemes(updatedThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
    toast.success('Theme forked successfully');
    router.push(`/themes/${newId}`);
  };

  const ThemeCard = ({
    theme,
    isCustom = false,
  }: {
    theme: Theme;
    isCustom?: boolean;
  }) => (
    <Card
      key={theme.id}
      onClick={() => router.push(`/themes/${theme.id}`)}
      className="group relative overflow-hidden cursor-pointer border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200"
    >
      <CardHeader className="border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-base font-semibold text-foreground">
                {theme.name}
              </CardTitle>
              {isCustom && (
                <Badge variant="secondary" className="text-[10px] font-medium">
                  Custom
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground line-clamp-2">
              {theme.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <ForkThemeDialog
                theme={theme}
                onThemeFork={(newId, newName, newDescription) =>
                  handleThemeFork(theme, newId, newName, newDescription)
                }
              />
              {isCustom && (
                <DropdownMenuItem
                  onClick={(e) => handleThemeDelete(theme.id, e)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono px-1.5 py-0 h-5 text-muted-foreground"
          >
            {theme.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-2">
          {Object.entries(theme.colors)
            .filter(([key]) =>
              ['background', 'foreground', 'primary', 'secondary'].includes(
                key,
              ),
            )
            .map(([key, value]) => (
              <div
                key={key}
                className="flex-1"
                style={{ backgroundColor: `hsl(${value})` }}
              />
            ))}
        </div>
        <div className="p-4 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(theme.colors)
              .filter(([key]) => ['primary', 'secondary'].includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: `hsl(${value})` }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {key}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Themes</h1>
          <p className="text-sm text-muted-foreground">
            Customize your application's look and feel
          </p>
        </div>
        <NewThemeDialog onThemeCreate={handleThemeCreate} />
      </div>

      <div className="space-y-8">
        {/* Built-in Themes */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Built-in Themes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        </div>

        {/* Custom Themes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Custom Themes
              </h2>
            </div>
            <Badge variant="secondary">Beta</Badge>
          </div>
          {customThemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} isCustom />
              ))}
            </div>
          ) : (
            <Card className="border border-dashed border-border bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                <p className="text-sm text-muted-foreground">
                  You haven't created any custom themes yet
                </p>
                <NewThemeDialog onThemeCreate={handleThemeCreate} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
