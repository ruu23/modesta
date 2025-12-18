import { useState, memo } from 'react';
import { Eye, Wand2, Pencil, Trash2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClosetItem, CATEGORIES, COLORS } from '@/types/closet';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ClosetItemCardProps {
  item: ClosetItem;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateOutfit: () => void;
  selectionMode: boolean;
}

export const ClosetItemCard = memo(function ClosetItemCard({
  item,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onCreateOutfit,
  selectionMode,
}: ClosetItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryLabel = CATEGORIES.find(c => c.value === item.category)?.label || item.category;
  const primaryColor = COLORS.find(c => c.value === item.colors[0]);

  return (
    <article
      className={`group relative overflow-hidden bg-card border border-border transition-all duration-300 cursor-pointer ${
        isSelected ? 'border-gold' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => selectionMode ? onSelect() : onView()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectionMode ? onSelect() : onView();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${item.name} by ${item.brand}. ${isSelected ? 'Selected.' : ''}`}
      aria-pressed={selectionMode ? isSelected : undefined}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <OptimizedImage
          src={item.images[0]}
          alt={`${item.name} - ${categoryLabel} by ${item.brand}`}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Selection Checkbox */}
        {(selectionMode || isSelected) && (
          <div
            className={`absolute top-4 left-4 w-6 h-6 flex items-center justify-center transition-all border ${
              isSelected 
                ? 'bg-gold border-gold text-background' 
                : 'bg-background/80 border-border'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected && <Check className="w-4 h-4" />}
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-background/90 px-2 py-1 text-foreground">
          {categoryLabel}
        </span>

        {/* Color Dot */}
        {primaryColor && (
          <div
            className="absolute bottom-4 left-4 w-4 h-4 border border-background"
            style={{ backgroundColor: primaryColor.hex }}
            title={primaryColor.label}
          />
        )}

        {/* Worn Count */}
        {item.wornCount > 0 && (
          <span className="absolute bottom-4 right-4 text-[10px] uppercase tracking-wider bg-background/90 px-2 py-1 text-muted-foreground">
            {item.wornCount}× worn
          </span>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-background/90 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered && !selectionMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="w-10 h-10 border border-foreground text-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateOutfit();
            }}
            className="w-10 h-10 border border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-background transition-colors"
            title="Create Outfit"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-10 h-10 border border-foreground text-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-10 h-10 border border-destructive text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Info */}
      <div className="p-4 border-t border-border">
        <h3 className="font-medium text-foreground truncate tracking-wide">{item.name}</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.brand}</p>
      </div>
    </article>
  );
});