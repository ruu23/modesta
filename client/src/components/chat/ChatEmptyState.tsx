import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Palette, Shirt, Calendar } from 'lucide-react';
import { ChatIllustration } from '@/components/ui/Illustrations';

const suggestions = [
  { icon: Palette, text: 'Create an outfit for a special occasion' },
  { icon: Shirt, text: 'Help me organize my wardrobe' },
  { icon: Calendar, text: 'Plan outfits for the week' },
];

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <ChatIllustration className="mb-6" />
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-foreground mb-2"
      >
        Hi! I'm Modesta AI ✨
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-md mb-8"
      >
        Your personal AI stylist. I can help you create outfits, 
        plan your wardrobe, and give you fashion advice tailored to your style.
      </motion.p>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-2 mb-8"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Try asking:</p>
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="w-full p-3 text-left rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <suggestion.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-foreground">{suggestion.text}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-4 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Available 24/7</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>Quick responses</span>
        </div>
      </motion.div>
    </div>
  );
}
