export interface UserProfile {
  id: string;
  avatar: string | null;
  name: string;
  bio: string;
  location: {
    city: string;
    country: string;
  };
  socialLinks: {
    instagram: string;
    tiktok: string;
  };
  isPublic: boolean;
  createdAt: Date;
}

export interface StylePreferences {
  modestyLevel: number;
  favoriteColors: string[];
  preferredStyles: string[];
  hijabStyles: string[];
}

export interface NotificationSettings {
  dailyOutfitSuggestions: boolean;
  eventReminders: boolean;
  newFeatures: boolean;
  weeklyStyleDigest: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface Preferences {
  style: StylePreferences;
  notifications: NotificationSettings;
  language: 'en' | 'ar';
  currency: string;
  measurementUnit: 'cm' | 'inches';
}

export interface Measurements {
  height: number | null;
  weight: number | null;
  bodyType: string;
  detailed: {
    bust: number | null;
    waist: number | null;
    hips: number | null;
    shoulderWidth: number | null;
    armLength: number | null;
    inseam: number | null;
  };
  lastUpdated: Date | null;
}

export interface AccountSettings {
  email: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  connectedAccounts: {
    google: boolean;
    facebook: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    dataSharing: boolean;
  };
}

export interface Subscription {
  plan: 'free' | 'premium' | 'pro';
  price: number;
  renewalDate: Date | null;
  features: string[];
  usage: {
    aiQueriesUsed: number;
    aiQueriesLimit: number;
    closetItems: number;
    closetItemsLimit: number | null;
  };
  paymentMethod: {
    type: string;
    last4: string;
  } | null;
  billingHistory: {
    date: Date;
    amount: number;
    description: string;
  }[];
}

export const STYLE_OPTIONS = [
  'Modern', 'Classic', 'Modest Chic', 'Minimalist', 
  'Bohemian', 'Elegant', 'Casual', 'Sporty'
];

export const HIJAB_STYLES = [
  'Turkish', 'Malaysian', 'Indonesian', 'Gulf Style',
  'Turban', 'Shawl', 'Al-Amira', 'Khimar'
];

export const COLOR_SWATCHES = [
  '#000000', '#FFFFFF', '#1a1a2e', '#16213e', '#0f3460',
  '#e94560', '#f8b500', '#7b2cbf', '#2d6a4f', '#bc6c25',
  '#fec89a', '#d4a373', '#faedcd', '#ccd5ae', '#e9edc9'
];

export const BODY_TYPES = [
  'Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle'
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' }
];
