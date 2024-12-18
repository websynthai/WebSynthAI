import { Card, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { timeAgo } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { UI } from '@/types/user';
import Image from 'next/image';
import Link from 'next/link';

const ProjectCard = ({ ui, onClick }: { ui: UI; onClick: () => void }) => {
  return (
    <div className="space-y-4 w-full">
      <Card
        className="group relative block aspect-preview w-full overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer shadow-none"
        onClick={onClick}
      >
        <span className="bg-opacity/80 md:text-xxs absolute right-2 top-2 z-10 rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 md:right-1 md:top-1 md:px-1 md:py-0.5">
          {timeAgo(ui.updatedAt || ui.createdAt)}
        </span>

        <div className="flex h-full items-center justify-center">
          <Image
            src={ui.img || '/placeholder.svg'}
            alt={ui.prompt}
            className={cn(
              ui.img
                ? 'object-cover object-top'
                : 'object-contain p-8 bg-[#eaeaea]',
            )}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
            priority={false}
          />
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Link href={`/generations/${ui.user.username}`} className="flex-none">
            <Image
              src={ui.user.imageUrl ?? ''}
              alt={ui.user.username}
              className="shrink-0 select-none rounded-full"
              width={28}
              height={28}
              loading="lazy"
            />
          </Link>

          <Tooltip>
            <TooltipTrigger className="group relative flex max-w-[70%] items-center">
              <div className="relative flex-1 overflow-hidden text-ellipsis rounded-2xl bg-secondary px-3 py-1">
                <span className="text-left text-sm line-clamp-1 break-all text-secondary-foreground">
                  {ui.prompt}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{ui.prompt}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
