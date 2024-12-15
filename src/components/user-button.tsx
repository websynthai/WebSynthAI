import { signOutGithub } from '@/actions/auth/sign-out';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthModal } from '@/hooks/useAuthModal';
import { BugIcon, LogOut, Settings, SquareLibrary } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  external?: boolean;
  needsUsername?: boolean;
};

const MENU_ITEMS: Array<{ group: string; items: MenuItem[] }> = [
  {
    group: 'support',
    items: [
      {
        icon: BugIcon,
        label: 'Report an issue',
        href: 'https://github.com/SujalXplores/v0.diy/issues/new',
        external: true,
      },
    ],
  },
  {
    group: 'user',
    items: [
      {
        icon: SquareLibrary,
        label: 'Generations',
        href: '/generations',
        needsUsername: true,
      },
    ],
  },
  {
    group: 'settings',
    items: [
      {
        icon: Settings,
        label: 'Settings',
        href: '/settings',
      },
    ],
  },
];

const LoadingState = () => (
  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
);

const SignInButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    className="font-medium transition-all bg-gradient-to-r from-primary to-primary/80"
  >
    Sign In
  </Button>
);

export default function UserButton() {
  const router = useRouter();
  const { toggle: toggleAuth } = useAuthModal();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOutGithub();
    router.push('/');
  };

  if (status === 'loading') return <LoadingState />;
  if (status === 'unauthenticated')
    return <SignInButton onClick={toggleAuth} />;
  if (!session?.user) return null;

  const user: User = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.imageUrl || ''} alt="User profile picture" />
          <AvatarFallback>
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>@{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {MENU_ITEMS.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            <DropdownMenuGroup>
              {group.items.map(
                ({ icon: Icon, label, href, external, needsUsername }) => (
                  <Link
                    key={label}
                    href={needsUsername ? `${href}/${user.username}` : href}
                    {...(external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    passHref
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{label}</span>
                    </DropdownMenuItem>
                  </Link>
                ),
              )}
            </DropdownMenuGroup>
            {groupIndex < MENU_ITEMS.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
