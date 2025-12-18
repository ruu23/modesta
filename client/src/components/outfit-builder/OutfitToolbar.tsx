import { Undo2, Redo2, Trash2, Save, Share2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OutfitToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSaveDraft: () => void;
  onShare: () => void;
  onTryAvatar: () => void;
  itemCount: number;
}

export function OutfitToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSaveDraft,
  onShare,
  onTryAvatar,
  itemCount,
}: OutfitToolbarProps) {
  return (
    <div className="h-14 border-t border-border bg-card flex items-center justify-between px-4">
      {/* Left Actions */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-9 w-9"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-9 w-9"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              disabled={itemCount === 0}
              className="h-9 w-9 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear Canvas</TooltipContent>
        </Tooltip>
      </div>

      {/* Center Info */}
      <div className="text-sm text-muted-foreground">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} on canvas
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save as draft</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onShare} disabled={itemCount === 0}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share outfit</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onTryAvatar}
              disabled={itemCount === 0}
              className="gradient-rose text-primary-foreground border-0"
            >
              <User className="w-4 h-4 mr-2" />
              Try on Avatar
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview on your avatar</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
