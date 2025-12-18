import { useState, useEffect, useRef } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RefreshCw, 
  ExternalLink,
  Calendar,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types/chat';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onFeedback: (messageId: string, feedback: 'up' | 'down') => void;
  onRegenerate: (messageId: string) => void;
  onQuickReply: (reply: string) => void;
}

export function ChatMessages({
  messages,
  isTyping,
  onFeedback,
  onRegenerate,
  onQuickReply,
}: ChatMessagesProps) {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  const addToCalendar = () => {
    toast({ title: 'Added to calendar!', description: 'Outfit reminder set.' });
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
            {/* Message Bubble */}
            <div
              className={`rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'gradient-rose text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border text-foreground rounded-bl-md shadow-soft'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>

              {/* Outfit Card */}
              {message.type === 'outfit' && message.outfitData && (
                <div className="mt-3 rounded-xl overflow-hidden bg-muted/50 border border-border">
                  <img
                    src={message.outfitData.image}
                    alt={message.outfitData.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-foreground">{message.outfitData.name}</h4>
                    <div className="flex gap-2 mt-2">
                      {message.outfitData.items.map((item, i) => (
                        <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-border">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <Button size="sm" className="w-full mt-3" variant="outline">
                      View Full Outfit
                    </Button>
                  </div>
                </div>
              )}

              {/* Item Recommendations */}
              {message.type === 'items' && message.itemsData && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {message.itemsData.map((item, i) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-muted/50 border border-border">
                      <img src={item.image} alt={item.name} className="w-full h-20 object-cover" />
                      <div className="p-2">
                        <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-primary font-semibold">{item.price}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Calendar Event */}
              {message.type === 'calendar' && message.calendarEvent && (
                <div className="mt-3 p-3 rounded-xl bg-accent/50 border border-accent">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{message.calendarEvent.title}</h4>
                      <p className="text-xs text-muted-foreground">{message.calendarEvent.date}</p>
                      <p className="text-xs text-muted-foreground mt-1">{message.calendarEvent.outfit}</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3" onClick={addToCalendar}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              )}

              {/* Quick Replies */}
              {message.quickReplies && message.role === 'assistant' && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => onQuickReply(reply)}
                      className="px-3 py-1.5 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <p className={`text-xs text-muted-foreground mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              {format(new Date(message.timestamp), 'h:mm a')}
            </p>

            {/* AI Message Actions */}
            {message.role === 'assistant' && (
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => onFeedback(message.id, 'up')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    message.feedback === 'up'
                      ? 'bg-green-500/20 text-green-600'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onFeedback(message.id, 'down')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    message.feedback === 'down'
                      ? 'bg-red-500/20 text-red-600'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => copyToClipboard(message.content, message.id)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  {copiedId === message.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onRegenerate(message.id)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">Stylist is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
