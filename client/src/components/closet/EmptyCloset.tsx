import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyClosetProps {
  onAddClick: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyCloset({ onAddClick, hasFilters, onClearFilters }: EmptyClosetProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-px h-16 bg-border mb-8" />
        <h2 className="text-headline mb-4">No Results</h2>
        <p className="text-muted-foreground max-w-md mb-8 tracking-wide">
          No items match your current filters. Adjust your criteria to discover more pieces.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      {/* Minimal wardrobe illustration */}
      <div className="relative mb-12">
        <div className="w-32 h-40 border border-border flex flex-col items-center justify-center">
          <div className="w-20 h-px bg-gold mb-4" />
          <div className="w-16 h-px bg-border mb-2" />
          <div className="w-12 h-px bg-border mb-2" />
          <div className="w-14 h-px bg-border" />
        </div>
      </div>
      
      <h2 className="text-headline mb-4">Begin Your Collection</h2>
      <p className="text-muted-foreground max-w-md mb-8 tracking-wide">
        Curate your personal wardrobe. Add your finest pieces to discover new styling possibilities.
      </p>
      <div className="divider-gold w-16 mb-8" />
      <Button variant="gold" onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add First Piece
      </Button>
    </div>
  );
}