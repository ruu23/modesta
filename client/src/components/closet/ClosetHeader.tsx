import { Shirt, Tag, DollarSign, Plus, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SortOption } from '@/types/closet';

interface ClosetHeaderProps {
  stats: {
    totalItems: number;
    categories: number;
    totalValue: number;
  };
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  activeFilterCount: number;
  onFilterClick: () => void;
  onAddClick: () => void;
}

export function ClosetHeader({
  stats,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  activeFilterCount,
  onFilterClick,
  onAddClick,
}: ClosetHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shirt className="w-6 h-6 text-gold" strokeWidth={1} />
          <div>
            <h1 className="text-headline">My Collection</h1>
            <div className="divider-gold w-16 mt-2" />
          </div>
        </div>
        <Button onClick={onAddClick} variant="gold">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-6">
        <div className="border border-border p-6">
          <div className="flex items-center gap-4">
            <Shirt className="w-5 h-5 text-gold" strokeWidth={1} />
            <div>
              <p className="text-2xl font-medium">{stats.totalItems}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Pieces</p>
            </div>
          </div>
        </div>
        <div className="border border-border p-6">
          <div className="flex items-center gap-4">
            <Tag className="w-5 h-5 text-gold" strokeWidth={1} />
            <div>
              <p className="text-2xl font-medium">{stats.categories}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
        <div className="border border-border p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="w-5 h-5 text-gold" strokeWidth={1} />
            <div>
              <p className="text-2xl font-medium">
                ${stats.totalValue.toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-t border-b border-border py-4">
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px] border-border bg-transparent">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="mostWorn">Most Worn</SelectItem>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="relative"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-gold text-background border-0">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}