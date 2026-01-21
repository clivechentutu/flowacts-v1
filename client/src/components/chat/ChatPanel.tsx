import { StoryEvent, ThinkingStep, AgentAction } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, Sparkles, User, Paperclip, Globe, Plus, FileText, Share2, 
  Zap, Brain, AtSign, ChevronDown, ChevronUp, CheckCircle2, 
  Loader2, Scan, MousePointerClick, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
}

function ThinkingProcess({ steps }: { steps: ThinkingStep[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mb-3 rounded-xl border border-border/50 bg-muted/30 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-indigo-500" />
          <span>Thought Process ({steps.length} steps)</span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-3 pt-0 space-y-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                  {step.status === 'complete' ? (
                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  ) : step.status === 'active' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500 mt-0.5 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className={cn(step.status === 'active' && "text-foreground font-medium")}>
                      {step.content}
                    </span>
                    {step.duration && <span className="ml-1.5 opacity-60 text-[10px] font-mono">{step.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionLog({ actions }: { actions: AgentAction[] }) {
  if (!actions || actions.length === 0) return null;

  const getIcon = (type: AgentAction['type']) => {
    switch (type) {
      case 'browser': return <Globe className="w-3.5 h-3.5" />;
      case 'analysis': return <Scan className="w-3.5 h-3.5" />;
      case 'input': return <MousePointerClick className="w-3.5 h-3.5" />;
      default: return <Zap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
      <div className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Agent Actions</div>
      {actions.map((action) => (
        <div key={action.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-card border border-border/50 shadow-sm text-xs">
          <div className={cn(
            "p-1.5 rounded-md shrink-0", 
            action.status === 'running' ? "bg-blue-500/10 text-blue-500 animate-pulse" : "bg-muted text-muted-foreground"
          )}>
            {action.status === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : getIcon(action.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">{action.description}</div>
            {action.result && <div className="text-[10px] text-muted-foreground truncate mt-0.5">{action.result}</div>}
          </div>
          {action.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

export function ChatPanel({ events, onSendMessage, persona }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Task Title Area - approx 4/7 width */}
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="font-heading font-bold text-sm leading-tight text-foreground truncate">Competitor Onboarding Analysis</h2>
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
             <Avatar className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
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
                "h-8 w-8 rounded-lg border",
                msg.type === 'user' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border-primary/20"
              )}>
                {msg.type === 'user' ? (
                   <AvatarFallback className="bg-primary text-primary-foreground"><User className="w-4 h-4" /></AvatarFallback>
                ) : (
                   <AvatarFallback><Sparkles className="w-4 h-4" /></AvatarFallback>
                )}
              </Avatar>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm",
                msg.type === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-card border border-border rounded-tl-none text-foreground"
              )}>
                {msg.type === 'ai' && msg.thoughts && <ThinkingProcess steps={msg.thoughts} />}
                {msg.content}
                {msg.type === 'ai' && msg.agentActions && <ActionLog actions={msg.agentActions} />}
              </div>
            </div>
          ))}
          
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex flex-col bg-muted/30 border border-border/50 rounded-xl focus-within:ring-1 focus-within:ring-primary/20 transition-all"
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
