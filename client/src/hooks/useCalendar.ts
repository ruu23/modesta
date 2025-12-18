import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarEvent, DayWeather, CalendarView } from '@/types/calendar';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
  isSameMonth,
  isToday,
  isPast
} from 'date-fns';

const STORAGE_KEY = 'fashion-calendar-events';

const generateId = () => crypto.randomUUID();

// Mock weather data
const getWeatherForDate = (date: Date): DayWeather => {
  const conditions: DayWeather['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
  const icons: Record<DayWeather['condition'], string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨',
  };
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const condition = conditions[dayOfYear % conditions.length];
  const baseTemp = 20 + Math.sin(dayOfYear / 30) * 15;
  return {
    temp: Math.round(baseTemp + (Math.random() * 10 - 5)),
    condition,
    icon: icons[condition],
  };
};

// Mock events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    endTime: '10:00',
    type: 'work',
    location: 'Office',
    outfitId: '1',
    outfitName: 'Professional Look',
    outfitImage: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    title: 'Coffee with Sara',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '14:00',
    type: 'casual',
    location: 'Starbucks Downtown',
  },
  {
    id: '3',
    title: 'Wedding Reception',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    time: '18:00',
    endTime: '23:00',
    type: 'wedding',
    location: 'Grand Ballroom',
    dressCode: 'Formal Evening Wear',
    outfitId: '2',
    outfitName: 'Elegant Evening',
    outfitImage: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    title: 'Job Interview',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    time: '11:00',
    type: 'interview',
    location: 'Tech Corp HQ',
    dressCode: 'Business Professional',
  },
];

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>('month');

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      setEvents(mockEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  // Get days for current view
  const days = useMemo(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else {
      return [currentDate];
    }
  }, [currentDate, view]);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  }, [events]);

  // Get weather for a date
  const getWeather = useCallback((date: Date): DayWeather => {
    return getWeatherForDate(date);
  }, []);

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }, [events]);

  // Navigation
  const navigateNext = useCallback(() => {
    if (view === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else if (view === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addDays(prev, 1));
    }
  }, [view]);

  const navigatePrev = useCallback(() => {
    if (view === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else if (view === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subDays(prev, 1));
    }
  }, [view]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  // CRUD operations
  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const assignOutfit = useCallback((eventId: string, outfit: { id: string; name: string; image: string }) => {
    updateEvent(eventId, {
      outfitId: outfit.id,
      outfitName: outfit.name,
      outfitImage: outfit.image,
    });
  }, [updateEvent]);

  const copyEventToDate = useCallback((eventId: string, newDate: Date) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const { id, ...eventData } = event;
      addEvent({ ...eventData, date: format(newDate, 'yyyy-MM-dd') });
    }
  }, [events, addEvent]);

  return {
    events,
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    days,
    getEventsForDate,
    getWeather,
    upcomingEvents,
    navigateNext,
    navigatePrev,
    goToToday,
    addEvent,
    updateEvent,
    deleteEvent,
    assignOutfit,
    copyEventToDate,
    isSameDay,
    isSameMonth: (date: Date) => isSameMonth(date, currentDate),
    isToday,
    isPast,
  };
}
