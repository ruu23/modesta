import { useState, useRef } from 'react';
import { Send, Smile, Image, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SUGGESTED_PROMPTS } from '@/types/chat';

interface ChatInputProps {
  onSend: (message: string) => void;
  isTyping: boolean;
  showSuggestions: boolean;
}

export function ChatInput({ onSend, isTyping, showSuggestions }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isTyping) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSend(prompt);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {/* Suggested Prompts */}
      {showSuggestions && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Try asking me...
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt.text)}
                className="text-left p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border hover:border-primary/30 transition-all group"
              >
                <span className="text-lg mr-2">{prompt.icon}</span>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {prompt.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about styling..."
            className="min-h-[48px] max-h-[150px] resize-none pr-24 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
            rows={1}
          />
          
          {/* Action Buttons inside textarea */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Image className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isTyping}
          className="h-12 w-12 rounded-xl gradient-rose text-primary-foreground border-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
