import { signOutGithub } from '@/actions/auth/sign-out';
import { useAuthModal } from '@/hooks/useAuthModal';
import { BugIcon, LogOut, Settings, SquareLibrary } from 'lucide-react';
import type { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function UserButton() {
  const router = useRouter();
  const { toggle: toggleAuth } = useAuthModal();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOutGithub();
    router.push('/');
  };

  const isAuthenticated = status === 'authenticated';
  const isUnauthenticated = status === 'unauthenticated';

  if (status === 'loading') {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;
  }

  if (isUnauthenticated) {
    return (
      <Button
        onClick={toggleAuth}
        className="font-medium transition-all bg-gradient-to-r from-primary to-primary/80"
      >
        Sign In
      </Button>
    );
  }

  if (!(isAuthenticated && session?.user)) return null;

  const user: User = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex-none rounded-full">
          <Image
            src={user.imageUrl || ''}
            alt="User profile picture"
            width={50}
            height={50}
            className="aspect-square rounded-full bg-background object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>@{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link
            href="https://github.com/SujalXplores/v0.diy/issues/new"
            target="_blank"
          >
            <DropdownMenuItem className="cursor-pointer">
              <BugIcon className="mr-2 h-4 w-4" />
              <span>Report an issue</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <Link href={`/generations/${user.username}`} passHref>
            <DropdownMenuItem className="cursor-pointer">
              <SquareLibrary className="mr-2 h-4 w-4" />
              <span>Generations</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
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
