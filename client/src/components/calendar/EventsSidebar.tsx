import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarEvent, EVENT_TYPES } from '@/types/calendar';
import { format, parseISO } from 'date-fns';

interface EventsSidebarProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function EventsSidebar({
  events,
  onAddEvent,
  onSelectEvent,
}: EventsSidebarProps) {
  const getEventType = (type: CalendarEvent['type']) => {
    return EVENT_TYPES.find(t => t.value === type);
  };

  return (
    <div className="w-72 h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-wider">Upcoming</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
        <Button onClick={onAddEvent} variant="gold" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="divider-gold w-12 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm tracking-wide">No upcoming events</p>
            </div>
          ) : (
            events.map(event => {
              const eventType = getEventType(event.type);
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="p-4 border border-border hover:border-gold cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-px h-full min-h-[48px] flex-shrink-0"
                      style={{ backgroundColor: eventType?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{eventType?.icon}</span>
                        <h3 className="font-medium text-sm truncate tracking-wide">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                        {format(parseISO(event.date), 'EEE, MMM d')} • {event.time}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground truncate">
                          {event.location}
                        </p>
                      )}
                      <div className="mt-2">
                        {event.outfitName ? (
                          <Badge variant="gold" className="text-[10px]">
                            Outfit Planned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            No Outfit
                          </Badge>
                        )}
                      </div>
                    </div>
                    {event.outfitImage && (
                      <div className="w-10 h-10 border border-border overflow-hidden flex-shrink-0">
                        <img src={event.outfitImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}