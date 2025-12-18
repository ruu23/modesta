import { useState, useEffect, useMemo } from 'react';
import { ClosetItem, ClosetFilters, SortOption, Category } from '@/types/closet';
import { mockClosetItems } from '@/data/mockClosetItems';

const STORAGE_KEY = 'fashion-closet-items';

export function useCloset() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [filters, setFilters] = useState<ClosetFilters>({
    categories: [],
    colors: [],
    occasions: [],
    seasons: [],
    brands: [],
    searchQuery: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      // Initialize with mock data
      setItems(mockClosetItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockClosetItems));
    }
    setIsLoading(false);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.category));
    }
    if (filters.colors.length > 0) {
      result = result.filter(item => 
        item.colors.some(c => filters.colors.includes(c))
      );
    }
    if (filters.occasions.length > 0) {
      result = result.filter(item => 
        item.occasions.some(o => filters.occasions.includes(o))
      );
    }
    if (filters.seasons.length > 0) {
      result = result.filter(item => 
        item.seasons.some(s => filters.seasons.includes(s))
      );
    }
    if (filters.brands.length > 0) {
      result = result.filter(item => filters.brands.includes(item.brand));
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'mostWorn':
        result.sort((a, b) => b.wornCount - a.wornCount);
        break;
      case 'color':
        result.sort((a, b) => (a.colors[0] || '').localeCompare(b.colors[0] || ''));
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return result;
  }, [items, filters, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const uniqueCategories = new Set(items.map(item => item.category));
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    return {
      totalItems: items.length,
      categories: uniqueCategories.size,
      totalValue,
    };
  }, [items]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      hijabs: 0,
      abayas: 0,
      tops: 0,
      bottoms: 0,
      dresses: 0,
      outerwear: 0,
      accessories: 0,
      shoes: 0,
    };
    items.forEach(item => {
      counts[item.category]++;
    });
    return counts;
  }, [items]);

  // Brand list
  const brands = useMemo(() => {
    return [...new Set(items.map(item => item.brand))].sort();
  }, [items]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.colors.length +
      filters.occasions.length +
      filters.seasons.length +
      filters.brands.length
    );
  }, [filters]);

  // Find similar items
  const findSimilarItems = (item: ClosetItem): ClosetItem[] => {
    return items
      .filter(i => i.id !== item.id)
      .filter(i => 
        i.category === item.category ||
        i.colors.some(c => item.colors.includes(c))
      )
      .slice(0, 6);
  };

  // Actions
  const addItem = (item: Omit<ClosetItem, 'id' | 'createdAt' | 'wornCount' | 'lastWorn'>) => {
    const newItem: ClosetItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      wornCount: 0,
      lastWorn: null,
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<ClosetItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const deleteItems = (ids: string[]) => {
    setItems(prev => prev.filter(item => !ids.includes(item.id)));
    setSelectedItems([]);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      colors: [],
      occasions: [],
      seasons: [],
      brands: [],
      searchQuery: '',
    });
  };

  const markAsWorn = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateItem(id, {
        wornCount: item.wornCount + 1,
        lastWorn: new Date().toISOString(),
      });
    }
  };

  return {
    items: filteredItems,
    allItems: items,
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
    updateItem,
    deleteItem,
    deleteItems,
    toggleSelectItem,
    selectAll,
    clearSelection,
    clearFilters,
    markAsWorn,
  };
}
