import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'default' | 'outline' | 'gold';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-8 text-center', className)}>
      {illustration && <div className="mb-10">{illustration}</div>}
      
      <h3 className="text-headline mb-4">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 tracking-wide">{description}</p>
      
      <div className="divider-gold w-16 mb-8" />
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick} variant={action.variant || 'gold'}>
            {action.icon}
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not complete your request.',
  onRetry,
  onGoBack,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-8 text-center', className)}>
      <div className="w-12 h-12 border border-destructive flex items-center justify-center mb-8">
        <span className="text-destructive text-xl">!</span>
      </div>
      <h3 className="text-headline mb-4">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 tracking-wide">{description}</p>
      <div className="flex gap-3">
        {onRetry && <Button variant="gold" onClick={onRetry}>Try Again</Button>}
        {onGoBack && <Button variant="outline" onClick={onGoBack}>Go Back</Button>}
      </div>
    </div>
  );
}

export function LoadingState({ message = 'Loading...', className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-8', className)}>
      <div className="w-8 h-8 border border-border border-t-gold animate-spin mb-8" />
      <p className="text-muted-foreground text-sm uppercase tracking-wider">{message}</p>
    </div>
  );
}