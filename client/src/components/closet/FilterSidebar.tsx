import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ClosetFilters, 
  Category, 
  Occasion, 
  Season, 
  CATEGORIES, 
  OCCASIONS, 
  SEASONS, 
  COLORS 
} from '@/types/closet';
import { useState } from 'react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ClosetFilters;
  setFilters: (filters: ClosetFilters) => void;
  categoryCounts: Record<Category, number>;
  brands: string[];
  onClearFilters: () => void;
}

export function FilterSidebar({
  isOpen,
  onClose,
  filters,
  setFilters,
  categoryCounts,
  brands,
  onClearFilters,
}: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState('');

  const toggleCategory = (category: Category) => {
    const updated = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: updated });
  };

  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    setFilters({ ...filters, colors: updated });
  };

  const toggleOccasion = (occasion: Occasion) => {
    const updated = filters.occasions.includes(occasion)
      ? filters.occasions.filter(o => o !== occasion)
      : [...filters.occasions, occasion];
    setFilters({ ...filters, occasions: updated });
  };

  const toggleSeason = (season: Season) => {
    const updated = filters.seasons.includes(season)
      ? filters.seasons.filter(s => s !== season)
      : [...filters.seasons, season];
    setFilters({ ...filters, seasons: updated });
  };

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: updated });
  };

  const filteredBrands = brands.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Filters */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.categories.includes(value)}
                          onCheckedChange={() => toggleCategory(value)}
                        />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {label}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({categoryCounts[value]})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(({ value, label, hex }) => (
                    <button
                      key={value}
                      onClick={() => toggleColor(value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                        filters.colors.includes(value)
                          ? 'border-primary scale-110'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={label}
                    >
                      {filters.colors.includes(value) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-card border border-border" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Occasions</h3>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleOccasion(value)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        filters.occasions.includes(value)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seasons */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Seasons</h3>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleSeason(value)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        filters.seasons.includes(value)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Brands</h3>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="pl-9 bg-muted border-0"
                  />
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filteredBrands.map(brand => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <Checkbox
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
