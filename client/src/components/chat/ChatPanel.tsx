import { StoryEvent } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Sparkles, 
  User, 
  Paperclip, 
  Globe, 
  Plus, 
  FileText, 
  Share2, 
  Zap, 
  Brain, 
  AtSign,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
}

function AIMessageContent({ msg }: { msg: StoryEvent }) {
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);

  if (msg.type !== 'ai') return <>{msg.content}</>;

  const hasThinking = !!msg.thinking;
  const hasActions = !!msg.actions && msg.actions.length > 0;

  if (!hasThinking && !hasActions) return <>{msg.content}</>;

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Thinking Section */}
      {hasThinking && (
         <div className="mb-3">
             <button 
                onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/70 hover:text-primary/70 transition-colors select-none mb-2 bg-muted/50 px-2 py-1 rounded-md w-fit"
             >
                <Brain className="w-3 h-3" />
                <span>Thought Process</span>
                {isThinkingOpen ? <ChevronDown className="w-3 h-3 opacity-50" /> : <ChevronRight className="w-3 h-3 opacity-50" />}
             </button>
             
             {isThinkingOpen && (
                <div className="pl-3 border-l-2 border-primary/20 ml-1 mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-xs text-muted-foreground/80 italic leading-relaxed">
                        {msg.thinking}
                    </p>
                </div>
             )}
         </div>
      )}
      
      {/* Actions Section */}
      {hasActions && (
         <div className="space-y-1.5 mb-3">
             {msg.actions?.map((action, idx) => (
                 <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-2.5 py-1.5 rounded-md border border-border/40">
                     <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                         <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                     </div>
                     <span>{action}</span>
                 </div>
             ))}
         </div>
      )}
      
      {/* Final Response */}
      <div className="text-sm leading-relaxed text-foreground">
          {msg.content}
      </div>
    </div>
  );
}

export function ChatPanel({ events, onSendMessage, persona }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [title, setTitle] = useState("Competitor Onboarding Analysis");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleTitleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--chat-background)] border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
      {/* Header */}
      <div className="p-4 border-b border-border bg-[var(--chat-background)]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Task Title Area - approx 4/7 width */}
          <div className="flex-1 min-w-0 pr-2">
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleSubmit}
                onBlur={() => setIsEditingTitle(false)}
                className="h-7 py-0 px-2 text-sm font-bold bg-muted/50 border-primary/20 focus-visible:ring-1 focus-visible:ring-primary/30"
                autoFocus
              />
            ) : (
              <h2 
                className="font-heading font-bold text-sm leading-tight text-foreground truncate cursor-pointer hover:text-primary transition-colors flex items-center gap-1 group/title"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </h2>
            )}
            <p className="text-[10px] text-muted-foreground truncate">Last edited 2m ago</p>
          </div>
          
          {/* Icons Area */}
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="New Chat">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="Materials">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex gap-3">
             <Avatar className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                <AvatarFallback><Sparkles className="w-4 h-4" /></AvatarFallback>
             </Avatar>
             <div className="bg-muted p-4 rounded-2xl rounded-tl-none text-sm text-foreground/90 leading-relaxed max-w-[90%]">
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
                "h-8 w-8 rounded-lg border shrink-0",
                msg.type === 'user' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border-primary/20"
              )}>
                {msg.type === 'user' ? (
                   <AvatarFallback className="bg-primary text-primary-foreground"><User className="w-4 h-4" /></AvatarFallback>
                ) : (
                   <AvatarFallback><Sparkles className="w-4 h-4" /></AvatarFallback>
                )}
              </Avatar>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm overflow-hidden",
                msg.type === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-card border border-border rounded-tl-none"
              )}>
                <AIMessageContent msg={msg} />
              </div>
            </div>
          ))}
          
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-[var(--chat-background)]">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex flex-col bg-background border border-border shadow-sm rounded-xl focus-within:ring-1 focus-within:ring-primary/20 focus-within:shadow-md transition-all duration-300"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Upliftly to analyze a flow..." 
            className="border-0 bg-transparent focus-visible:ring-0 shadow-none px-4 py-3 min-h-[48px] text-foreground placeholder:text-muted-foreground"
          />
          
          <div className="flex justify-between items-center p-2 pt-0">
             <div className="flex gap-1">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  title="Attach"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  title="Call Roles"
                >
                  <AtSign className="w-4 h-4" />
                </Button>
                
                <div 
                   role="button"
                   onClick={() => setIsThinkingMode(!isThinkingMode)}
                   className="h-8 bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-lg p-0.5 flex items-center relative cursor-pointer select-none ml-1"
                   title={isThinkingMode ? "Switch to Fast Mode" : "Switch to Thinking Mode"}
                >
                   {/* Active Indicator Background */}
                   <div 
                      className={cn(
                        "absolute top-0.5 bottom-0.5 w-[28px] bg-background shadow-sm border border-border/40 rounded-[6px] transition-all duration-300 ease-out",
                        isThinkingMode ? "translate-x-[28px]" : "translate-x-0"
                      )} 
                   />
                   
                   {/* Fast Icon */}
                   <div className={cn(
                      "w-7 h-full flex items-center justify-center relative z-10 transition-colors duration-300",
                      !isThinkingMode ? "text-amber-500" : "text-muted-foreground/60"
                   )}>
                      <Zap className={cn("w-3.5 h-3.5", !isThinkingMode && "fill-current")} />
                   </div>
                   
                   {/* Thinking Icon */}
                   <div className={cn(
                      "w-7 h-full flex items-center justify-center relative z-10 transition-colors duration-300",
                      isThinkingMode ? "text-indigo-500" : "text-muted-foreground/60"
                   )}>
                      <Brain className="w-3.5 h-3.5" />
                   </div>
                </div>
             </div>
             
             <div className="flex gap-1">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  title="Search"
                >
                  <Globe className="w-4 h-4" />
                </Button>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  disabled={!input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
