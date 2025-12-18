export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  type: EventType;
  location?: string;
  dressCode?: string;
  outfitId?: string;
  outfitName?: string;
  outfitImage?: string;
  reminder?: string;
  notes?: string;
}

export type EventType = 
  | 'work'
  | 'wedding'
  | 'casual'
  | 'formal'
  | 'party'
  | 'date'
  | 'interview'
  | 'religious'
  | 'travel'
  | 'other';

export const EVENT_TYPES: { value: EventType; label: string; color: string; icon: string }[] = [
  { value: 'work', label: 'Work', color: '#3b82f6', icon: '💼' },
  { value: 'wedding', label: 'Wedding', color: '#ec4899', icon: '💒' },
  { value: 'casual', label: 'Casual', color: '#22c55e', icon: '☕' },
  { value: 'formal', label: 'Formal', color: '#8b5cf6', icon: '🎩' },
  { value: 'party', label: 'Party', color: '#f59e0b', icon: '🎉' },
  { value: 'date', label: 'Date Night', color: '#ef4444', icon: '❤️' },
  { value: 'interview', label: 'Interview', color: '#06b6d4', icon: '🎯' },
  { value: 'religious', label: 'Religious', color: '#14b8a6', icon: '🕌' },
  { value: 'travel', label: 'Travel', color: '#f97316', icon: '✈️' },
  { value: 'other', label: 'Other', color: '#6b7280', icon: '📅' },
];

export interface DayWeather {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  icon: string;
}

export type CalendarView = 'month' | 'week' | 'day';
