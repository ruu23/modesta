import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, FileSpreadsheet, FileJson, Download, Eye } from 'lucide-react';
import { ClosetItem } from '@/types/closet';
import { ExportClosetOptions } from '@/types/export';
import { exportToCSV, exportToJSON, formatClosetItemsForExport } from '@/lib/exportUtils';

interface ExportClosetTabProps {
  items: ClosetItem[];
  selectedItems: string[];
  onExport: () => void;
  isExporting: boolean;
}

export function ExportClosetTab({
  items,
  selectedItems,
  onExport,
  isExporting,
}: ExportClosetTabProps) {
  const [options, setOptions] = useState<ExportClosetOptions>({
    format: 'csv',
    include: 'all',
    details: 'full',
    includeImages: false,
  });

  const [showPreview, setShowPreview] = useState(false);

  const getItemCount = () => {
    switch (options.include) {
      case 'selected':
        return selectedItems.length;
      case 'filtered':
        return items.length;
      default:
        return items.length;
    }
  };

  const getItemsToExport = () => {
    switch (options.include) {
      case 'selected':
        return items.filter(item => selectedItems.includes(item.id));
      default:
        return items;
    }
  };

  const handleExport = () => {
    const exportItems = getItemsToExport();
    const formattedData = formatClosetItemsForExport(exportItems, options.details);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `modesta-closet-${timestamp}`;
    
    if (options.format === 'csv') {
      exportToCSV(formattedData, filename);
    } else if (options.format === 'json') {
      exportToJSON(exportItems, filename);
    }
    
    onExport();
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Print-ready document' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Spreadsheet format' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'Data backup' },
  ];

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Export Format</Label>
        <div className="grid grid-cols-3 gap-3">
          {formatOptions.map((format) => (
            <motion.button
              key={format.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOptions({ ...options, format: format.value as ExportClosetOptions['format'] })}
              className={`p-4 rounded-xl border-2 transition-all ${
                options.format === format.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <format.icon className={`w-6 h-6 mx-auto mb-2 ${
                options.format === format.value ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className="font-medium text-sm">{format.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Include Options */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Include Items</Label>
        <RadioGroup
          value={options.include}
          onValueChange={(v) => setOptions({ ...options, include: v as ExportClosetOptions['include'] })}
          className="space-y-2"
        >
          <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="all" id="include-all" />
              <Label htmlFor="include-all" className="cursor-pointer">All Items</Label>
            </div>
            <Badge variant="secondary">{items.length} items</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="selected" id="include-selected" />
              <Label htmlFor="include-selected" className="cursor-pointer">Selected Items</Label>
            </div>
            <Badge variant="secondary">{selectedItems.length} items</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="filtered" id="include-filtered" />
              <Label htmlFor="include-filtered" className="cursor-pointer">Currently Filtered</Label>
            </div>
            <Badge variant="secondary">{items.length} items</Badge>
          </div>
        </RadioGroup>
      </div>

      {/* Detail Level */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Detail Level</Label>
        <RadioGroup
          value={options.details}
          onValueChange={(v) => setOptions({ ...options, details: v as ExportClosetOptions['details'] })}
          className="grid grid-cols-2 gap-3"
        >
          <div className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
            options.details === 'full' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="full" id="details-full" />
              <div>
                <Label htmlFor="details-full" className="cursor-pointer font-medium">Full Details</Label>
                <p className="text-xs text-muted-foreground">All item properties</p>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
            options.details === 'summary' ? 'border-primary bg-primary/5' : 'border-border'
          }`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="summary" id="details-summary" />
              <div>
                <Label htmlFor="details-summary" className="cursor-pointer font-medium">Summary</Label>
                <p className="text-xs text-muted-foreground">Name, brand, category</p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Include Images */}
      {options.format === 'pdf' && (
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <Label className="font-medium">Include Images</Label>
            <p className="text-sm text-muted-foreground">Add item photos to export</p>
          </div>
          <Switch
            checked={options.includeImages}
            onCheckedChange={(checked) => setOptions({ ...options, includeImages: checked })}
          />
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <h4 className="font-medium mb-2">Preview ({getItemCount()} items)</h4>
          <div className="text-sm text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
            {getItemsToExport().slice(0, 5).map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.brand}</span>
              </div>
            ))}
            {getItemCount() > 5 && (
              <p className="text-center pt-2">...and {getItemCount() - 5} more</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide Preview' : 'Preview'}
        </Button>
        <Button
          onClick={handleExport}
          disabled={isExporting || getItemCount() === 0}
          className="flex-1 gradient-rose text-primary-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          Export {getItemCount()} Items
        </Button>
      </div>
    </div>
  );
}
