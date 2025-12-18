import { useState, useMemo, useCallback, Suspense } from 'react';
import { useCloset } from '@/hooks/useCloset';
import { ClosetHeader } from '@/components/closet/ClosetHeader';
import { ClosetItemCard } from '@/components/closet/ClosetItemCard';
import { BulkActionBar } from '@/components/closet/BulkActionBar';
import { EmptyCloset } from '@/components/closet/EmptyCloset';
import { ClosetSkeleton } from '@/components/closet/ClosetSkeleton';
import { ClosetItem } from '@/types/closet';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { LazyLoad } from '@/components/ui/LazyLoad';
import { LazyFilterSidebar, LazyItemDetailModal, LazyAddItemModal } from '@/lib/lazyComponents';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ExportModal } from '@/components/export';

export default function Closet() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    items,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    selectedItems,
    isLoading,
    stats,
    categoryCounts,
    brands,
    activeFilterCount,
    findSimilarItems,
    addItem,
    deleteItem,
    deleteItems,
    toggleSelectItem,
    clearSelection,
    clearFilters,
  } = useCloset();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleViewItem = useCallback((item: ClosetItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  }, []);

  const handleEditItem = useCallback(() => {
    toast({
      title: "Edit Item",
      description: "Edit functionality coming soon!",
    });
  }, [toast]);

  const handleDeleteItem = useCallback((id?: string) => {
    const itemId = id || selectedItem?.id;
    if (itemId) {
      deleteItem(itemId);
      setIsDetailOpen(false);
      setSelectedItem(null);
      toast({
        title: "Item Deleted",
        description: "The item has been removed from your closet.",
      });
    }
  }, [selectedItem?.id, deleteItem, toast]);

  const handleBulkDelete = useCallback(() => {
    deleteItems(selectedItems);
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been removed.`,
    });
  }, [deleteItems, selectedItems, toast]);

  const handleCreateOutfit = useCallback(() => {
    toast({
      title: "Create Outfit",
      description: "Outfit maker coming soon!",
    });
  }, [toast]);

  const handleBulkMove = useCallback(() => {
    toast({
      title: "Move Items",
      description: "Move functionality coming soon!",
    });
  }, [toast]);

  const handleBulkTag = useCallback(() => {
    toast({
      title: "Tag Items",
      description: "Tagging functionality coming soon!",
    });
  }, [toast]);

  const handleBulkExport = useCallback(() => {
    setIsExportOpen(true);
  }, []);

  const handleAddItem = useCallback((item: Parameters<typeof addItem>[0]) => {
    addItem(item);
    toast({
      title: "Item Added",
      description: "Your new item has been added to the closet!",
    });
  }, [addItem, toast]);

  const similarItems = useMemo(() => 
    selectedItem ? findSimilarItems(selectedItem) : [], 
    [selectedItem, findSimilarItems]
  );

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        {/* Theme Toggle - Desktop */}
        <div className="fixed top-4 right-4 z-50 hidden md:block">
          <ThemeToggle />
        </div>
        
        {/* Collection Header - Zara Style */}
        <header className="pt-16 md:pt-24 pb-8 md:pb-12 text-center">
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <h1 className="font-serif text-3xl md:text-5xl tracking-[0.2em] uppercase text-foreground">
            Collection
          </h1>
          <p className="mt-4 text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground">
            {stats.totalItems} Pieces
          </p>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </header>

        {/* Minimal Navigation */}
        <nav className="border-y border-border/30 py-4 md:py-6">
          <div className="container max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between">
              {/* Filter Controls */}
              <div className="flex items-center gap-6 md:gap-12">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
                >
                  Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
                >
                  {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </button>
              </div>

              {/* Add & Sort */}
              <div className="flex items-center gap-6 md:gap-12">
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Collection Grid */}
        <main className="container max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          {isLoading ? (
            <ClosetSkeleton />
          ) : items.length === 0 ? (
            <EmptyCloset
              onAddClick={() => setIsAddOpen(true)}
              hasFilters={activeFilterCount > 0}
              onClearFilters={clearFilters}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => selectedItems.length > 0 ? toggleSelectItem(item.id) : handleViewItem(item)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
                    <OptimizedImage
                      src={item.images[0]}
                      alt={`${item.name} by ${item.brand}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Selection Indicator */}
                    {selectedItems.includes(item.id) && (
                      <div className="absolute top-4 left-4 w-6 h-6 bg-gold flex items-center justify-center">
                        <span className="text-background text-xs">✓</span>
                      </div>
                    )}

                    {/* Hover Overlay - Minimal */}
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-500" />
                  </div>

                  {/* Item Info - Clean Typography */}
                  <div className="mt-4 md:mt-6 text-center">
                    <h3 className="font-serif text-sm md:text-base tracking-wide text-foreground group-hover:text-gold transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] md:text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {item.brand}
                    </p>
                    {/* Gold Underline on Hover */}
                    <div className="mt-3 w-0 h-px bg-gold mx-auto transition-all duration-500 group-hover:w-12" />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="divide-y divide-border/30">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group py-6 md:py-8 flex items-center gap-6 md:gap-10 cursor-pointer"
                  onClick={() => handleViewItem(item)}
                >
                  <div className="w-20 h-28 md:w-24 md:h-32 overflow-hidden bg-muted/20 flex-shrink-0">
                    <OptimizedImage
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base md:text-lg tracking-wide text-foreground group-hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] md:text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {item.brand}
                    </p>
                    <div className="mt-3 w-0 h-px bg-gold transition-all duration-500 group-hover:w-16" />
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-sm md:text-base text-foreground">${item.price}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Mobile Filter - Bottom Sheet */}
        {isMobile ? (
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 bg-background border-t border-gold/20">
              <LazyLoad minHeight="400px">
                <Suspense fallback={<div className="p-8 text-center text-xs tracking-[0.2em] uppercase">Loading...</div>}>
                  <LazyFilterSidebar
                    isOpen={true}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                    categoryCounts={categoryCounts}
                    brands={brands}
                    onClearFilters={clearFilters}
                  />
                </Suspense>
              </LazyLoad>
            </SheetContent>
          </Sheet>
        ) : (
          isFilterOpen && (
            <Suspense fallback={<div className="p-8 text-center text-xs tracking-[0.2em] uppercase">Loading...</div>}>
              <LazyFilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
                categoryCounts={categoryCounts}
                brands={brands}
                onClearFilters={clearFilters}
              />
            </Suspense>
          )
        )}

        {/* Item Detail Modal */}
        {isDetailOpen && (
          <Suspense fallback={null}>
            <LazyItemDetailModal
              item={selectedItem}
              isOpen={isDetailOpen}
              onClose={() => {
                setIsDetailOpen(false);
                setSelectedItem(null);
              }}
              onEdit={handleEditItem}
              onDelete={() => handleDeleteItem()}
              onCreateOutfit={handleCreateOutfit}
              similarItems={similarItems}
              onViewSimilar={(item) => {
                setSelectedItem(item);
              }}
            />
          </Suspense>
        )}

        {/* Add Item Modal */}
        {isAddOpen && (
          <Suspense fallback={null}>
            <LazyAddItemModal
              isOpen={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              onAdd={handleAddItem}
            />
          </Suspense>
        )}

        {/* Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedItems.length}
          onClearSelection={clearSelection}
          onDelete={handleBulkDelete}
          onMove={handleBulkMove}
          onTag={handleBulkTag}
          onExport={handleBulkExport}
          onCreateOutfit={handleCreateOutfit}
        />
      </div>
    </AppLayout>
  );
}
