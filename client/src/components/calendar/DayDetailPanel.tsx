import { X, Sparkles, MapPin, Clock, Shirt, Pencil, Trash2, Calendar, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { CalendarEvent, DayWeather, EVENT_TYPES } from '@/types/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DayDetailPanelProps {
  date: Date;
  events: CalendarEvent[];
  weather: DayWeather;
  onClose: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddEvent: () => void;
  onAssignOutfit: (eventId: string) => void;
}

export function DayDetailPanel({
  date,
  events,
  weather,
  onClose,
  onEditEvent,
  onDeleteEvent,
  onAddEvent,
  onAssignOutfit,
}: DayDetailPanelProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');

  const getEventType = (type: CalendarEvent['type']) => {
    return EVENT_TYPES.find(t => t.value === type);
  };

  const handleAISuggest = () => {
    toast({
      title: 'AI Suggestion',
      description: 'Analyzing your wardrobe and weather conditions...',
    });
  };

  return (
    <div className="w-80 h-full flex flex-col bg-card border-l border-border animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-foreground">
            {format(date, 'EEEE, MMM d')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Weather */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
          <span className="text-3xl">{weather.icon}</span>
          <div>
            <p className="font-medium text-foreground">{weather.temp}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{weather.condition}</p>
          </div>
        </div>
      </div>

      {/* Events */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Add Event Button */}
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={onAddEvent}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add Event
          </Button>

          {/* AI Suggest Button */}
          <Button
            variant="outline"
            className="w-full bg-accent/50 border-accent hover:bg-accent"
            onClick={handleAISuggest}
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            AI Suggest Outfit
          </Button>

          {/* Events List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Events ({events.length})</h3>
            
            {events.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No events for this day
              </div>
            ) : (
              events.map(event => {
                const eventType = getEventType(event.type);
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{eventType?.icon}</span>
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                      </div>
                      <Badge
                        style={{ backgroundColor: `${eventType?.color}20`, color: eventType?.color }}
                        className="border-0"
                      >
                        {eventType?.label}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}{event.endTime && ` - ${event.endTime}`}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.dressCode && (
                        <div className="flex items-center gap-2">
                          <Shirt className="w-3.5 h-3.5" />
                          <span>{event.dressCode}</span>
                        </div>
                      )}
                    </div>

                    {/* Outfit Section */}
                    <div className="mt-3 pt-3 border-t border-border">
                      {event.outfitImage ? (
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden">
                            <img src={event.outfitImage} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{event.outfitName}</p>
                            <button
                              onClick={() => onAssignOutfit(event.id)}
                              className="text-xs text-primary hover:underline"
                            >
                              Change Outfit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => onAssignOutfit(event.id)}
                        >
                          <Shirt className="w-3.5 h-3.5 mr-2" />
                          Assign Outfit
                        </Button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => onEditEvent(event)}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <StickyNote className="w-4 h-4" />
              Notes
            </div>
            <Textarea
              placeholder="Add notes for this day..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-muted border-0 resize-none"
              rows={3}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
