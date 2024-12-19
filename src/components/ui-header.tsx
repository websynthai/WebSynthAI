import { forkUI } from '@/actions/ui/fork-ui';
import { useAuthModal } from '@/hooks/useAuthModal';
import { GitFork, LockOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import PromptBadge from './prompt-badge';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const UIHeader = ({
  mainPrompt,
  uiId,
  loading,
  forkedFrom,
}: {
  mainPrompt: string;
  uiId: string;
  loading: boolean;
  forkedFrom?: string;
}) => {
  const router = useRouter();
  const { toggle } = useAuthModal();
  const [isForking, setIsForking] = useState(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const handleFork = async () => {
    if (!userId) {
      toggle();
      return;
    }
    if (loading) return;
    setIsForking(true);
    try {
      const forkedUI = await forkUI(uiId, userId);
      toast.success('Fork created! Time to make it unique 🎨');
      router.push(`/ui/${forkedUI.id}`);
    } catch (error) {
      console.error('Error forking UI:', error);
      toast.error(`${error}`);
    } finally {
      setIsForking(false);
    }
  };

  return (
    <div className="w-full bg-white flex justify-between items-center p-4">
      <div className="flex space-x-2 h-8 items-center">
        <Tooltip>
          <TooltipTrigger className="rounded-full font-semibold ml-2 flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
            <PromptBadge
              variant={'secondary'}
              className="rounded-full font-semibold flex text-ellipsis overflow-hidden whitespace-nowrap max-w-96"
              prompt={mainPrompt}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{mainPrompt}</p>
          </TooltipContent>
        </Tooltip>
        <Badge variant={'outline'} className="rounded-xl space-x-1">
          <LockOpen size={14} />
          <p>Public</p>
        </Badge>
        {forkedFrom ? (
          <Badge
            onClick={() => router.push(`/ui/${forkedFrom}`)}
            variant={'outline'}
            className="rounded-xl space-x-1 cursor-pointer"
          >
            <GitFork size={14} />
            <p>From : {forkedFrom}</p>
          </Badge>
        ) : null}
      </div>
      <div className="flex space-x-2 h-8 items-center">
        {status === 'authenticated' && (
          <Button
            onClick={handleFork}
            variant="outline"
            className="rounded-3xl"
            disabled={isForking || loading}
          >
            {isForking ? 'Forking...' : 'Fork'}
          </Button>
        )}
        <Button
          onClick={() => router.push('/')}
          variant="default"
          className="rounded-3xl"
        >
          New Generation
        </Button>
      </div>
    </div>
  );
};

export default UIHeader;
