import { Plus } from 'lucide-react';
import { CalendarEvent, EVENT_TYPES, DayWeather } from '@/types/calendar';
import { format } from 'date-fns';

interface CalendarGridProps {
  days: Date[];
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  selectedDate: Date | null;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getWeather: (date: Date) => DayWeather;
  isSameMonth: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  isPast: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onAddEvent: (date: Date) => void;
}

export function CalendarGrid({
  days,
  view,
  currentDate,
  selectedDate,
  getEventsForDate,
  getWeather,
  isSameMonth,
  isToday,
  isPast,
  onSelectDate,
  onAddEvent,
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventColor = (type: CalendarEvent['type']) => {
    return EVENT_TYPES.find(t => t.value === type)?.color || '#6b7280';
  };

  if (view === 'day') {
    const dayEvents = getEventsForDate(days[0]);
    const weather = getWeather(days[0]);

    return (
      <div className="flex-1 p-8 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-headline">
                {format(days[0], 'EEEE, MMMM d')}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                <span>{weather.icon}</span>
                <span>{weather.temp}°C</span>
              </div>
            </div>
            <button
              onClick={() => onAddEvent(days[0])}
              className="btn-luxury-gold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>

          {dayEvents.length === 0 ? (
            <div className="text-center py-16 border border-border">
              <div className="divider-gold w-16 mx-auto mb-6" />
              <p className="text-muted-foreground tracking-wide">No events scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-6 border border-border hover:border-gold transition-colors cursor-pointer"
                  onClick={() => onSelectDate(days[0])}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-px h-16"
                      style={{ backgroundColor: getEventColor(event.type) }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium tracking-wide">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.time}{event.endTime && ` — ${event.endTime}`}
                      </p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      )}
                    </div>
                    {event.outfitImage && (
                      <div className="w-16 h-16 border border-border overflow-hidden">
                        <img src={event.outfitImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map(day => (
          <div key={day} className="px-2 py-4 text-center text-xs uppercase tracking-wider text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`flex-1 grid grid-cols-7 ${view === 'week' ? 'grid-rows-1' : ''}`}>
        {days.map((day, index) => {
          const events = getEventsForDate(day);
          const weather = getWeather(day);
          const isCurrentMonth = isSameMonth(day);
          const isTodayDate = isToday(day);
          const isPastDate = isPast(day) && !isTodayDate;
          const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const hasOutfit = events.some(e => e.outfitImage);

          return (
            <div
              key={index}
              onClick={() => onSelectDate(day)}
              className={`min-h-[120px] p-3 border-b border-r border-border cursor-pointer group transition-all hover:bg-muted/30 ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isPastDate ? 'opacity-50' : ''} ${
                isSelected ? 'bg-muted/50' : ''
              }`}
            >
              {/* Date header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 text-sm ${
                    isTodayDate
                      ? 'bg-gold text-black'
                      : ''
                  }`}
                >
                  {format(day, 'd')}
                </span>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{weather.icon}</span>
                  <span>{weather.temp}°</span>
                </div>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {events.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs truncate border-l-2"
                    style={{ borderLeftColor: getEventColor(event.type) }}
                  >
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{events.length - 2} more
                  </div>
                )}
              </div>

              {/* Outfit thumbnail */}
              {hasOutfit && (
                <div className="mt-2">
                  <div className="w-8 h-8 border border-gold overflow-hidden">
                    <img
                      src={events.find(e => e.outfitImage)?.outfitImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Add button on hover */}
              {events.length === 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(day);
                  }}
                  className="opacity-0 group-hover:opacity-100 mt-2 w-full py-1 text-xs text-muted-foreground hover:text-gold transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}