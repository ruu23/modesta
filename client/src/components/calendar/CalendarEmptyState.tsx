import { Plus, CalendarPlus } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { CalendarIllustration } from '@/components/ui/Illustrations';

interface CalendarEmptyStateProps {
  onAddEvent: () => void;
}

export function CalendarEmptyState({ onAddEvent }: CalendarEmptyStateProps) {
  return (
    <EmptyState
      illustration={<CalendarIllustration />}
      title="No events planned"
      description="Start planning your outfits by adding events to your calendar. Never worry about what to wear again!"
      action={{
        label: 'Add First Event',
        onClick: onAddEvent,
        icon: <CalendarPlus className="w-4 h-4 mr-2" />,
      }}
    />
  );
}
