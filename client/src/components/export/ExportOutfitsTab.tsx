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
  Image,
  FileJson,
  Download,
  LayoutGrid,
  List,
  CreditCard,
  CalendarIcon,
  Sparkles,
} from 'lucide-react';
import { ExportOutfitsOptions } from '@/types/export';
import { format } from 'date-fns';

interface ExportOutfitsTabProps {
  onExport: () => void;
  isExporting: boolean;
}

export function ExportOutfitsTab({ onExport, isExporting }: ExportOutfitsTabProps) {
  const [options, setOptions] = useState<ExportOutfitsOptions>({
    format: 'pdf',
    layout: 'grid',
    include: 'all',
    quality: 'high',
    watermark: true,
  });

  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const formatOptions = [
    { value: 'pdf', label: 'PDF Portfolio', icon: FileText, description: 'Professional lookbook' },
    { value: 'images', label: 'Images', icon: Image, description: 'Individual outfit images' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'Data export' },
  ];

  const layoutOptions = [
    { value: 'grid', label: 'Grid', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: List },
    { value: 'cards', label: 'Cards', icon: CreditCard },
  ];

  const qualityOptions = [
    { value: 'high', label: 'High', description: 'Best quality, larger file' },
    { value: 'medium', label: 'Medium', description: 'Balanced quality & size' },
    { value: 'low', label: 'Low', description: 'Smaller file, quick share' },
  ];

  const handleExport = () => {
    // Mock export - in real app would generate actual files
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
              onClick={() => setOptions({ ...options, format: formatOption.value as ExportOutfitsOptions['format'] })}
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

      {/* Layout (for PDF/Images) */}
      {options.format !== 'json' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Layout Style</Label>
          <div className="flex gap-2">
            {layoutOptions.map((layout) => (
              <Button
                key={layout.value}
                variant={options.layout === layout.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOptions({ ...options, layout: layout.value as ExportOutfitsOptions['layout'] })}
                className="flex-1"
              >
                <layout.icon className="w-4 h-4 mr-2" />
                {layout.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Include Options */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Include Outfits</Label>
        <RadioGroup
          value={options.include}
          onValueChange={(v) => setOptions({ ...options, include: v as ExportOutfitsOptions['include'] })}
          className="space-y-2"
        >
          <div className={`p-3 rounded-lg border-2 transition-colors ${
            options.include === 'all' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="all" id="outfits-all" />
              <Label htmlFor="outfits-all" className="cursor-pointer">All Outfits</Label>
            </div>
          </div>
          <div className={`p-3 rounded-lg border-2 transition-colors ${
            options.include === 'favorites' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="favorites" id="outfits-favorites" />
              <Label htmlFor="outfits-favorites" className="cursor-pointer flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Favorites Only
              </Label>
            </div>
          </div>
          <div className={`p-3 rounded-lg border-2 transition-colors ${
            options.include === 'dateRange' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="dateRange" id="outfits-range" />
                <Label htmlFor="outfits-range" className="cursor-pointer">Date Range</Label>
              </div>
              {options.include === 'dateRange' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange.start ? format(dateRange.start, 'MMM d') : 'Select'} 
                      {dateRange.end ? ` - ${format(dateRange.end, 'MMM d')}` : ''}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.start, to: dateRange.end }}
                      onSelect={(range) => setDateRange({ start: range?.from, end: range?.to })}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Quality (for images) */}
      {options.format !== 'json' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Quality</Label>
          <div className="grid grid-cols-3 gap-2">
            {qualityOptions.map((quality) => (
              <Button
                key={quality.value}
                variant={options.quality === quality.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOptions({ ...options, quality: quality.value as ExportOutfitsOptions['quality'] })}
                className="flex-col h-auto py-3"
              >
                <span className="font-medium">{quality.label}</span>
                <span className="text-xs opacity-70">{quality.description}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Watermark */}
      {options.format !== 'json' && (
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label className="font-medium">Add Watermark</Label>
            <p className="text-sm text-muted-foreground">Include Modesta branding</p>
          </div>
          <Switch
            checked={options.watermark}
            onCheckedChange={(checked) => setOptions({ ...options, watermark: checked })}
          />
        </div>
      )}

      {/* Export Button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full gradient-rose text-primary-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Outfits
        </Button>
      </div>
    </div>
  );
}
