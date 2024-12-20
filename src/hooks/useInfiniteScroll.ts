import { useCallback, useEffect } from 'react';

export const useInfiniteScroll = (
  onLoadMore: () => void,
  isLoading: boolean,
  disabled: boolean,
) => {
  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100;

    if (bottom && !isLoading && !disabled) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, disabled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};
