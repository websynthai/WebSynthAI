'use client';

import { getUIs } from '@/actions/ui/get-uis';
import ProjectCard from '@/components/project-card';
import LoadingSkeleton from '@/components/project-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import type { UI } from '@/types/user';
import { Box, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const ExplorePage = () => {
  const [mode, setMode] = useState<string>('latest');
  const [timeRange, setTimeRange] = useState<string>('all');
  const [uis, setUis] = useState<UI[]>([]);
  const [start, setStart] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [maxReached, setMaxReached] = useState(false);
  const limit = 9;
  const router = useRouter();

  const fetchUIs = async () => {
    setIsLoading(true);
    const fetchedUIs = await getUIs(mode, start, limit, timeRange);
    if (fetchedUIs.length === 0) {
      setMaxReached(true);
    }
    if (start === 0) {
      setUis(fetchedUIs);
    } else {
      setUis((prevUis) => [...prevUis, ...fetchedUIs]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUIs();
  }, [mode, start, timeRange]);

  const resetAndUpdate =
    (updateFn: (value: string) => void) => (value: string) => {
      setMaxReached(false);
      setUis([]);
      setStart(0);
      updateFn(value);
    };

  const handleTabChange = resetAndUpdate(setMode);
  const handleTimeRangeChange = resetAndUpdate(setTimeRange);

  const handleLoadMore = useCallback(() => {
    if (!maxReached) {
      setStart((prevStart) => prevStart + limit);
    }
  }, [maxReached]);

  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      if (bottom && !isLoading) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore, isLoading]);

  const EmptyState = ({ type }: { type: 'no-results' | 'no-projects' }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {type === 'no-results' ? (
        <>
          <SearchX className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No results found
          </h3>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            We couldn't find any projects matching your current filters. Try
            adjusting your search criteria or check back later for new content.
          </p>
        </>
      ) : (
        <>
          <Box className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No projects yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-[500px]">
            Be the first to create and share your UI projects with the
            community.
          </p>
        </>
      )}
    </div>
  );

  const TimeRangeSelect = () =>
    mode !== 'latest' && (
      <Select onValueChange={handleTimeRangeChange} defaultValue={timeRange}>
        <SelectTrigger className="w-[140px] md:w-[180px] h-9 rounded-lg bg-background dark:bg-background border-border dark:border-border focus-visible:ring-primary/20 dark:focus-visible:ring-primary/20">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1h">Last 1 Hour</SelectItem>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">This Week</SelectItem>
          <SelectItem value="30d">This Month</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
          <LoadingSkeleton />
        </div>
      );
    }

    if (!uis || uis.length === 0) {
      return (
        <EmptyState
          type={
            timeRange !== 'all' || mode !== 'latest'
              ? 'no-results'
              : 'no-projects'
          }
        />
      );
    }

    return (
      <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
        {uis.map((ui) => (
          <ProjectCard
            key={ui.id}
            ui={ui}
            onClick={() => router.push(`ui/${ui.id}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="container mx-auto p-4">
        <Tabs
          defaultValue={mode}
          className="w-full space-y-6"
          onValueChange={handleTabChange}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground">
              Explore
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <TabsList className="h-9 bg-muted/60 dark:bg-muted/60 backdrop-blur-sm rounded-lg p-1 flex-1 sm:flex-initial">
                {['latest', 'most_viewed', 'most_liked'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="relative h-7 rounded-md px-3 text-sm font-medium transition-all
                    disabled:pointer-events-none disabled:opacity-50
                    data-[state=active]:bg-background dark:data-[state=active]:bg-background
                    data-[state=active]:text-foreground dark:data-[state=active]:text-foreground
                    data-[state=active]:shadow-sm"
                  >
                    {tab
                      .split('_')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TimeRangeSelect />
            </div>
          </div>

          <TabsContent value={mode} className="mt-0 relative min-h-[300px]">
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExplorePage;
