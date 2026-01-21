import { StoryEvent, ThinkingStep, AgentAction, GeneratedFile } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, Sparkles, User, Paperclip, Globe, Plus, FileText, Share2, 
  Zap, Brain, AtSign, ChevronDown, ChevronUp, CheckCircle2, 
  Loader2, Scan, MousePointerClick, Check, Download, File
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
}

function ThinkingProcess({ steps }: { steps: ThinkingStep[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const activeStep = steps.find(s => s.status === 'active');

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mb-3 rounded-xl border border-border/50 bg-background/50 overflow-hidden w-full max-w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={cn("relative flex h-2 w-2", activeStep ? "animate-pulse" : "")}>
             {activeStep && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
             <span className={cn("relative inline-flex rounded-full h-2 w-2", activeStep ? "bg-indigo-500" : "bg-indigo-500/50")}></span>
          </div>
          <span className={cn("uppercase tracking-wider text-[10px]", activeStep ? "text-indigo-500 font-semibold" : "")}>
            {activeStep ? "Thinking..." : "Thought Process"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-70">{steps.length} steps</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border/30 mt-1 pt-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-2.5 text-xs text-muted-foreground/80 group">
                  <div className="mt-0.5 shrink-0">
                    {step.status === 'complete' ? (
                      <div className="h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                         <Check className="w-2.5 h-2.5 text-green-500" />
                      </div>
                    ) : step.status === 'active' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "block leading-tight", 
                      step.status === 'active' && "text-foreground font-medium animate-pulse"
                    )}>
                      {step.content}
                    </span>
                    {step.duration && (
                      <span className="inline-block mt-1 text-[9px] font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground/70">
                        {step.duration}
                      </span>
                    )}
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
    <div className="mt-4 space-y-3 border-t border-border/40 pt-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
         <Zap className="w-3 h-3" />
         <span>Agent Actions</span>
      </div>
      <div className="space-y-2">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-background/50 border border-border/40 shadow-sm text-xs hover:bg-background/80 transition-colors">
            <div className={cn(
              "p-1.5 rounded-md shrink-0 border", 
              action.status === 'running' 
                ? "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse" 
                : "bg-muted/50 text-muted-foreground border-border/50"
            )}>
              {action.status === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : getIcon(action.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground truncate">{action.description}</div>
              {action.result && (
                <div className="text-[10px] text-muted-foreground truncate mt-0.5 font-mono opacity-80">
                  → {action.result}
                </div>
              )}
            </div>
            {action.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500/80 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtifactDelivery({ file }: { file: GeneratedFile }) {
  return (
    <div className="mt-4 p-0 rounded-xl border border-border bg-card overflow-hidden shadow-sm group hover:shadow-md transition-all">
       <div className="p-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-4 h-4" />
             </div>
             <div>
                <div className="text-xs font-semibold text-foreground">Comprehensive Report</div>
                <div className="text-[10px] text-muted-foreground">Generated from analysis</div>
             </div>
          </div>
          <div className="h-6 px-2 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium flex items-center border border-green-500/20">
             Ready
          </div>
       </div>
       <div className="p-3 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
             <div className="text-xs font-medium text-foreground truncate">{file.name}</div>
             <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{file.size}</span>
                <span>•</span>
                <span>{file.type.toUpperCase()}</span>
             </div>
          </div>
          <Button size="sm" variant="secondary" className="h-8 text-xs gap-2 shrink-0">
             <Download className="w-3.5 h-3.5" />
             Download
          </Button>
       </div>
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
                {msg.type === 'ai' && msg.files && msg.files.map(f => <ArtifactDelivery key={f.id} file={f} />)}
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
