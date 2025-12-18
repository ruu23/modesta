import { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Preferences, 
  Measurements, 
  AccountSettings, 
  Subscription 
} from '@/types/settings';

const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  avatar: null,
  name: 'Fatima Ahmed',
  bio: 'Modest fashion enthusiast. Sharing my style journey.',
  location: { city: 'Dubai', country: 'UAE' },
  socialLinks: { instagram: '@fatima.styles', tiktok: '@fatima.styles' },
  isPublic: true,
  createdAt: new Date('2024-01-15'),
};

const DEFAULT_PREFERENCES: Preferences = {
  style: {
    modestyLevel: 80,
    favoriteColors: ['#1a1a2e', '#e94560', '#faedcd'],
    preferredStyles: ['Modest Chic', 'Elegant'],
    hijabStyles: ['Turkish', 'Shawl'],
  },
  notifications: {
    dailyOutfitSuggestions: true,
    eventReminders: true,
    newFeatures: true,
    weeklyStyleDigest: false,
    emailNotifications: true,
    pushNotifications: true,
  },
  language: 'en',
  currency: 'USD',
  measurementUnit: 'cm',
};

const DEFAULT_MEASUREMENTS: Measurements = {
  height: 165,
  weight: null,
  bodyType: 'Hourglass',
  detailed: {
    bust: 90,
    waist: 70,
    hips: 95,
    shoulderWidth: null,
    armLength: null,
    inseam: null,
  },
  lastUpdated: new Date('2024-06-01'),
};

const DEFAULT_ACCOUNT: AccountSettings = {
  email: 'fatima@example.com',
  isEmailVerified: true,
  twoFactorEnabled: false,
  connectedAccounts: { google: true, facebook: false },
  privacy: { profileVisibility: 'public', dataSharing: false },
};

const DEFAULT_SUBSCRIPTION: Subscription = {
  plan: 'premium',
  price: 9.99,
  renewalDate: new Date('2025-01-15'),
  features: [
    'Unlimited outfit creations',
    'AI styling suggestions',
    'Weather-based recommendations',
    'Priority support',
    'Export calendar',
  ],
  usage: {
    aiQueriesUsed: 45,
    aiQueriesLimit: 100,
    closetItems: 87,
    closetItemsLimit: null,
  },
  paymentMethod: { type: 'Visa', last4: '4242' },
  billingHistory: [
    { date: new Date('2024-12-15'), amount: 9.99, description: 'Premium Plan - Monthly' },
    { date: new Date('2024-11-15'), amount: 9.99, description: 'Premium Plan - Monthly' },
    { date: new Date('2024-10-15'), amount: 9.99, description: 'Premium Plan - Monthly' },
  ],
};

export const useSettings = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [measurements, setMeasurements] = useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [account, setAccount] = useState<AccountSettings>(DEFAULT_ACCOUNT);
  const [subscription, setSubscription] = useState<Subscription>(DEFAULT_SUBSCRIPTION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSettings = localStorage.getItem('modesta-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.measurements) setMeasurements(parsed.measurements);
        if (parsed.account) setAccount(parsed.account);
        if (parsed.subscription) setSubscription(parsed.subscription);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('modesta-settings', JSON.stringify({
        profile, preferences, measurements, account, subscription
      }));
    }
  }, [profile, preferences, measurements, account, subscription, isLoading]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const updateStylePreferences = (updates: Partial<Preferences['style']>) => {
    setPreferences(prev => ({
      ...prev,
      style: { ...prev.style, ...updates }
    }));
  };

  const updateNotifications = (updates: Partial<Preferences['notifications']>) => {
    setPreferences(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates }
    }));
  };

  const updateMeasurements = (updates: Partial<Measurements>) => {
    setMeasurements(prev => ({ 
      ...prev, 
      ...updates,
      lastUpdated: new Date()
    }));
  };

  const updateDetailedMeasurements = (updates: Partial<Measurements['detailed']>) => {
    setMeasurements(prev => ({
      ...prev,
      detailed: { ...prev.detailed, ...updates },
      lastUpdated: new Date()
    }));
  };

  const updateAccount = (updates: Partial<AccountSettings>) => {
    setAccount(prev => ({ ...prev, ...updates }));
  };

  const updatePrivacy = (updates: Partial<AccountSettings['privacy']>) => {
    setAccount(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...updates }
    }));
  };

  // Stats calculation
  const stats = {
    outfitsCreated: 24,
    itemsInCloset: 87,
    daysSinceJoining: Math.floor(
      (new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ),
    achievements: ['Early Adopter', 'Style Maven', '100 Outfits', 'Color Master']
  };

  return {
    profile,
    preferences,
    measurements,
    account,
    subscription,
    stats,
    isLoading,
    updateProfile,
    updatePreferences,
    updateStylePreferences,
    updateNotifications,
    updateMeasurements,
    updateDetailedMeasurements,
    updateAccount,
    updatePrivacy,
  };
};
