import { Palette, Bell, Globe, DollarSign, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Preferences, STYLE_OPTIONS, HIJAB_STYLES, COLOR_SWATCHES, CURRENCIES } from '@/types/settings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PreferencesTabProps {
  preferences: Preferences;
  onUpdateStyle: (updates: Partial<Preferences['style']>) => void;
  onUpdateNotifications: (updates: Partial<Preferences['notifications']>) => void;
  onUpdatePreferences: (updates: Partial<Preferences>) => void;
}

export const PreferencesTab = ({ 
  preferences, 
  onUpdateStyle, 
  onUpdateNotifications,
  onUpdatePreferences 
}: PreferencesTabProps) => {

  const toggleColor = (color: string) => {
    const current = preferences.style.favoriteColors;
    const updated = current.includes(color)
      ? current.filter(c => c !== color)
      : [...current, color];
    onUpdateStyle({ favoriteColors: updated });
  };

  const toggleStyle = (style: string) => {
    const current = preferences.style.preferredStyles;
    const updated = current.includes(style)
      ? current.filter(s => s !== style)
      : [...current, style];
    onUpdateStyle({ preferredStyles: updated });
  };

  const toggleHijabStyle = (style: string) => {
    const current = preferences.style.hijabStyles;
    const updated = current.includes(style)
      ? current.filter(s => s !== style)
      : [...current, style];
    onUpdateStyle({ hijabStyles: updated });
  };

  const handleSave = () => {
    toast.success('Preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Style Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Style Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modesty Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Modesty Level</Label>
              <span className="text-sm font-medium text-primary">
                {preferences.style.modestyLevel}%
              </span>
            </div>
            <Slider 
              value={[preferences.style.modestyLevel]}
              onValueChange={([value]) => onUpdateStyle({ modestyLevel: value })}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less Coverage</span>
              <span>Full Coverage</span>
            </div>
          </div>

          {/* Favorite Colors */}
          <div className="space-y-3">
            <Label>Favorite Colors</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                    preferences.style.favoriteColors.includes(color)
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-muted"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preferred Styles */}
          <div className="space-y-3">
            <Label>Preferred Styles</Label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((style) => (
                <Badge 
                  key={style}
                  variant={preferences.style.preferredStyles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          {/* Hijab Styles */}
          <div className="space-y-3">
            <Label>Hijab Styles</Label>
            <div className="flex flex-wrap gap-2">
              {HIJAB_STYLES.map((style) => (
                <Badge 
                  key={style}
                  variant={preferences.style.hijabStyles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleHijabStyle(style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'dailyOutfitSuggestions', label: 'Daily Outfit Suggestions', desc: 'Get outfit ideas every morning' },
            { key: 'eventReminders', label: 'Event Reminders', desc: 'Reminders to plan outfits for events' },
            { key: 'newFeatures', label: 'New Features', desc: 'Updates about new app features' },
            { key: 'weeklyStyleDigest', label: 'Weekly Style Digest', desc: 'Summary of your style week' },
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor={key} className="text-base font-medium">{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch 
                id={key}
                checked={preferences.notifications[key as keyof typeof preferences.notifications]}
                onCheckedChange={(checked) => onUpdateNotifications({ [key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </Label>
              <Select 
                value={preferences.language}
                onValueChange={(value: 'en' | 'ar') => onUpdatePreferences({ language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Currency
              </Label>
              <Select 
                value={preferences.currency}
                onValueChange={(value) => onUpdatePreferences({ currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Measurement Units
              </Label>
              <Select 
                value={preferences.measurementUnit}
                onValueChange={(value: 'cm' | 'inches') => onUpdatePreferences({ measurementUnit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="inches">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
