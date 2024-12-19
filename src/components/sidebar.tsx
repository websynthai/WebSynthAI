'use client';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';
import { useState } from 'react';
import { VersionPreview } from './version-preview';

export default function Sidebar({ subPrompts, setVersion, subid }: any) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  if (!subPrompts) return null;

  return (
    <div
      className={cn(
        'hidden shrink-0 origin-left select-none flex-col overflow-hidden rounded-lg bg-gray-50 py-2 transition-all duration-300 ease-out @container lg:flex max-h-[calc(100vh-120px)] h-fit',
        status && 'duration-200',
        isOpen ? 'w-[138px]' : 'w-[44px]',
      )}
    >
      <div className="flex h-full flex-col">
        <div
          className={cn(
            'flex items-center transition-transform duration-300 ease-out px-2 pb-3',
            !isOpen && 'px-[6px]',
          )}
        >
          {isOpen && (
            <h2 className="text-sm font-medium text-gray-700 transition-all duration-300 opacity-100">
              History
            </h2>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              'inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-gray-500 rounded-sm hover:bg-gray-200 hover:text-gray-700 h-6 w-8',
              isOpen && 'h-4 w-4 ml-auto',
            )}
          >
            <ChevronsLeft
              className={cn(
                'h-4 w-4 text-gray-600 transition-transform duration-200',
                !isOpen && 'rotate-180',
              )}
            />
            <span className="sr-only">Toggle sidebar</span>
          </button>
        </div>

        <div className="no-scrollbar flex flex-1 flex-col overflow-auto">
          <div className="flex flex-col gap-3 px-[6px]">
            {subPrompts.map((subPrompt: any, i: number) => (
              <VersionPreview
                key={subPrompt[0].id}
                id={subPrompt[0].SUBId}
                img={subPrompt[0].img}
                isActive={subid === subPrompt[0].SUBId}
                isOpen={isOpen}
                onClick={() => setVersion(subPrompt[0].SUBId)}
                index={i}
              />
            ))}
            {subid === '1' && (
              <VersionPreview
                id="generating"
                isActive={false}
                isOpen={isOpen}
                onClick={() => setVersion('0')}
                index={subPrompts.length}
                loading={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
