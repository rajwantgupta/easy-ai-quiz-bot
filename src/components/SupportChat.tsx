
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { ChatIcon, Send } from "@/components/ui/icons";

type Message = {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: string;
};

const SupportChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Simulate getting chat history
  useEffect(() => {
    if (open && user) {
      // Get chat history from localStorage
      const chatHistory = localStorage.getItem(`chat_history_${user.id}`);
      if (chatHistory) {
        setMessages(JSON.parse(chatHistory));
      } else {
        // Add welcome message if no history
        const welcomeMessage: Message = {
          id: "welcome",
          sender: "support",
          text: "Hello! How can we help you today?",
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(`chat_history_${user.id}`, JSON.stringify([welcomeMessage]));
      }
    }
  }, [open, user]);
  
  const handleSendMessage = () => {
    if (!input.trim() || !user) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(updatedMessages));
    setInput("");
    
    // Simulate support response after delay
    setTimeout(() => {
      const supportResponses = [
        "Thank you for your message! Our team will get back to you shortly.",
        "I understand your concern. Let me check that for you.",
        "Thanks for reaching out! We're here to help with your questions.",
        "I'm looking into this for you right away.",
        "Could you please provide more details so we can better assist you?"
      ];
      
      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      
      const supportMessage: Message = {
        id: `support-${Date.now()}`,
        sender: "support",
        text: randomResponse,
        timestamp: new Date().toISOString()
      };
      
      const withSupportResponse = [...updatedMessages, supportMessage];
      setMessages(withSupportResponse);
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(withSupportResponse));
    }, 1000);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!user) return null;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
          aria-label="Open support chat"
        >
          <ChatIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:w-[380px] flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Support Chat</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 text-right ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <SheetFooter className="p-4 border-t mt-auto">
          <div className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SupportChat;
