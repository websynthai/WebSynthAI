'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import UserButton from '@/components/user-button';
import { cn } from '@/lib/utils';
import { CompassIcon, FileClockIcon, GithubIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const NAVIGATION_ITEMS = [
  {
    label: 'Explore',
    path: '/explore',
    icon: CompassIcon,
  },
  {
    label: 'Changelogs',
    path: '/changelog',
    icon: FileClockIcon,
  },
] as const;

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'transition-all duration-200',
      )}
    >
      <nav className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className={cn(
              'group flex items-center space-x-2 text-xl font-bold',
              'transition-all duration-200 hover:bg-transparent',
            )}
          >
            <div className="relative">
              <Image
                src="/icon.png"
                alt="v0.diy Logo"
                width={24}
                height={24}
                className="rounded-sm transition-transform duration-200"
              />
            </div>
            <span className="hidden bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent sm:inline">
              v0.diy
            </span>
          </Button>

          <div className="hidden md:flex md:space-x-1">
            {NAVIGATION_ITEMS.map(({ label, path, icon: Icon }) => (
              <Button
                key={path}
                onClick={() => router.push(path)}
                variant="ghost"
                className={cn(
                  'flex items-center space-x-2 text-base font-medium',
                  'transition-all duration-200',
                  pathname === path
                    ? 'bg-secondary text-primary dark:bg-secondary/10'
                    : 'hover:bg-secondary/80 hover:text-primary dark:hover:bg-secondary/20',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            onClick={() =>
              window.open('https://github.com/SujalXplores/v0.diy')
            }
            variant="outline"
            size="icon"
            className={cn(
              'hidden items-center transition-all',
              'hover:bg-secondary/80 hover:text-primary dark:hover:bg-secondary/20 sm:flex',
            )}
          >
            <GithubIcon />
          </Button>

          <UserButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
