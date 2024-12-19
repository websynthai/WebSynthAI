import { cn } from '@/lib/utils';
import type { FC } from 'react';

const Spinner: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'pointer-events-none flex items-center justify-center rounded-full bg-black/30 transition-opacity duration-300 h-4 w-4',
        className,
      )}
    >
      <svg
        className="h-6 w-6 animate-spin text-white"
        fill="none"
        viewBox="-4 -4 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Loading...</title>
        <circle
          className="stroke-current opacity-25"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"
        />
        <path
          className="fill-current opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
