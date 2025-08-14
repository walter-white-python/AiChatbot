import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Moon, 
  Sun, 
  Settings, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;
  
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 text-muted-foreground">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
        <span className="ml-2 text-sm">AI is thinking...</span>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex gap-3 p-4 message-enter", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-primary/10"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col", isUser && "items-end")}>
        <div className={cn(
          "max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl px-4 py-2 text-sm",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// Load messages from localStorage
const loadMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem('chatbot-messages');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
  
  return [
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. 🤖\n\nCurrently running in demo mode. To unlock real AI conversations, configure an API key in your .env file - check SETUP.md for instructions!\n\n🚀 **Try asking me about:**\n• "How do I set up API keys?"\n• "What can this chatbot do?"\n• Or just say hello!',
      role: 'assistant',
      timestamp: new Date()
    }
  ];
};

// Save messages to localStorage
const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem('chatbot-messages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export default function ChatbotApp() {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessages(messages);
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const clearMessages = () => {
    const newMessages: Message[] = [
      {
        id: Date.now().toString(),
        content: 'Chat cleared! 🧾\n\nI\'m your AI assistant running in demo mode. To enable real AI conversations, check SETUP.md for API configuration instructions.\n\nWhat would you like to chat about?',
        role: 'assistant',
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
  };

  const getAIResponse = async (conversation: Message[]): Promise<string> => {
    try {
      // Convert our Message format to the API's expected format
      const apiMessages = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // First try the health endpoint to see if API is available
      const healthCheck = await fetch('/api/health').catch(() => null);
      
      if (!healthCheck || !healthCheck.ok) {
        // API not available, use intelligent demo responses
        return getDemoResponse(conversation[conversation.length - 1]?.content || '');
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1000
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.message.content || 'Sorry, I encountered an error processing your request.';
      
    } catch (error) {
      console.error('Error calling chat API:', error);
      // Fallback to demo response
      return getDemoResponse(conversation[conversation.length - 1]?.content || '');
    }
  };
  
  const getDemoResponse = (userMessage: string): string => {
    // Simulate some thinking time
    const responses = [
      "Thanks for trying out this AI chatbot! This is a demo response since no API keys are configured. To get real AI responses, add your OpenAI or Anthropic API key to the environment variables.",
      "Hello! I'm running in demo mode right now. To enable real AI conversations, check the SETUP.md file for instructions on configuring your API keys.",
      "Great question! This chatbot supports OpenAI (GPT-3.5, GPT-4) and Anthropic (Claude) APIs. Add your API key to the .env file to unlock real AI responses.",
      "I'd love to help with that! Right now I'm showing demo responses. For full AI functionality, set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment variables.",
      "Interesting topic! To get actual AI insights, configure an API key from OpenAI or Anthropic in your deployment settings."
    ];
    
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! 👋 I'm currently in demo mode. To chat with real AI, add your API key to the .env file and restart the server. Check SETUP.md for detailed instructions!";
    }
    
    if (message.includes('help') || message.includes('how')) {
      return "I'd be happy to help! 🚀 Right now I'm showing demo responses. To unlock real AI capabilities:\n\n1. Get an API key from OpenAI or Anthropic\n2. Add it to your .env file as OPENAI_API_KEY or ANTHROPIC_API_KEY\n3. Restart the development server\n\nCheck SETUP.md for detailed instructions!";
    }
    
    if (message.includes('api') || message.includes('key') || message.includes('setup')) {
      return "To set up real AI responses:\n\n📋 **Quick Setup:**\n1. Copy .env.example to .env\n2. Add your API key:\n   - OPENAI_API_KEY=sk-your-key-here\n   - or ANTHROPIC_API_KEY=your-key-here\n3. Restart with \`bun dev\`\n\n📚 See SETUP.md for complete instructions!";
    }
    
    if (message.includes('what') && (message.includes('you') || message.includes('chatbot'))) {
      return "I'm an AI chatbot built with React and TypeScript! 🤖\n\n✨ **Features:**\n• Modern ChatGPT-like interface\n• Dark/light theme toggle\n• Message persistence\n• Real AI integration (when configured)\n\nCurrently in demo mode - configure an API key to unlock real AI conversations!";
    }
    
    // Add some variety to responses
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Occasionally add helpful hints
    if (Math.random() < 0.3) {
      return randomResponse + "\n\n💡 **Tip:** Check the SETUP.md file for step-by-step API configuration instructions!";
    }
    
    return randomResponse;
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse([...messages, userMessage]);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Chatbot</h1>
              <p className="text-sm text-muted-foreground">Powered by Advanced AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="h-9 w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full chat-scroll" ref={scrollAreaRef}>
            <div className="flex flex-col">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <TypingIndicator isVisible={isLoading} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here... (Press Enter to send)"
                disabled={isLoading}
                className="h-12 resize-none border-0 bg-muted px-4 py-3 focus-visible:ring-1"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>AI can make mistakes. Consider checking important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
