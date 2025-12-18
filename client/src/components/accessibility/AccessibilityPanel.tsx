import { motion } from 'framer-motion';
import { 
  Eye, 
  Type, 
  Zap, 
  Keyboard, 
  Volume2, 
  Focus,
  Contrast,
  MousePointer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAccessibility, AccessibilitySettings } from './AccessibilityProvider';
import { Separator } from '@/components/ui/separator';

export function AccessibilityPanel() {
  const { settings, updateSettings } = useAccessibility();

  const sections = [
    {
      title: 'Visual',
      icon: Eye,
      items: [
        {
          id: 'highContrast',
          label: 'High Contrast Mode',
          description: 'Increases color contrast for better visibility',
          icon: Contrast,
          type: 'switch' as const,
          value: settings.highContrast,
          onChange: (value: boolean) => updateSettings({ highContrast: value }),
        },
        {
          id: 'fontSize',
          label: 'Text Size',
          description: 'Adjust the size of text throughout the app',
          icon: Type,
          type: 'radio' as const,
          value: settings.fontSize,
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'large', label: 'Large' },
            { value: 'extra-large', label: 'Extra Large' },
          ],
          onChange: (value: string) => updateSettings({ fontSize: value as AccessibilitySettings['fontSize'] }),
        },
        {
          id: 'focusIndicators',
          label: 'Enhanced Focus Indicators',
          description: 'Show prominent outlines when navigating with keyboard',
          icon: Focus,
          type: 'switch' as const,
          value: settings.focusIndicators,
          onChange: (value: boolean) => updateSettings({ focusIndicators: value }),
        },
      ],
    },
    {
      title: 'Motion',
      icon: Zap,
      items: [
        {
          id: 'reducedMotion',
          label: 'Reduce Motion',
          description: 'Minimize animations and transitions',
          icon: MousePointer,
          type: 'switch' as const,
          value: settings.reducedMotion,
          onChange: (value: boolean) => updateSettings({ reducedMotion: value }),
        },
      ],
    },
    {
      title: 'Interaction',
      icon: Keyboard,
      items: [
        {
          id: 'keyboardShortcuts',
          label: 'Keyboard Shortcuts',
          description: 'Enable keyboard shortcuts for quick navigation',
          icon: Keyboard,
          type: 'switch' as const,
          value: settings.keyboardShortcuts,
          onChange: (value: boolean) => updateSettings({ keyboardShortcuts: value }),
        },
        {
          id: 'screenReaderAnnouncements',
          label: 'Screen Reader Announcements',
          description: 'Announce dynamic content changes',
          icon: Volume2,
          type: 'switch' as const,
          value: settings.screenReaderAnnouncements,
          onChange: (value: boolean) => updateSettings({ screenReaderAnnouncements: value }),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Accessibility</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the app to work best for you
        </p>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription>Quick navigation using your keyboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <ShortcutItem keys={['/', 'Ctrl+K']} description="Search" />
            <ShortcutItem keys={['Esc']} description="Close modal/menu" />
            <ShortcutItem keys={['Tab']} description="Navigate forward" />
            <ShortcutItem keys={['Shift+Tab']} description="Navigate backward" />
            <ShortcutItem keys={['Enter', 'Space']} description="Activate button" />
            <ShortcutItem keys={['Arrow keys']} description="Navigate lists" />
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {sections.map((section, sectionIndex) => (
        <Card key={section.title}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <section.icon className="w-4 h-4" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={item.id}>
                {itemIndex > 0 && <Separator className="my-4" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {item.type === 'switch' && (
                    <Switch
                      id={item.id}
                      checked={item.value as boolean}
                      onCheckedChange={item.onChange as (value: boolean) => void}
                      aria-describedby={`${item.id}-description`}
                    />
                  )}
                </div>
                
                {item.type === 'radio' && (
                  <RadioGroup
                    value={item.value as string}
                    onValueChange={item.onChange as (value: string) => void}
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label={item.label}
                  >
                    {item.options?.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <RadioGroupItem
                          value={option.value}
                          id={`${item.id}-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`${item.id}-${option.value}`}
                          className="px-3 py-1.5 text-sm rounded-lg border border-input bg-background cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary transition-colors"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Preview Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>See how your settings affect the interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
            <h3 className="text-lg font-semibold">Sample Heading</h3>
            <p className="text-sm text-muted-foreground">
              This is sample text to preview your accessibility settings. 
              Adjust the options above to see how they affect readability.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Sample Button
              </button>
              <button className="px-4 py-2 border border-input bg-background rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Secondary
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            {i > 0 && <span className="text-muted-foreground mx-1">or</span>}
            <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">{key}</kbd>
          </span>
        ))}
      </div>
    </div>
  );
}
