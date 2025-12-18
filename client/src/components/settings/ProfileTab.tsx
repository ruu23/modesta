import { useState } from 'react';
import { Camera, X, Instagram, Music2, Globe, Award, Shirt, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types/settings';
import { toast } from 'sonner';

interface ProfileTabProps {
  profile: UserProfile;
  stats: {
    outfitsCreated: number;
    itemsInCloset: number;
    daysSinceJoining: number;
    achievements: string[];
  };
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export const ProfileTab = ({ profile, stats, onUpdate }: ProfileTabProps) => {
  const [localProfile, setLocalProfile] = useState(profile);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate(localProfile);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-primary/20">
              {localProfile.avatar ? (
                <img 
                  src={localProfile.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">
                  {localProfile.name.charAt(0)}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4 text-primary-foreground" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload a photo to personalize your profile
            </p>
            {localProfile.avatar && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocalProfile(prev => ({ ...prev, avatar: null }))}
              >
                <X className="h-4 w-4 mr-2" />
                Remove Photo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={localProfile.name}
                onChange={(e) => setLocalProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                value={localProfile.location.city}
                onChange={(e) => setLocalProfile(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, city: e.target.value }
                }))}
                placeholder="Your city"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio"
              value={localProfile.bio}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Style Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Your Style Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Shirt className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.outfitsCreated}</p>
              <p className="text-sm text-muted-foreground">Outfits Created</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.itemsInCloset}</p>
              <p className="text-sm text-muted-foreground">Items in Closet</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.daysSinceJoining}</p>
              <p className="text-sm text-muted-foreground">Days Since Joining</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.achievements.length}</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.achievements.map((achievement) => (
              <Badge key={achievement} variant="secondary" className="px-3 py-1">
                <Award className="h-3 w-3 mr-1" />
                {achievement}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input 
                id="instagram"
                value={localProfile.socialLinks.instagram}
                onChange={(e) => setLocalProfile(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                }))}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center gap-2">
                <Music2 className="h-4 w-4" />
                TikTok
              </Label>
              <Input 
                id="tiktok"
                value={localProfile.socialLinks.tiktok}
                onChange={(e) => setLocalProfile(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, tiktok: e.target.value }
                }))}
                placeholder="@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-profile" className="text-base font-medium">
                Public Profile
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view your profile and outfits
              </p>
            </div>
            <Switch 
              id="public-profile"
              checked={localProfile.isPublic}
              onCheckedChange={(checked) => setLocalProfile(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
