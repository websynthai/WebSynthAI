export const ITEMS_PER_PAGE = 9;

export const TAB_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'most_viewed', label: 'Most Viewed' },
  { value: 'most_liked', label: 'Most Liked' },
] as const;

export const TIME_RANGES = [
  { value: '1h', label: 'Last 1 Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'This Week' },
  { value: '30d', label: 'This Month' },
  { value: 'all', label: 'All Time' },
] as const;
