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

type Filters = {
  mode: string;
  timeRange: string;
};

type ExploreState = {
  uis: UI[];
  start: number;
  isLoading: boolean;
  maxReached: boolean;
};

const TimeRangeSelect = ({
  filters,
  onValueChange,
}: {
  filters: Filters;
  onValueChange: (value: string) => void;
}) => {
  if (filters.mode === 'latest') return null;

  return (
    <Select onValueChange={onValueChange} defaultValue={filters.timeRange}>
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
};

const ProjectGrid = ({
  uis,
  isLoading,
  onClick,
}: {
  uis: UI[];
  isLoading: boolean;
  onClick: (id: string) => void;
}) => (
  <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
    {uis.map((ui) => (
      <ProjectCard key={ui.id} ui={ui} onClick={() => onClick(ui.id)} />
    ))}
    {isLoading && <LoadingSkeleton />}
  </div>
);

const ExploreContent = ({
  isLoading,
  uis,
  filters,
  onProjectClick,
}: {
  isLoading: boolean;
  uis: UI[];
  filters: Filters;
  onProjectClick: (id: string) => void;
}) => {
  if (isLoading && uis.length === 0) {
    return (
      <div className="mx-auto grid w-full grid-cols-[repeat(auto-fit,_minmax(296px,1fr))] gap-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!uis.length) {
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
    <ProjectGrid uis={uis} isLoading={isLoading} onClick={onProjectClick} />
  );
};

const ExplorePage = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>({
    mode: 'latest',
    timeRange: 'all',
  });

  const [state, setState] = useState<ExploreState>({
    uis: [],
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

  const resetAndUpdate = (key: keyof Filters) => (value: string) => {
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
              <TimeRangeSelect
                filters={filters}
                onValueChange={resetAndUpdate('timeRange')}
              />
            </div>
          </div>

          <TabsContent
            value={filters.mode}
            className="mt-0 relative min-h-[300px]"
          >
            <ExploreContent
              isLoading={state.isLoading}
              uis={state.uis}
              filters={filters}
              onProjectClick={(id) => router.push(`ui/${id}`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExplorePage;
