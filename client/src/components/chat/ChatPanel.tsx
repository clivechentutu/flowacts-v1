import { StoryEvent, ThinkingStep, AgentAction, GeneratedFile } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, Sparkles, User, Paperclip, Globe, Plus, FileText, Share2, 
  Zap, Brain, AtSign, ChevronDown, ChevronUp, CheckCircle2, 
  Loader2, Scan, MousePointerClick, Check, Download, File, 
  Terminal, Search, LayoutTemplate, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
}

function ThinkingProcess({ steps }: { steps: ThinkingStep[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const activeStep = steps.find(s => s.status === 'active');
  const isAllComplete = steps.every(s => s.status === 'complete');

  if (!steps || steps.length === 0) return null;

  return (
    <div className="my-4 rounded-lg border border-border/60 bg-muted/20 overflow-hidden w-full font-mono text-xs">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 transition-colors",
          isOpen ? "bg-muted/30" : "hover:bg-muted/30"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-md shadow-sm transition-all", 
            activeStep ? "bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/20" : 
            isAllComplete ? "bg-green-500/10 text-green-500 ring-1 ring-green-500/20" : "bg-muted text-muted-foreground"
          )}>
            {activeStep ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
          </div>
          <div className="flex flex-col items-start gap-0.5">
             <span className={cn("font-semibold tracking-tight", activeStep ? "text-indigo-500" : "text-foreground/80")}>
               {activeStep ? "Thinking Process" : "Thought Chain"}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {activeStep && (
             <span className="text-[10px] text-indigo-500/80 animate-pulse font-medium uppercase tracking-wider">Processing</span>
           )}
           {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
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
            <div className="px-4 py-3 space-y-3 bg-background/30 relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[1.35rem] top-4 bottom-4 w-px bg-border/40" />
              
              {steps.map((step, idx) => (
                <div key={step.id} className="relative flex items-start gap-3 group">
                  <div className={cn(
                    "relative z-10 w-2.5 h-2.5 rounded-full border-2 mt-0.5 shrink-0 transition-colors bg-background",
                    step.status === 'complete' ? "border-green-500/50 bg-green-500/10" : 
                    step.status === 'active' ? "border-indigo-500 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : 
                    "border-muted-foreground/20"
                  )} />
                  
                  <div className="flex-1 min-w-0 -mt-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                       <span className={cn(
                         "leading-snug transition-colors", 
                         step.status === 'active' ? "text-indigo-400" : 
                         step.status === 'complete' ? "text-muted-foreground" : "text-muted-foreground/50"
                       )}>
                         {step.content}
                       </span>
                       {step.duration && (
                         <span className="text-[9px] text-muted-foreground/40 font-mono shrink-0">
                           {step.duration}
                         </span>
                       )}
                    </div>
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
      default: return <Terminal className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="my-4 space-y-2">
      <div className="flex items-center gap-2 px-1">
         <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Agent Activity</span>
         <div className="h-px bg-border/60 flex-1" />
      </div>
      
      <div className="grid gap-2">
        {actions.map((action) => (
          <div 
            key={action.id} 
            className={cn(
              "group relative flex items-start gap-3 p-3 rounded-lg border text-xs transition-all",
              action.status === 'running' 
                ? "bg-blue-500/5 border-blue-500/20 shadow-sm" 
                : "bg-card hover:bg-muted/30 border-border/50"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-md shrink-0 border shadow-sm mt-0.5", 
              action.status === 'running' ? "bg-background text-blue-500 border-blue-200" : "bg-muted/50 text-muted-foreground border-border/50"
            )}>
              {action.status === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : getIcon(action.type)}
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className={cn("font-medium", action.status === 'running' ? "text-blue-600" : "text-foreground")}>
                  {action.description}
                </span>
                {action.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500/60" />}
              </div>
              
              {action.result && (
                <div className="font-mono text-[10px] text-muted-foreground/80 bg-muted/30 px-2 py-1 rounded border border-border/30 inline-block max-w-full truncate">
                  <span className="text-muted-foreground/50 mr-1">$</span>
                  {action.result}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtifactDelivery({ file }: { file: GeneratedFile }) {
  return (
    <div className="mt-4 group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 hover:to-muted/40 transition-all shadow-sm hover:shadow-md">
       <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
       
       <div className="relative p-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-105 transition-transform">
             <FileText className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0 space-y-1">
             <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-foreground truncate">{file.name}</h4>
                <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
                   Ready
                </span>
             </div>
             <p className="text-xs text-muted-foreground">Generated comprehensive analysis report</p>
             
             <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 mt-2 font-mono">
                <span>{file.type.toUpperCase()}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{file.size}</span>
             </div>
          </div>

          <Button size="sm" className="shrink-0 gap-2 shadow-sm" variant="outline">
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
    <div className="flex flex-col h-full bg-background border-r border-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between gap-2">
          {/* Task Title Area */}
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="font-heading font-bold text-sm leading-tight text-foreground truncate">Competitor Onboarding Analysis</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Agent Active</p>
            </div>
          </div>
          
          {/* Icons Area */}
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="New Chat">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="Materials">
              <LayoutTemplate className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col min-h-full pb-6">
          <div className="flex gap-4 px-6 py-8 hover:bg-muted/20 transition-colors border-b border-border/40">
             <Avatar className="h-9 w-9 mt-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-sm shrink-0">
                <AvatarFallback><Sparkles className="w-5 h-5" /></AvatarFallback>
             </Avatar>
             <div className="space-y-2 max-w-3xl">
                <div className="text-sm font-semibold text-foreground/80">Upliftly AI</div>
                <div className="text-sm text-foreground/90 leading-relaxed">
                  Hello! I'm ready to help you analyze your user experience. What shall we test today?
                </div>
             </div>
          </div>

          {events.filter(e => ['user', 'ai'].includes(e.type)).map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "group px-6 py-8 transition-colors border-b border-border/40",
                msg.type === 'user' ? "bg-muted/5" : "hover:bg-muted/20"
              )}
            >
              <div className={cn(
                "flex gap-4 max-w-3xl mx-auto",
                msg.type === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <Avatar className={cn(
                  "h-9 w-9 mt-0.5 rounded-lg border shadow-sm shrink-0",
                  msg.type === 'user' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {msg.type === 'user' ? (
                     <AvatarFallback className="bg-primary text-primary-foreground"><User className="w-5 h-5" /></AvatarFallback>
                  ) : (
                     <AvatarFallback><Sparkles className="w-5 h-5" /></AvatarFallback>
                  )}
                </Avatar>
                
                <div className={cn(
                  "flex-1 min-w-0 space-y-1",
                  msg.type === 'user' ? "text-right" : "text-left"
                )}>
                  <div className="text-sm font-semibold text-foreground/80 mb-1">
                    {msg.type === 'user' ? 'You' : 'Upliftly AI'}
                  </div>
                  
                  {msg.type === 'user' ? (
                     <div className="inline-block bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-5 py-3 text-sm leading-relaxed shadow-sm text-left">
                        {msg.content}
                     </div>
                  ) : (
                     <div className="space-y-4 w-full">
                        {msg.thoughts && <ThinkingProcess steps={msg.thoughts} />}
                        
                        {msg.agentActions && <ActionLog actions={msg.agentActions} />}

                        <div className="text-sm text-foreground/90 leading-relaxed markdown-prose">
                           {msg.content}
                        </div>

                        {msg.files && msg.files.map(f => <ArtifactDelivery key={f.id} file={f} />)}
                     </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border z-20">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex flex-col bg-muted/30 border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-sm"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Upliftly to analyze a flow..." 
            className="border-0 bg-transparent focus-visible:ring-0 shadow-none px-4 py-4 min-h-[56px] text-base text-foreground placeholder:text-muted-foreground/60"
          />
          
          <div className="flex justify-between items-center p-3 pt-0">
             <div className="flex gap-1.5">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  title="Attach"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="h-9 w-px bg-border/50 mx-1" />
                
                <div 
                   role="button"
                   onClick={() => setIsThinkingMode(!isThinkingMode)}
                   className={cn(
                     "h-9 px-3 rounded-lg flex items-center gap-2 cursor-pointer select-none transition-all border",
                     isThinkingMode 
                       ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600" 
                       : "bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground"
                   )}
                >
                   <Brain className="w-4 h-4" />
                   <span className="text-xs font-medium">Deep Think</span>
                   <div className={cn(
                      "w-2 h-2 rounded-full ml-1 transition-colors",
                      isThinkingMode ? "bg-indigo-500" : "bg-muted-foreground/30"
                   )} />
                </div>
             </div>
             
             <div className="flex gap-2">
                <Button 
                  type="submit" 
                  size="icon" 
                  className={cn(
                    "h-9 w-9 rounded-lg transition-all shadow-sm",
                    input.trim() 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-muted text-muted-foreground"
                  )}
                  disabled={!input.trim()}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
             </div>
          </div>
        </form>
        <div className="text-[10px] text-center text-muted-foreground/40 mt-3 font-medium">
           Upliftly AI can make mistakes. Please verify important information.
        </div>
      </div>
    </div>
  );
}