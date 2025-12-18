import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Link2,
  Copy,
  Check,
  Instagram,
  Twitter,
  Mail,
  Printer,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { generateShareableLink, copyToClipboard, openPrintView } from '@/lib/exportUtils';

// Pinterest icon component
const Pinterest = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

export function ExportShareTab() {
  const { toast } = useToast();
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = () => {
    const link = generateShareableLink('closet');
    setShareLink(link);
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      const success = await copyToClipboard(shareLink);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: 'Link Copied!',
          description: 'Share link has been copied to clipboard.',
        });
      }
    }
  };

  const socialPlatforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
      description: 'Share styled outfit images',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: Pinterest,
      color: 'bg-red-600',
      description: 'Pin your favorite outfits',
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black dark:bg-white dark:text-black',
      description: 'Tweet your style',
    },
  ];

  const handleSocialShare = (platform: string) => {
    toast({
      title: `Share to ${platform}`,
      description: 'Social sharing will be available soon!',
    });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Check out my outfit ideas from Modesta!');
    const body = encodeURIComponent(`Hi!\n\nI wanted to share some outfit ideas with you.\n\nCheck them out: ${shareLink || generateShareableLink('closet')}\n\nBest,\n[Your Name]`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handlePrint = () => {
    const content = `
      <div class="item">
        <h3>My Modesta Closet</h3>
        <p>Printed on ${new Date().toLocaleDateString()}</p>
        <p>Items: Available in your closet export</p>
      </div>
    `;
    openPrintView(content, 'My Modesta Closet');
  };

  return (
    <div className="space-y-6">
      {/* Generate Shareable Link */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Shareable Link</Label>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Public
          </Badge>
        </div>
        
        <div className="p-4 border rounded-lg space-y-4">
          {!shareLink ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create a shareable link</p>
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can view your closet
                </p>
              </div>
              <Button onClick={handleGenerateLink} className="gradient-rose text-primary-foreground">
                Generate Link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="bg-muted"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareLink, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateLink}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Media Sharing */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Share on Social Media</Label>
        <div className="grid grid-cols-3 gap-3">
          {socialPlatforms.map((platform) => (
            <motion.button
              key={platform.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSocialShare(platform.name)}
              className="p-4 rounded-xl border hover:shadow-md transition-all text-center"
            >
              <div className={`w-10 h-10 mx-auto rounded-full ${platform.color} flex items-center justify-center mb-2`}>
                <platform.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-medium text-sm">{platform.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{platform.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Other Share Options */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Other Options</Label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleEmailShare}
            className="p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Email</p>
              <p className="text-xs text-muted-foreground">Send via email</p>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handlePrint}
            className="p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3"
          >
            <div className="p-2 bg-gray-500/10 rounded-lg">
              <Printer className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Print</p>
              <p className="text-xs text-muted-foreground">Print-friendly view</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Example Downloads */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h4 className="font-medium mb-2">Example Downloads</h4>
        <p className="text-sm text-muted-foreground mb-3">
          See what exported files look like:
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled>
            Sample PDF
          </Button>
          <Button variant="outline" size="sm" disabled>
            Sample CSV
          </Button>
          <Button variant="outline" size="sm" disabled>
            Sample iCal
          </Button>
        </div>
      </div>
    </div>
  );
}
