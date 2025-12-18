import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatEmptyState } from '@/components/chat/ChatEmptyState';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Chat() {
  const isMobile = useIsMobile();
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isTyping,
    createNewConversation,
    deleteConversation,
    sendMessage,
    setMessageFeedback,
    regenerateResponse,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = () => {
    createNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const showSuggestions = !activeConversation || activeConversation.messages.length === 0;

  return (
    <div className="h-[100dvh] flex bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <ChatSidebar
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          onDelete={deleteConversation}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
          <ChatSidebar
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
            onDelete={deleteConversation}
          />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b border-border bg-card flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="min-w-[44px] min-h-[44px]"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          <span className="font-semibold text-foreground">Modesta AI</span>
          <ThemeToggle />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          <ChatHeader />
        </div>

        {/* Messages Area */}
        {showSuggestions && !isTyping ? (
          <ChatEmptyState />
        ) : (
          <ChatMessages
            messages={activeConversation?.messages || []}
            isTyping={isTyping}
            onFeedback={setMessageFeedback}
            onRegenerate={regenerateResponse}
            onQuickReply={handleQuickReply}
          />
        )}

        {/* Input - Fixed at bottom on mobile */}
        <div className="mt-auto">
          <ChatInput
            onSend={sendMessage}
            isTyping={isTyping}
            showSuggestions={showSuggestions}
          />
        </div>
      </div>
    </div>
  );
}
