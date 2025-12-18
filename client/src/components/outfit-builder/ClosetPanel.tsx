import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClosetItem, Category, CATEGORIES, COLORS } from '@/types/closet';

interface ClosetPanelProps {
  items: ClosetItem[];
  onDragStart: (item: ClosetItem) => void;
  onAddItem?: (item: ClosetItem) => void;
}

export function ClosetPanel({ items, onDragStart, onAddItem }: ClosetPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Category>('hijabs');

  const filteredItems = items.filter(item => {
    const matchesCategory = item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = selectedColors.length === 0 || 
                        item.colors.some(c => selectedColors.includes(c));
    return matchesCategory && matchesSearch && matchesColor;
  });

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const getCategoryCount = (category: Category) => {
    return items.filter(i => i.category === category).length;
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Your Closet</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted border-0"
          />
        </div>

        {/* Color Filter */}
        <div className="flex flex-wrap gap-1.5">
          {COLORS.slice(0, 8).map(({ value, hex }) => (
            <button
              key={value}
              onClick={() => toggleColor(value)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                selectedColors.includes(value)
                  ? 'border-primary scale-110'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Category)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start p-1 bg-muted/50 rounded-none overflow-x-auto flex-shrink-0">
          {CATEGORIES.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-xs px-2 py-1 data-[state=active]:bg-card"
            >
              {label.split(' ')[0]}
              <span className="ml-1 text-muted-foreground">({getCategoryCount(value)})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value={activeTab} className="m-0 p-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No items found
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(item));
                      onDragStart(item);
                    }}
                    onClick={() => onAddItem?.(item)}
                    className="aspect-square rounded-lg overflow-hidden bg-muted cursor-grab active:cursor-grabbing group relative hover:ring-2 hover:ring-primary transition-all min-h-[60px]"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="absolute bottom-1 left-1 right-1 text-[10px] text-primary-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
