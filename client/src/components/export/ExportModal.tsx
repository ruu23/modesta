import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shirt,
  Palette,
  CalendarDays,
  Database,
  Share2,
  CheckCircle2,
  Download,
  HelpCircle,
} from 'lucide-react';
import { ExportTab } from '@/types/export';
import { ClosetItem } from '@/types/closet';
import { CalendarEvent } from '@/types/calendar';
import { ExportClosetTab } from './ExportClosetTab';
import { ExportOutfitsTab } from './ExportOutfitsTab';
import { ExportCalendarTab } from './ExportCalendarTab';
import { ExportDataTab } from './ExportDataTab';
import { ExportShareTab } from './ExportShareTab';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  closetItems?: ClosetItem[];
  selectedItems?: string[];
  calendarEvents?: CalendarEvent[];
}

export function ExportModal({
  isOpen,
  onClose,
  closetItems = [],
  selectedItems = [],
  calendarEvents = [],
}: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>('closet');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleExportStart = useCallback(() => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          setTimeout(() => setExportComplete(false), 3000);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  }, []);

  const handleClose = useCallback(() => {
    setIsExporting(false);
    setExportProgress(0);
    setExportComplete(false);
    onClose();
  }, [onClose]);

  const tabs = [
    { id: 'closet' as const, label: 'Closet', icon: Shirt },
    { id: 'outfits' as const, label: 'Outfits', icon: Palette },
    { id: 'calendar' as const, label: 'Calendar', icon: CalendarDays },
    { id: 'data' as const, label: 'Data', icon: Database },
    { id: 'share' as const, label: 'Share', icon: Share2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Export & Share
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-muted-foreground"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Help
            </Button>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/50 rounded-lg p-4 text-sm space-y-2"
            >
              <h4 className="font-medium">What can you do with exports?</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>PDF:</strong> Print or share your wardrobe professionally</li>
                <li><strong>CSV:</strong> Open in Excel or Google Sheets for analysis</li>
                <li><strong>JSON:</strong> Backup your data or transfer to another app</li>
                <li><strong>iCal:</strong> Sync outfit plans with your calendar app</li>
                <li><strong>Share Link:</strong> Let others view your outfit inspirations</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Progress */}
        <AnimatePresence>
          {isExporting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Preparing your export...</span>
                <span className="font-medium">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {exportComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">Export Complete!</p>
                <p className="text-sm text-muted-foreground">Your file has been downloaded.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExportTab)} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="closet" className="m-0">
              <ExportClosetTab
                items={closetItems}
                selectedItems={selectedItems}
                onExport={handleExportStart}
                isExporting={isExporting}
              />
            </TabsContent>

            <TabsContent value="outfits" className="m-0">
              <ExportOutfitsTab
                onExport={handleExportStart}
                isExporting={isExporting}
              />
            </TabsContent>

            <TabsContent value="calendar" className="m-0">
              <ExportCalendarTab
                events={calendarEvents}
                onExport={handleExportStart}
                isExporting={isExporting}
              />
            </TabsContent>

            <TabsContent value="data" className="m-0">
              <ExportDataTab
                onExport={handleExportStart}
                isExporting={isExporting}
              />
            </TabsContent>

            <TabsContent value="share" className="m-0">
              <ExportShareTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
