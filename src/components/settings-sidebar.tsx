import { cn } from '@/lib/utils';
import {
  Bot,
  Info,
  Key,
  Layout,
  Palette,
  Settings,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SIDEBAR_ITEMS = [
  { name: 'General', href: '/settings/general', icon: Settings },
  { name: 'Account', href: '/settings/account', icon: UserCircle },
  { name: 'Themes', href: '/themes', icon: Palette },
  { name: 'UI', href: '/settings/ui', icon: Layout },
  { name: 'LLM', href: '/settings/llm', icon: Bot },
  { name: 'API keys', href: '/settings/api-key', icon: Key },
  { name: 'About', href: '/settings/about', icon: Info },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-card/50 dark:bg-card/50 backdrop-blur-xl border-r border-border h-full px-3 py-6">
      <ul className="space-y-1.5">
        {SIDEBAR_ITEMS.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={name}>
              <Link
                href={href}
                className={cn(
                  'group flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 dark:bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-4 w-4 transition-colors duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
