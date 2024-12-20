import { Box, SearchX } from 'lucide-react';

type EmptyStateProps = {
  type: 'no-results' | 'no-projects';
};

export const EmptyState = ({ type }: EmptyStateProps) => (
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
          Be the first to create and share your UI projects with the community.
        </p>
      </>
    )}
  </div>
);
