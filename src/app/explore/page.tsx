'use client';

import { getUIs } from '@/actions/ui/get-uis';
import { EmptyState } from '@/components/explore/empty-state';
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
import { ITEMS_PER_PAGE, TAB_OPTIONS, TIME_RANGES } from '@/constants';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { UI } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ExplorePage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    mode: 'latest',
    timeRange: 'all',
  });
  const [state, setState] = useState({
    uis: [] as UI[],
    start: 0,
    isLoading: true,
    maxReached: false,
  });

  const fetchUIs = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const fetchedUIs = await getUIs(
      filters.mode,
      state.start,
      ITEMS_PER_PAGE,
      filters.timeRange,
    );

    setState((prev) => ({
      ...prev,
      uis: prev.start === 0 ? fetchedUIs : [...prev.uis, ...fetchedUIs],
      isLoading: false,
      maxReached: fetchedUIs.length === 0,
    }));
  };

  useEffect(() => {
    fetchUIs();
  }, [filters.mode, filters.timeRange, state.start]);

  const resetAndUpdate = (key: keyof typeof filters) => (value: string) => {
    setState({
      uis: [],
      start: 0,
      isLoading: false,
      maxReached: false,
    });
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = () => {
    if (!state.maxReached) {
      setState((prev) => ({ ...prev, start: prev.start + ITEMS_PER_PAGE }));
    }
  };

  useInfiniteScroll(handleLoadMore, state.isLoading, state.maxReached);

  const TimeRangeSelect = () =>
    filters.mode !== 'latest' && (
      <Select
        onValueChange={resetAndUpdate('timeRange')}
        defaultValue={filters.timeRange}
      >
        <SelectTrigger className="w-[140px] md:w-[180px] h-9 rounded-lg bg-background dark:bg-background border-border dark:border-border focus-visible:ring-primary/20 dark:focus-visible:ring-primary/20">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          {TIME_RANGES.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

  const renderContent = () => {
    if (state.isLoading && state.uis.length === 0) {
      return (
        <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
          <LoadingSkeleton />
        </div>
      );
    }

    if (!state.uis || state.uis.length === 0) {
      return (
        <EmptyState
          type={
            filters.timeRange !== 'all' || filters.mode !== 'latest'
              ? 'no-results'
              : 'no-projects'
          }
        />
      );
    }

    return (
      <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
        {state.uis.map((ui) => (
          <ProjectCard
            key={ui.id}
            ui={ui}
            onClick={() => router.push(`ui/${ui.id}`)}
          />
        ))}
        {state.isLoading && <LoadingSkeleton />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="container mx-auto p-4">
        <Tabs
          defaultValue={filters.mode}
          className="w-full space-y-6"
          onValueChange={resetAndUpdate('mode')}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground">
              Explore
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <TabsList className="h-9 bg-muted/60 dark:bg-muted/60 backdrop-blur-sm rounded-lg p-1 flex-1 sm:flex-initial">
                {TAB_OPTIONS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative h-7 rounded-md px-3 text-sm font-medium transition-all
                    disabled:pointer-events-none disabled:opacity-50
                    data-[state=active]:bg-background dark:data-[state=active]:bg-background
                    data-[state=active]:text-foreground dark:data-[state=active]:text-foreground
                    data-[state=active]:shadow-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TimeRangeSelect />
            </div>
          </div>

          <TabsContent
            value={filters.mode}
            className="mt-0 relative min-h-[300px]"
          >
            {renderContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExplorePage;
