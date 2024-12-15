import { createUI } from '@/actions/ui/create-ui';
import { useUIState } from '@/hooks/useUIState';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseUIGeneratorProps {
  userId?: string;
  status: string;
  toggle: () => void;
}

export const useUIGenerator = ({
  userId,
  status,
  toggle,
}: UseUIGeneratorProps) => {
  const router = useRouter();
  const { input, loading, setLoading, uiType } = useUIState();

  const generateUI = async () => {
    if (!input) {
      toast.error('Please enter a message');
      return;
    }

    if (!(status === 'authenticated' && userId)) {
      toggle();
      return;
    }

    try {
      setLoading(true);
      const ui = await createUI(input, userId, uiType);
      router.push(`/ui/${ui.id}`);
      setLoading(false);
    } catch (_error) {
      toast.error('Failed to generate UI');
      setLoading(false);
    }
  };

  return {
    generateUI,
    loading,
  };
};
