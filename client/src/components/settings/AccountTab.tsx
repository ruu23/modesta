import { useState } from 'react';
import { Mail, Lock, Shield, Link2, Eye, Download, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AccountSettings } from '@/types/settings';
import { toast } from 'sonner';

interface AccountTabProps {
  account: AccountSettings;
  onUpdateAccount: (updates: Partial<AccountSettings>) => void;
  onUpdatePrivacy: (updates: Partial<AccountSettings['privacy']>) => void;
}

export const AccountTab = ({ account, onUpdateAccount, onUpdatePrivacy }: AccountTabProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleChangePassword = () => {
    toast.success('Password reset email sent!');
  };

  const handleEnable2FA = () => {
    onUpdateAccount({ twoFactorEnabled: !account.twoFactorEnabled });
    toast.success(account.twoFactorEnabled ? '2FA disabled' : '2FA enabled successfully!');
  };

  const handleConnectGoogle = () => {
    onUpdateAccount({ 
      connectedAccounts: { ...account.connectedAccounts, google: !account.connectedAccounts.google }
    });
    toast.success(account.connectedAccounts.google ? 'Google disconnected' : 'Google connected!');
  };

  const handleConnectFacebook = () => {
    onUpdateAccount({ 
      connectedAccounts: { ...account.connectedAccounts, facebook: !account.connectedAccounts.facebook }
    });
    toast.success(account.connectedAccounts.facebook ? 'Facebook disconnected' : 'Facebook connected!');
  };

  const handleDownloadData = () => {
    toast.success('Your data export has been started. You will receive an email shortly.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      toast.error('Account deletion initiated. This is irreversible.');
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input value={account.email} disabled />
            </div>
            {account.isEmailVerified && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Verified
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            To change your email, please contact support.
          </p>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base font-medium">Password</Label>
              <p className="text-sm text-muted-foreground">Change your account password</p>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch 
              checked={account.twoFactorEnabled}
              onCheckedChange={handleEnable2FA}
            />
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <Label className="text-base font-medium">Google</Label>
                <p className="text-sm text-muted-foreground">
                  {account.connectedAccounts.google ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant={account.connectedAccounts.google ? "outline" : "default"}
              onClick={handleConnectGoogle}
            >
              {account.connectedAccounts.google ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <Label className="text-base font-medium">Facebook</Label>
                <p className="text-sm text-muted-foreground">
                  {account.connectedAccounts.facebook ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant={account.connectedAccounts.facebook ? "outline" : "default"}
              onClick={handleConnectFacebook}
            >
              {account.connectedAccounts.facebook ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select 
              value={account.privacy.profileVisibility}
              onValueChange={(value: 'public' | 'private' | 'friends') => 
                onUpdatePrivacy({ profileVisibility: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can view</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private - Only you</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div>
              <Label className="text-base font-medium">Data Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Allow anonymous usage data to improve the app
              </p>
            </div>
            <Switch 
              checked={account.privacy.dataSharing}
              onCheckedChange={(checked) => onUpdatePrivacy({ dataSharing: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Account */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download My Data
              </Label>
              <p className="text-sm text-muted-foreground">
                Get a copy of all your data
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadData}>
              Request Download
            </Button>
          </div>

          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div>
              <Label className="text-base font-medium text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm">
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <Input 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'DELETE'}
                  >
                    Delete My Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
