import { toast } from 'sonner';
import { Badge } from './ui';

interface PromptBadgeProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  prompt: string;
}

const PromptBadge: React.FC<PromptBadgeProps> = ({
  className = '',
  variant = 'default',
  prompt,
}) => {
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copied to clipboard');
    } catch (_error) {
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <Badge variant={variant} className={className} onClick={copyPrompt}>
      <span className="truncate mr-1" title={prompt}>
        {prompt}
      </span>
    </Badge>
  );
};

export default PromptBadge;
