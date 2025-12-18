export interface ClosetItem {
  id: string;
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
  wornCount: number;
  lastWorn: string | null;
  purchaseDate: string;
  createdAt: string;
}

export type Category = 
  | 'hijabs'
  | 'abayas'
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'accessories'
  | 'shoes';

export type Occasion = 
  | 'casual'
  | 'formal'
  | 'work'
  | 'weekend'
  | 'evening'
  | 'special';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'hijabs', label: 'Hijabs' },
  { value: 'abayas', label: 'Abayas' },
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
];

export const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'work', label: 'Work' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'evening', label: 'Evening' },
  { value: 'special', label: 'Special Event' },
];

export const SEASONS: { value: Season; label: string }[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
];

export const COLORS = [
  { value: 'black', label: 'Black', hex: '#1a1a1a' },
  { value: 'white', label: 'White', hex: '#f5f5f5' },
  { value: 'beige', label: 'Beige', hex: '#d4b896' },
  { value: 'navy', label: 'Navy', hex: '#1e3a5f' },
  { value: 'rose', label: 'Rose', hex: '#e8a0a0' },
  { value: 'burgundy', label: 'Burgundy', hex: '#722f37' },
  { value: 'olive', label: 'Olive', hex: '#708238' },
  { value: 'brown', label: 'Brown', hex: '#8b4513' },
  { value: 'gray', label: 'Gray', hex: '#808080' },
  { value: 'blue', label: 'Blue', hex: '#4a90d9' },
  { value: 'green', label: 'Green', hex: '#4a9d4a' },
  { value: 'pink', label: 'Pink', hex: '#f0a0c0' },
];

export interface ClosetFilters {
  categories: Category[];
  colors: string[];
  occasions: Occasion[];
  seasons: Season[];
  brands: string[];
  searchQuery: string;
}

export type SortOption = 'recent' | 'mostWorn' | 'color' | 'category';
