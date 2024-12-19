import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';

interface VersionPreviewProps {
  id: string;
  img?: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  index: number;
  loading?: boolean;
}

export function VersionPreview({
  img,
  isActive,
  isOpen,
  onClick,
  index,
  loading,
}: VersionPreviewProps) {
  return (
    <button
      onClick={onClick}
      className="group relative z-10 flex h-full min-h-[25px] w-full min-w-[40px] shrink-0 cursor-pointer rounded-md outline-none focus:ring-gray-700 focus-visible:ring-1"
      tabIndex={0}
      type="button"
      data-state={isOpen ? 'open' : 'closed'}
    >
      <div
        className={cn(
          'aspect-video w-full origin-top-left overflow-hidden rounded-md border shadow-sm transition-all duration-300 ease-out [&_iframe]:hover:!opacity-100',
          isActive ? 'border-blue-600' : 'border-muted',
          !isOpen && 'opacity-0',
        )}
      >
        <div className="h-full w-full group-[[data-state=open]]:opacity-100 opacity-100 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Image
              src={img || '/placeholder.svg'}
              alt={`Version ${index}`}
              className="aspect-video object-cover text-left text-xs text-zinc-700"
              fill
              loading="lazy"
            />
          )}
        </div>
      </div>
      <div
        className={cn(
          'absolute z-10 flex h-6 w-8 items-center justify-center rounded-sm border px-2 font-mono text-xs leading-none transition-all duration-300 bottom-1 left-1 border-blue-600 bg-blue-100 text-blue-600',
          isActive
            ? 'border-blue-600 bg-blue-100 text-blue-600'
            : 'border-muted bg-background/80 text-muted-foreground',
          !isOpen && 'pointer-events-none bottom-0 left-0',
        )}
        title={`v${index}`}
      >
        v{index}
      </div>
    </button>
  );
}
