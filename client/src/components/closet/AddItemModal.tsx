import { useState } from 'react';
import { X, Upload, Camera, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Category, 
  Occasion, 
  Season, 
  CATEGORIES, 
  OCCASIONS, 
  SEASONS, 
  COLORS 
} from '@/types/closet';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    images: string[];
    category: Category;
    colors: string[];
    brand: string;
    size: string;
    price: number;
    occasions: Occasion[];
    seasons: Season[];
    pattern: string;
    purchaseDate: string;
  }) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [colors, setColors] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [pattern, setPattern] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  const toggleColor = (color: string) => {
    setColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleOccasion = (occasion: Occasion) => {
    setOccasions(prev => 
      prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]
    );
  };

  const toggleSeason = (season: Season) => {
    setSeasons(prev => 
      prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
    );
  };

  const handleSubmit = () => {
    if (!name || !category || !imageUrl) return;

    onAdd({
      name,
      images: [imageUrl],
      category: category as Category,
      colors,
      brand,
      size,
      price: parseFloat(price) || 0,
      occasions,
      seasons,
      pattern,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
    });

    // Reset form
    setName('');
    setImageUrl('');
    setCategory('');
    setColors([]);
    setBrand('');
    setSize('');
    setPrice('');
    setOccasions([]);
    setSeasons([]);
    setPattern('');
    setPurchaseDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 bg-card">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-foreground">Add New Item</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="space-y-6 pt-4">
            {/* Image Upload Area */}
            <div>
              <Label className="text-foreground">Image</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" type="button">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm" type="button">
                      <Camera className="w-4 h-4 mr-2" />
                      Camera
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">or paste an image URL below</p>
                </div>
              </div>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2"
              />
              {imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden w-20 h-20">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-foreground">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Black Silk Hijab"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-foreground">Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand & Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand" className="text-foreground">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Zara"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="size" className="text-foreground">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., M"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Price & Pattern */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-foreground">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pattern" className="text-foreground">Pattern</Label>
                <Input
                  id="pattern"
                  placeholder="e.g., Solid, Floral"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className="text-foreground">Colors</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLORS.map(({ value, label, hex }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleColor(value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      colors.includes(value)
                        ? 'border-primary scale-110'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <Label className="text-foreground">Occasions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {OCCASIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleOccasion(value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      occasions.includes(value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div>
              <Label className="text-foreground">Seasons</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SEASONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSeason(value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      seasons.includes(value)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Date */}
            <div>
              <Label htmlFor="purchaseDate" className="text-foreground">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1 gradient-rose text-primary-foreground border-0"
            onClick={handleSubmit}
            disabled={!name || !category || !imageUrl}
          >
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
