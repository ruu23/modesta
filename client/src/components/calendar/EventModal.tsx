import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Shirt, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarEvent, EventType, EVENT_TYPES } from '@/types/calendar';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  initialDate?: Date;
  editEvent?: CalendarEvent | null;
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
  editEvent,
}: EventModalProps) {
  const [title, setTitle] = useState(editEvent?.title || '');
  const [date, setDate] = useState(editEvent?.date || (initialDate ? format(initialDate, 'yyyy-MM-dd') : ''));
  const [time, setTime] = useState(editEvent?.time || '09:00');
  const [endTime, setEndTime] = useState(editEvent?.endTime || '');
  const [type, setType] = useState<EventType>(editEvent?.type || 'casual');
  const [location, setLocation] = useState(editEvent?.location || '');
  const [dressCode, setDressCode] = useState(editEvent?.dressCode || '');
  const [reminder, setReminder] = useState(editEvent?.reminder || '1-hour');
  const [notes, setNotes] = useState(editEvent?.notes || '');

  const handleSave = () => {
    if (!title || !date) return;

    onSave({
      title,
      date,
      time,
      endTime: endTime || undefined,
      type,
      location: location || undefined,
      dressCode: dressCode || undefined,
      reminder,
      notes: notes || undefined,
    });

    // Reset form
    setTitle('');
    setDate('');
    setTime('09:00');
    setEndTime('');
    setType('casual');
    setLocation('');
    setDressCode('');
    setReminder('1-hour');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Event Name *</Label>
            <Input
              id="title"
              placeholder="e.g., Team Meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Label htmlFor="date">Date *</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="time">Start Time</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Event Type */}
          <div>
            <Label>Event Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as EventType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(({ value, label, icon }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Office, Restaurant name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Dress Code */}
          <div>
            <Label htmlFor="dressCode">Dress Code Notes</Label>
            <div className="relative mt-1">
              <Shirt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="dressCode"
                placeholder="e.g., Business casual, Formal"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Reminder */}
          <div>
            <Label>Reminder</Label>
            <Select value={reminder} onValueChange={setReminder}>
              <SelectTrigger className="mt-1">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No reminder</SelectItem>
                <SelectItem value="15-min">15 minutes before</SelectItem>
                <SelectItem value="1-hour">1 hour before</SelectItem>
                <SelectItem value="1-day">1 day before</SelectItem>
                <SelectItem value="1-week">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 gradient-rose text-primary-foreground border-0"
            onClick={handleSave}
            disabled={!title || !date}
          >
            {editEvent ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
