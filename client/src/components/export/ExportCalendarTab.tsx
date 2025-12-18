import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  FileText,
  CalendarIcon,
  FileSpreadsheet,
  Download,
  CalendarDays,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { ExportCalendarOptions } from '@/types/export';
import { exportToCSV, exportToICal } from '@/lib/exportUtils';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface ExportCalendarTabProps {
  events: CalendarEvent[];
  onExport: () => void;
  isExporting: boolean;
}

export function ExportCalendarTab({ events, onExport, isExporting }: ExportCalendarTabProps) {
  const [options, setOptions] = useState<ExportCalendarOptions>({
    format: 'ical',
    dateRange: { start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    includeImages: false,
    design: 'simple',
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Calendar', icon: FileText, description: 'Printable calendar view' },
    { value: 'ical', label: 'iCal (.ics)', icon: CalendarDays, description: 'Import to any calendar app' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Spreadsheet format' },
  ];

  const getEventsInRange = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= options.dateRange.start && eventDate <= options.dateRange.end;
    });
  };

  const handleExport = () => {
    const eventsToExport = getEventsInRange();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `modesta-calendar-${timestamp}`;

    if (options.format === 'ical') {
      exportToICal(eventsToExport, filename);
    } else if (options.format === 'csv') {
      const csvData = eventsToExport.map(event => ({
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        title: event.title,
        notes: event.notes || '',
      }));
      exportToCSV(csvData, filename);
    }
    
    onExport();
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Export Format</Label>
        <div className="grid grid-cols-3 gap-3">
          {formatOptions.map((formatOption) => (
            <motion.button
              key={formatOption.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOptions({ ...options, format: formatOption.value as ExportCalendarOptions['format'] })}
              className={`p-4 rounded-xl border-2 transition-all ${
                options.format === formatOption.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <formatOption.icon className={`w-6 h-6 mx-auto mb-2 ${
                options.format === formatOption.value ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className="font-medium text-sm">{formatOption.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatOption.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Date Range</Label>
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(options.dateRange.start, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={options.dateRange.start}
                onSelect={(date) => date && setOptions({
                  ...options,
                  dateRange: { ...options.dateRange, start: date }
                })}
              />
            </PopoverContent>
          </Popover>
          <span className="self-center text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(options.dateRange.end, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={options.dateRange.end}
                onSelect={(date) => date && setOptions({
                  ...options,
                  dateRange: { ...options.dateRange, end: date }
                })}
              />
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-sm text-muted-foreground">
          {getEventsInRange().length} events in selected range
        </p>
      </div>

      {/* Design Style (for PDF) */}
      {options.format === 'pdf' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Design Style</Label>
          <RadioGroup
            value={options.design}
            onValueChange={(v) => setOptions({ ...options, design: v as ExportCalendarOptions['design'] })}
            className="grid grid-cols-2 gap-3"
          >
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              options.design === 'simple' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="simple" id="design-simple" />
                <div>
                  <Label htmlFor="design-simple" className="cursor-pointer font-medium">Simple</Label>
                  <p className="text-xs text-muted-foreground">Clean, minimal design</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              options.design === 'detailed' ? 'border-primary bg-primary/5' : 'border-border'
            }`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="detailed" id="design-detailed" />
                <div>
                  <Label htmlFor="design-detailed" className="cursor-pointer font-medium">Detailed</Label>
                  <p className="text-xs text-muted-foreground">With outfit previews</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Include Images */}
      {options.format === 'pdf' && (
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label className="font-medium">Include Outfit Images</Label>
            <p className="text-sm text-muted-foreground">Add outfit previews to calendar</p>
          </div>
          <Switch
            checked={options.includeImages}
            onCheckedChange={(checked) => setOptions({ ...options, includeImages: checked })}
          />
        </div>
      )}

      {/* Export Button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleExport}
          disabled={isExporting || getEventsInRange().length === 0}
          className="w-full gradient-rose text-primary-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Calendar ({getEventsInRange().length} events)
        </Button>
      </div>
    </div>
  );
}
