import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Pencil, Wand2, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ClosetItem, CATEGORIES, OCCASIONS, SEASONS, COLORS } from '@/types/closet';
import { format, formatDistanceToNow } from 'date-fns';

interface ItemDetailModalProps {
  item: ClosetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateOutfit: () => void;
  similarItems: ClosetItem[];
  onViewSimilar: (item: ClosetItem) => void;
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onCreateOutfit,
  similarItems,
  onViewSimilar,
}: ItemDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!item) return null;

  const categoryLabel = CATEGORIES.find(c => c.value === item.category)?.label || item.category;
  const occasionLabels = item.occasions.map(o => OCCASIONS.find(oc => oc.value === o)?.label || o);
  const seasonLabels = item.seasons.map(s => SEASONS.find(se => se.value === s)?.label || s);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
        <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 bg-muted">
            <img
              src={item.images[currentImageIndex]}
              alt={item.name}
              className="w-full h-64 md:h-full object-cover"
            />
            
            {item.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {item.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex 
                          ? 'bg-primary' 
                          : 'bg-card/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors md:hidden"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <Badge className="mb-2 bg-accent text-accent-foreground border-0">
                    {categoryLabel}
                  </Badge>
                  <h2 className="text-2xl font-semibold text-foreground">{item.name}</h2>
                  <p className="text-muted-foreground">{item.brand}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium text-foreground">{item.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium text-foreground">${item.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pattern</p>
                    <p className="font-medium text-foreground">{item.pattern}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Worn</p>
                    <p className="font-medium text-foreground">{item.wornCount} times</p>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Colors</p>
                  <div className="flex gap-2">
                    {item.colors.map(colorValue => {
                      const color = COLORS.find(c => c.value === colorValue);
                      return (
                        <div key={colorValue} className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full border border-border"
                            style={{ backgroundColor: color?.hex }}
                          />
                          <span className="text-sm text-foreground">{color?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Occasions */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Occasions</p>
                  <div className="flex flex-wrap gap-2">
                    {occasionLabels.map(label => (
                      <Badge key={label} variant="secondary" className="bg-secondary text-secondary-foreground">
                        <Tag className="w-3 h-3 mr-1" />
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Seasons */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Seasons</p>
                  <div className="flex flex-wrap gap-2">
                    {seasonLabels.map(label => (
                      <Badge key={label} variant="outline" className="border-border">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Purchased: {format(new Date(item.purchaseDate), 'MMMM d, yyyy')}</span>
                  </div>
                  {item.lastWorn && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Last worn: {formatDistanceToNow(new Date(item.lastWorn), { addSuffix: true })}</span>
                    </div>
                  )}
                </div>

                {/* Similar Items */}
                {similarItems.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">You might also like</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {similarItems.slice(0, 4).map(similarItem => (
                        <button
                          key={similarItem.id}
                          onClick={() => onViewSimilar(similarItem)}
                          className="flex-shrink-0 w-20 group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-1">
                            <img
                              src={similarItem.images[0]}
                              alt={similarItem.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors">
                            {similarItem.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="p-4 border-t border-border flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button className="flex-1 gradient-rose text-primary-foreground border-0" onClick={onCreateOutfit}>
                <Wand2 className="w-4 h-4 mr-2" />
                Create Outfit
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
