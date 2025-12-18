import { Trash2, FolderInput, Tag, Download, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onMove: () => void;
  onTag: () => void;
  onExport: () => void;
  onCreateOutfit: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onDelete,
  onMove,
  onTag,
  onExport,
  onCreateOutfit,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="glass rounded-2xl shadow-glow p-2 flex items-center gap-2">
        <div className="px-3 py-2 text-sm font-medium text-foreground">
          {selectedCount} selected
        </div>
        
        <div className="w-px h-8 bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateOutfit}
          className="text-foreground hover:text-primary"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Outfit
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onMove}
          className="text-foreground hover:text-primary"
        >
          <FolderInput className="w-4 h-4 mr-2" />
          Move
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onTag}
          className="text-foreground hover:text-primary"
        >
          <Tag className="w-4 h-4 mr-2" />
          Tag
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="text-foreground hover:text-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>

        <div className="w-px h-8 bg-border" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
