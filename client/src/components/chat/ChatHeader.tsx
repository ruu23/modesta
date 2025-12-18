import { Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatHeader() {
  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {/* AI Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full gradient-rose flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
        </div>
        
        <div>
          <h2 className="font-semibold text-foreground">Modesta AI</h2>
          <p className="text-xs text-muted-foreground">Online and ready to style you ✨</p>
        </div>
      </div>

      <Button variant="ghost" size="icon">
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  );
}
