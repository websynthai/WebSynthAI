export const timeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHr = Math.floor(diffInMin / 60);

  if (diffInSec < 60) {
    return `${diffInSec} sec ago`;
  }
  if (diffInMin < 60) {
    return `${diffInMin} min ago`;
  }
  if (diffInHr < 24) {
    return `${diffInHr} hr ago`;
  }
  return date.toLocaleDateString(); // Returns the date in the local format
};
