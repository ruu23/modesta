import { useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  Preferences, 
  Measurements, 
  AccountSettings, 
  Subscription 
} from '@/types/settings';

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

export const useSettings = (initialUserData?: any) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: initialUserData?.id || 'temp-id',
    name: initialUserData?.fullName || '',
    avatar: null,
    bio: initialUserData?.bio || '',
    location: {
      city: initialUserData?.city || '',
      country: initialUserData?.country || ''
    },
    socialLinks: {
      instagram: '',
      tiktok: ''
    },
    isPublic: initialUserData?.isPublic || false,
    createdAt: initialUserData?.createdAt ? new Date(initialUserData.createdAt) : new Date(),
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  });
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

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      // Make API call to update profile
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      // Update local state
      setProfile(prev => ({ ...prev, ...updates }));
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }, []);

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
