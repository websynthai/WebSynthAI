export const timeAgo = (date: Date): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);

  // Convert to the appropriate unit and return formatted string
  if (diffInSec < 60) {
    return rtf.format(-diffInSec, 'second');
  }
  if (diffInSec < 3600) {
    return rtf.format(-Math.floor(diffInSec / 60), 'minute');
  }
  if (diffInSec < 86400) {
    return rtf.format(-Math.floor(diffInSec / 3600), 'hour');
  }
  return rtf.format(-Math.floor(diffInSec / 86400), 'day');
};
