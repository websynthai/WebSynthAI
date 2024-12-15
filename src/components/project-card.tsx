import PromptBadge from '@/components/prompt-badge';
import {
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { Avatar } from '@/lib/nextui-components';
import { timeAgo } from '@/lib/time';
import type { UI, User } from '@/types/user';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UserAvatar = ({ user, onClick }: { user: User; onClick: () => void }) => (
  <Tooltip>
    <TooltipTrigger>
      <Avatar
        onClick={onClick}
        className="h-4 w-4 ring-1 ring-primary/10 hover:ring-primary/30 transition-all cursor-pointer"
      >
        <AvatarImage src={user.imageUrl ?? ''} />
        <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
      </Avatar>
    </TooltipTrigger>
    <TooltipContent>
      <p className="text-xs">{user.username}</p>
    </TooltipContent>
  </Tooltip>
);

const Stats = ({
  viewCount,
  likesCount,
}: {
  viewCount: number;
  likesCount: number;
}) => (
  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
    <span className="flex items-center gap-0.5">
      <Eye className="h-3 w-3" />
      {viewCount}
    </span>
    <span className="flex items-center gap-0.5">
      <Heart className="h-3 w-3" />
      {likesCount}
    </span>
  </div>
);

const ProjectCard = ({ ui, onClick }: { ui: UI; onClick: () => void }) => {
  const router = useRouter();

  return (
    <Card
      className="group relative bg-background dark:bg-background rounded-lg overflow-hidden cursor-pointer shadow-none border-border dark:border-border border-2"
      onClick={onClick}
    >
      <div className="w-full aspect-[4/3] relative overflow-hidden">
        <Image
          src={ui.img}
          alt={ui.prompt}
          className="object-cover transform transition-transform duration-500"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-2 space-y-1.5 border-t-2 border-border dark:border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <UserAvatar
              user={ui.user}
              onClick={() => router.push(`/generations/${ui.user.username}`)}
            />
            <Tooltip>
              <TooltipTrigger className="min-w-0">
                <p className="text-[10px] text-foreground dark:text-foreground truncate">
                  {ui.prompt}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{ui.prompt}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Stats viewCount={ui.viewCount} likesCount={ui.likesCount} />
        </div>

        <div className="flex items-center justify-between">
          <PromptBadge
            variant="secondary"
            className="text-[9px] px-1.5 py-0.5 bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground"
            prompt={ui.uiType}
          />
          <span className="text-[9px] text-muted-foreground dark:text-muted-foreground">
            {timeAgo(ui.updatedAt || ui.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
