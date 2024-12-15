'use client';
import { signInGithub } from '@/actions/auth/sign-in';
import { useAuthModal } from '@/hooks/useAuthModal';
import { Github, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui';

const AuthModal = () => {
  const { isOpen, toggle } = useAuthModal();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInGithub();
    } catch (_error) {
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-black">
        <div className="px-6 py-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-medium text-zinc-900 dark:text-white">
              Sign in to continue
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-gray-400">
              Generate beautiful UI components in seconds
            </DialogDescription>
          </DialogHeader>

          <Button
            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 transition-colors"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Github className="h-4 w-4" />
                <span>Continue with GitHub</span>
              </div>
            )}
          </Button>

          <p className="mt-4 text-xs text-center text-zinc-500 dark:text-gray-500">
            A free and open source UI component generator.{' '}
            <span className="text-zinc-700 dark:text-gray-400">
              Built with shadcn/ui and Next.js
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
