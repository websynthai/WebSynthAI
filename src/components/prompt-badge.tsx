import React from 'react';
import { toast } from 'sonner';
import { Badge } from './ui';

const PromptBadge = ({
  className,
  variant,
  prompt,
}: {
  className: string;
  variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | null
    | undefined;
  prompt: string;
}) => {
  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.info('Prompt copied to clipboard');
  };

  return (
    <Badge variant={variant} className={className} onClick={() => copyPrompt()}>
      <span className="truncate mr-1">{prompt}</span>
    </Badge>
  );
};

export default PromptBadge;
