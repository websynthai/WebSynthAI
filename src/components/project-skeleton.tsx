const LoadingSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="space-y-4 w-full">
        <div className="group relative block aspect-preview w-full overflow-hidden rounded-lg border border-gray-200 bg-card animate-pulse">
          <span className="bg-opacity/80 md:text-xxs absolute right-2 top-2 z-10 rounded-sm bg-muted px-2 py-1 w-16 h-5" />
          <div className="w-full aspect-[4/3] bg-muted" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-muted rounded-full" />
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-muted px-3 py-1 h-7" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default LoadingSkeleton;
