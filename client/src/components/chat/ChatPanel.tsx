import { StoryEvent, ThoughtProcess } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { 
  Send, 
  Sparkles, 
  User, 
  Paperclip, 
  Globe, 
  Plus, 
  FileText, 
  History,
  Zap, 
  Brain, 
  AtSign,
  ChevronDown,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
}

// Phase Divider Component
function PhaseDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4 px-2">
      <div className="flex-1 h-px bg-border/50" />
      <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}

// Agent Label Component
function AgentLabel({ role }: { role: string }) {
  const agents: Record<string, { icon: string; name: string; color: string }> = {
    scout:      { icon: "🕵️", name: "Scout",      color: "text-blue-400" },
    capturer:   { icon: "📸", name: "Capturer",   color: "text-purple-400" },
    analyst:    { icon: "📊", name: "Analyst",    color: "text-orange-400" },
    comparator: { icon: "⚖️", name: "Comparator", color: "text-green-400" },
    reporter:   { icon: "📝", name: "Reporter",   color: "text-pink-400" },
  };
  const agent = agents[role] || agents.scout;

  return (
    <div className={`flex items-center gap-1.5 mb-1 ${agent.color}`}>
      <span className="text-sm">{agent.icon}</span>
      <span className="text-xs font-semibold">{agent.name}</span>
    </div>
  );
}

// Thought Process Component (Simplified)
function ThoughtProcessView({ steps }: { steps: NonNullable<ThoughtProcess['steps']> }) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="mt-2 mb-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
                <span className="text-muted-foreground/60">
                    {isExpanded ? "▾" : "▸"}
                </span>
                <span>What's happening</span>
            </button>

            {isExpanded && (
                <div className="mt-2 ml-3 pl-3 border-l-2 border-border/50 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                step.status === "done" ? "bg-green-400" :
                                step.status === "active" ? "bg-blue-400 animate-pulse" :
                                "bg-muted-foreground/30"
                            )} />
                            <span>{step.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


function AIMessageContent({ msg }: { msg: StoryEvent }) {
  if (msg.type !== 'ai') return <>{msg.content}</>;

  const hasLegacyThinking = !!msg.thinking;
  const hasLegacyActions = !!msg.actions && msg.actions.length > 0;
  const hasNewThoughtProcess = !!msg.thoughtProcess;

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Agent Role Label */}
      {msg.agentRole && <AgentLabel role={msg.agentRole} />}

      {/* New Structured Thought Process */}
      {hasNewThoughtProcess && msg.thoughtProcess && (
          <ThoughtProcessView steps={msg.thoughtProcess.steps} />
      )}

      {/* Legacy Thinking Section (Fallback) */}
      {hasLegacyThinking && !hasNewThoughtProcess && (
         <div className="mb-3">
             <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/70 mb-2 bg-muted/50 px-2 py-1 rounded-md w-fit">
                <Brain className="w-3 h-3" />
                <span>Legacy Thought Process</span>
             </div>
             <div className="pl-3 border-l-2 border-primary/20 ml-1 mb-3">
                 <p className="text-xs text-muted-foreground/80 italic leading-relaxed">
                     {msg.thinking}
                 </p>
             </div>
         </div>
      )}
      
      {/* Legacy Actions Section (Fallback) */}
      {hasLegacyActions && !hasNewThoughtProcess && (
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
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
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
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="History">
              <History className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" title="Materials">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {events.filter(e => ['user', 'ai'].includes(e.type)).map((msg, i, arr) => {
            const prevMsg = i > 0 ? arr[i-1] : null;
            const showDivider = msg.phase && msg.phase !== prevMsg?.phase;

            return (
                <React.Fragment key={msg.id}>
                    {showDivider && <PhaseDivider label={msg.phase!} />}
                    
                    <div 
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
                </React.Fragment>
            );
          })}
          
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-[var(--chat-background)]">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex flex-col bg-background border border-border shadow-sm rounded-xl focus-within:ring-1 focus-within:ring-primary/20 focus-within:shadow-md transition-all duration-300"
        >
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Upliftly to analyze a flow..."
            minRows={3}
            maxRows={6}
            className="w-full resize-none border-0 bg-transparent focus:outline-none shadow-none px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm leading-relaxed"
            data-testid="input-chat"
          />
          
          <div className="flex justify-between items-center px-2 pb-2">
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
