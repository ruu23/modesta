import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  User,
  Settings,
  Shirt,
  Palette,
  CalendarDays,
  Shield,
  FileJson,
  AlertCircle,
} from 'lucide-react';
import { ExportDataPackageOptions } from '@/types/export';
import { exportToJSON } from '@/lib/exportUtils';

interface ExportDataTabProps {
  onExport: () => void;
  isExporting: boolean;
}

export function ExportDataTab({ onExport, isExporting }: ExportDataTabProps) {
  const [options, setOptions] = useState<ExportDataPackageOptions>({
    includeProfile: true,
    includePreferences: true,
    includeItems: true,
    includeOutfits: true,
    includeCalendar: true,
  });

  const dataTypes = [
    {
      key: 'includeProfile' as const,
      label: 'Profile Data',
      icon: User,
      description: 'Your personal information and measurements',
      size: '~2 KB',
    },
    {
      key: 'includePreferences' as const,
      label: 'Preferences',
      icon: Settings,
      description: 'Style preferences and app settings',
      size: '~1 KB',
    },
    {
      key: 'includeItems' as const,
      label: 'Closet Items',
      icon: Shirt,
      description: 'All wardrobe items and metadata',
      size: '~50 KB',
    },
    {
      key: 'includeOutfits' as const,
      label: 'Saved Outfits',
      icon: Palette,
      description: 'Created outfit combinations',
      size: '~20 KB',
    },
    {
      key: 'includeCalendar' as const,
      label: 'Calendar Events',
      icon: CalendarDays,
      description: 'Outfit planning and events',
      size: '~10 KB',
    },
  ];

  const selectedCount = Object.values(options).filter(Boolean).length;

  const handleExport = () => {
    // Gather data from localStorage
    const exportData: Record<string, unknown> = {
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    if (options.includeProfile) {
      exportData.profile = JSON.parse(localStorage.getItem('modesta-profile') || '{}');
    }
    if (options.includePreferences) {
      exportData.preferences = JSON.parse(localStorage.getItem('modesta-settings') || '{}');
    }
    if (options.includeItems) {
      exportData.closetItems = JSON.parse(localStorage.getItem('modesta-closet') || '[]');
    }
    if (options.includeOutfits) {
      exportData.outfits = JSON.parse(localStorage.getItem('modesta-outfits') || '[]');
    }
    if (options.includeCalendar) {
      exportData.calendar = JSON.parse(localStorage.getItem('modesta-calendar') || '[]');
    }

    const timestamp = new Date().toISOString().split('T')[0];
    exportToJSON(exportData, `modesta-backup-${timestamp}`);
    
    onExport();
  };

  const toggleAll = (value: boolean) => {
    setOptions({
      includeProfile: value,
      includePreferences: value,
      includeItems: value,
      includeOutfits: value,
      includeCalendar: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileJson className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Complete Data Export</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download all your Modesta data as a JSON file. Perfect for backups or transferring to another account.
            </p>
          </div>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Select Data to Export</Label>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toggleAll(true)}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleAll(false)}>
            Clear
          </Button>
        </div>
      </div>

      {/* Data Type Selection */}
      <div className="space-y-3">
        {dataTypes.map((dataType) => (
          <motion.div
            key={dataType.key}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              options[dataType.key] ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  options[dataType.key] ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <dataType.icon className={`w-4 h-4 ${
                    options[dataType.key] ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="font-medium cursor-pointer">{dataType.label}</Label>
                    <Badge variant="secondary" className="text-xs">
                      {dataType.size}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{dataType.description}</p>
                </div>
              </div>
              <Switch
                checked={options[dataType.key]}
                onCheckedChange={(checked) => setOptions({ ...options, [dataType.key]: checked })}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-400">Privacy Notice</p>
          <p className="text-muted-foreground mt-1">
            Your exported data contains personal information. Keep it secure and only share with trusted services.
          </p>
        </div>
      </div>

      {/* Export Button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleExport}
          disabled={isExporting || selectedCount === 0}
          className="w-full gradient-rose text-primary-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data Package ({selectedCount} categories)
        </Button>
      </div>
    </div>
  );
}
