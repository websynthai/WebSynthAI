'use client';

import { createUI } from '@/actions/ui/create-ui';
import { Badge } from '@/components/ui/badge';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useUIState } from '@/hooks/useUIState';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const SUGGESTIONS_API_URL = '/api/suggestions';
const MODEL_ID = 'google:gemini-2.0-flash-exp';
const DEFAULT_SUGGESTIONS = [
  'Login page for netflix',
  'Product detail card for sneakers',
  'Ecommerce checkout page',
];

interface SuggestionProps {
  text: string;
  onClick: (suggestion: string) => void;
}

const SuggestionBadge = ({ text, onClick }: SuggestionProps) => (
  <Badge
    onClick={() => onClick(text)}
    variant="secondary"
    className="h-6 px-2 text-xs inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-full border bg-muted hover:bg-gray-100 transition-all font-medium gap-0.5 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
  >
    <span>{text}</span>
    <svg height="16" width="16" viewBox="0 0 16 16" className="text-current">
      <title>Move Up Right</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z"
        fill="currentColor"
      />
    </svg>
  </Badge>
);

const Suggestions = () => {
  const router = useRouter();
  const { setLoading, setInput, uiType } = useUIState();
  const { toggle: toggleAuth } = useAuthModal();
  const { data: session, status } = useSession();
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  const fetchSuggestions = useCallback(async () => {
    try {
      const url = `${SUGGESTIONS_API_URL}?modelId=${encodeURIComponent(
        MODEL_ID,
      )}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch suggestions: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions(DEFAULT_SUGGESTIONS);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSuggestionClick = async (suggestion: string) => {
    setInput(suggestion);

    if (status !== 'authenticated') {
      toggleAuth();
      return;
    }

    const userId = session?.user?.id;
    if (!userId) {
      toggleAuth();
      return;
    }

    try {
      setLoading(true);
      const ui = await createUI(suggestion, userId, uiType);

      if (!ui) {
        throw new Error('Failed to create UI');
      }

      router.push(`/ui/${ui.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error creating UI:', error);
      toast.error(`Failed to create UI: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-wrap gap-3 w-[80vw] justify-center p-4">
      {suggestions.map((suggestion, index) => (
        <SuggestionBadge
          key={`suggestion-${index}`}
          text={suggestion}
          onClick={handleSuggestionClick}
        />
      ))}
    </div>
  );
};

export default Suggestions;
