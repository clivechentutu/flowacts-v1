import { StoryEvent } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
}

export function ChatPanel({ events, onSendMessage, persona }: ChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
      {/* Header */}
      <div className="p-6 border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg leading-tight">Upliftly AI</h2>
            <p className="text-xs text-muted-foreground">Collaborative Analysis</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex gap-3">
             <Avatar className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <AvatarFallback><Sparkles className="w-4 h-4" /></AvatarFallback>
             </Avatar>
             <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none text-sm text-foreground/80 leading-relaxed max-w-[90%]">
                Hello! I'm ready to help you analyze your user experience. What shall we test today?
             </div>
          </div>

          {events.filter(e => ['user', 'ai'].includes(e.type)).map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.type === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className={cn(
                "h-8 w-8 rounded-lg border",
                msg.type === 'user' ? "bg-slate-900 text-white" : "bg-primary/10 text-primary border-primary/20"
              )}>
                {msg.type === 'user' ? (
                   <AvatarFallback className="bg-slate-900 text-white"><User className="w-4 h-4" /></AvatarFallback>
                ) : (
                   <AvatarFallback><Sparkles className="w-4 h-4" /></AvatarFallback>
                )}
              </Avatar>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm",
                msg.type === 'user' 
                  ? "bg-slate-900 text-slate-50 rounded-tr-none" 
                  : "bg-white border border-border rounded-tl-none text-foreground"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator if waiting */}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Upliftly to analyze a flow..." 
            className="pr-12 py-6 bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-xl"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-2 top-2 h-8 w-8 rounded-lg"
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="mt-2 flex justify-between items-center px-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/50">Active Persona: {persona}</span>
        </div>
      </div>
    </div>
  );
}
