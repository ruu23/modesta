import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/types/calendar';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const getTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-background">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrev}>
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext}>
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </Button>
        </div>
        
        <h2 className="text-xl tracking-wide">{getTitle()}</h2>
        
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
      </div>

      <div className="flex items-center border border-border">
        {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors capitalize ${
              view === v
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}