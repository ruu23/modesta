import { User, Settings2, Ruler, Shield, CreditCard, ArrowLeft, Accessibility } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/hooks/useSettings';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { MeasurementsTab } from '@/components/settings/MeasurementsTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { SubscriptionTab } from '@/components/settings/SubscriptionTab';
import { AccessibilityPanel } from '@/components/accessibility';
import { ThemeToggle } from '@/components/theme';
import { AppLayout } from '@/components/layout';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Settings = () => {
  const {
    profile,
    preferences,
    measurements,
    account,
    subscription,
    stats,
    updateProfile,
    updatePreferences,
    updateStylePreferences,
    updateNotifications,
    updateMeasurements,
    updateDetailedMeasurements,
    updateAccount,
    updatePrivacy,
  } = useSettings();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings2 },
    { id: 'measurements', label: 'Measurements', icon: Ruler },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  ];

  return (
    <AppLayout showBottomNav={true}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="min-w-[44px] min-h-[44px]"
                  aria-label="Go back to home"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-semibold">Settings</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Manage your account and preferences</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="container mx-auto px-3 md:px-4 py-4 md:py-8">
          <Tabs defaultValue="profile" className="space-y-4 md:space-y-8">
            {/* Tab Navigation - Scrollable on mobile */}
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg" role="tablist" aria-label="Settings sections">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 md:px-4 py-2.5 min-h-[44px]"
                    aria-controls={`${tab.id}-panel`}
                  >
                    <tab.icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>

            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fade-in" id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">
              <ProfileTab 
                profile={profile}
                stats={stats}
                onUpdate={updateProfile}
              />
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="animate-fade-in" id="preferences-panel" role="tabpanel" aria-labelledby="preferences-tab">
              <PreferencesTab 
                preferences={preferences}
                onUpdateStyle={updateStylePreferences}
                onUpdateNotifications={updateNotifications}
                onUpdatePreferences={updatePreferences}
              />
            </TabsContent>

            {/* Measurements Tab */}
            <TabsContent value="measurements" className="animate-fade-in" id="measurements-panel" role="tabpanel" aria-labelledby="measurements-tab">
              <MeasurementsTab 
                measurements={measurements}
                measurementUnit={preferences.measurementUnit}
                onUpdateMeasurements={updateMeasurements}
                onUpdateDetailedMeasurements={updateDetailedMeasurements}
              />
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="animate-fade-in" id="account-panel" role="tabpanel" aria-labelledby="account-tab">
              <AccountTab 
                account={account}
                onUpdateAccount={updateAccount}
                onUpdatePrivacy={updatePrivacy}
              />
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="animate-fade-in" id="subscription-panel" role="tabpanel" aria-labelledby="subscription-tab">
              <SubscriptionTab subscription={subscription} />
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility" className="animate-fade-in" id="accessibility-panel" role="tabpanel" aria-labelledby="accessibility-tab">
              <AccessibilityPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppLayout>
  );
};

export default Settings;
