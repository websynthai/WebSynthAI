import { createUI } from '@/actions/ui/create-ui';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useUIState } from '@/hooks/useUIState';
import { MoveUpRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from './ui';

const DEFAULT_SUGGESTIONS = [
  'Login page for netflix',
  'Product detail card for sneakers',
  'Ecommerce checkout page',
  'Dashboard for sales data',
  'Instagram app UI clone',
];

const Suggestions = () => {
  const router = useRouter();
  const { setLoading, setInput, uiType } = useUIState();
  const { toggle } = useAuthModal();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/suggestions?modelId=${encodeURIComponent(
            'google:gemini-2.0-flash-exp',
          )}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  const handleClick = async (suggestion: string) => {
    setInput(suggestion);
    try {
      if (status === 'authenticated') {
        if (!userId) {
          toggle();
          return;
        }
        setLoading(true);
        const ui = await createUI(suggestion, userId, uiType);
        if (!ui) {
          throw new Error('Failed to create UI');
        }
        router.push(`/ui/${ui.id}`);
      } else {
        toggle();
      }
    } catch (error) {
      console.error('Error in handleClick:', error);
      toast.error(
        `Failed to create UI: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-wrap gap-2 w-[80vw] justify-center">
      {suggestions.map((suggestion, index) => (
        <Badge
          onClick={() => handleClick(suggestion)}
          variant="secondary"
          key={index}
          className="p-1 rounded-md cursor-pointer flex items-center justify-between whitespace-nowrap shrink-0"
        >
          <span className="mr-1">{suggestion}</span>
          <MoveUpRight size={14} />
        </Badge>
      ))}
    </div>
  );
};

export default Suggestions;
