import { lazy } from 'react';

// Lazy load heavy page components for code splitting
export const LazyCloset = lazy(() => import('@/pages/Closet'));
export const LazyOutfitBuilder = lazy(() => import('@/pages/OutfitBuilder'));
export const LazyChat = lazy(() => import('@/pages/Chat'));
export const LazyCalendar = lazy(() => import('@/pages/Calendar'));
export const LazySettings = lazy(() => import('@/pages/Settings'));

// Lazy load heavy components
export const LazyFilterSidebar = lazy(() => 
  import('@/components/closet/FilterSidebar').then(m => ({ default: m.FilterSidebar }))
);

export const LazyItemDetailModal = lazy(() => 
  import('@/components/closet/ItemDetailModal').then(m => ({ default: m.ItemDetailModal }))
);

export const LazyAddItemModal = lazy(() => 
  import('@/components/closet/AddItemModal').then(m => ({ default: m.AddItemModal }))
);

export const LazyEventModal = lazy(() => 
  import('@/components/calendar/EventModal').then(m => ({ default: m.EventModal }))
);

export const LazyAISuggestionsPanel = lazy(() => 
  import('@/components/outfit-builder/AISuggestionsPanel').then(m => ({ default: m.AISuggestionsPanel }))
);
