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

// Insight Message Component (L1)
function InsightMessage({ message }: { message: StoryEvent }) {
  const agentColors: Record<string, string> = {
    scout: "border-blue-400/50",
    capturer: "border-purple-400/50",
    analyst: "border-orange-400/50",
    comparator: "border-green-400/50",
    reporter: "border-pink-400/50",
  };
  const borderColor = agentColors[message.agentRole || ''] || "border-border";

  return (
    <div className={`relative px-4 py-3 my-2 rounded-lg bg-muted/10 border-l-2 ${borderColor}`}>
      {message.agentRole && <AgentLabel role={message.agentRole} />}
      <div className="text-sm text-foreground leading-relaxed mt-1.5 whitespace-pre-wrap">
        {message.content}
      </div>
      {message.canvasLinkId && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary cursor-pointer transition-colors">
          <span>📌</span>
          <span>→ {message.canvasCardTitle || "View in Canvas"}</span>
        </div>
      )}
    </div>
  );
}

// Progress Message Component (L2)
function ProgressMessage({ message }: { message: StoryEvent }) {
  const agentIcons: Record<string, string> = {
    scout: "🕵️",
    capturer: "📸",
    analyst: "📊",
    comparator: "⚖️",
    reporter: "📝",
  };
  const icon = agentIcons[message.agentRole || ''] || "🤖";

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 my-0.5">
      <span className="text-xs">{icon}</span>
      <span className="text-xs text-muted-foreground">
        {message.content}
      </span>
    </div>
  );
}

// Process Message Component (L3)
function ProcessMessage({ messages }: { messages: StoryEvent[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const agent = messages[0];
  const agentIcons: Record<string, string> = {
    scout: "🕵️",
    capturer: "📸",
    analyst: "📊",
    comparator: "⚖️",
    reporter: "📝",
  };
  const icon = agentIcons[agent.agentRole || ''] || "🤖";
  const agentName = agent.agentRole
    ? agent.agentRole.charAt(0).toUpperCase() + agent.agentRole.slice(1)
    : "AI";

  const hasActiveStep = messages.some(
    (m) => m.thoughtProcess?.steps?.some((s) => s.status === "active")
  );

  const allSteps = messages.flatMap(
    (m) => m.thoughtProcess?.steps || []
  );

  const expanded = isExpanded || hasActiveStep;
  const totalSteps = allSteps.length || messages.length;
  const doneSteps = allSteps.filter((s) => s.status === "done").length;

  return (
    <div className="px-4 py-1 my-0.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors w-full text-left"
      >
        <span>{expanded ? "▾" : "▸"}</span>
        <span>{icon}</span>
        <span>{agentName}</span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          {hasActiveStep
            ? "working..."
            : `${doneSteps} step${doneSteps !== 1 ? "s" : ""} completed`}
        </span>
      </button>

      {expanded && (
        <div className="mt-1.5 ml-6 pl-3 border-l border-border/30 space-y-1">
          {allSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                step.status === "done"
                  ? "bg-green-400/60"
                  : step.status === "active"
                  ? "bg-blue-400 animate-pulse"
                  : "bg-muted-foreground/20"
              )} />
              <span>{step.label}</span>
            </div>
          ))}
          {messages.map((m, i) => (
            <div key={i} className="text-xs text-muted-foreground/50 mt-1 italic">
              {m.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Default level helper
function getDefaultLevel(msg: StoryEvent) {
  if (msg.canvasLinkId) return "insight";
  if (msg.agentRole && ["analyst", "comparator", "reporter"].includes(msg.agentRole)) {
    return "insight";
  }
  if (msg.thoughtProcess) return "process";
  return "progress";
}

// Main List Renderer
function ChatMessageList({ messages }: { messages: StoryEvent[] }) {
    const rendered = [];
    let i = 0;
  
    while (i < messages.length) {
      const msg = messages[i];
      const prevMsg = i > 0 ? messages[i - 1] : null;
  
      // Phase divider
      if (msg.phase && msg.phase !== prevMsg?.phase) {
        rendered.push(
          <PhaseDivider key={`phase-${i}`} label={msg.phase} />
        );
      }
  
      // User message
      if (msg.role === "user") {
        rendered.push(
          <div key={msg.id} className="flex justify-end px-4 py-2">
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-primary/15 text-sm text-foreground leading-relaxed">
              {msg.content}
            </div>
          </div>
        );
        i++;
        continue;
      }
  
      // AI message — route by messageLevel
      const level = msg.messageLevel || getDefaultLevel(msg);
  
      if (level === "insight") {
        rendered.push(
          <InsightMessage key={msg.id} message={msg} />
        );
        i++;
      } else if (level === "progress") {
        rendered.push(
          <ProgressMessage key={msg.id} message={msg} />
        );
        i++;
      } else {
        // level === "process" — group consecutive L3 from same agent
        const group = [msg];
        while (
          i + 1 < messages.length &&
          messages[i + 1].role === "ai" &&
          (messages[i + 1].messageLevel || getDefaultLevel(messages[i + 1])) === "process" &&
          messages[i + 1].agentRole === msg.agentRole &&
          messages[i + 1].phase === msg.phase
        ) {
          i++;
          group.push(messages[i + 1]);
        }
        rendered.push(
          <ProcessMessage key={`proc-${msg.id}`} messages={group} />
        );
        i += group.length;
      }
    }
  
    return <div className="flex flex-col gap-0.5">{rendered}</div>;
}

// Suggestion Chips Component
function SuggestionChips({ chips, onSelect }: { chips: string[], onSelect: (chip: string) => void }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-border/40 bg-background/30">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onSelect(chip)}
          className="rounded-full px-3 py-1.5 text-xs bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-colors cursor-pointer"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

export function ChatPanel({ events, onSendMessage, persona }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [title, setTitle] = useState("Competitor Onboarding Analysis");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // Mock Task State
  const [taskState, setTaskState] = useState<'empty' | 'in_progress' | 'completed' | 'thinking'>('in_progress');

  const CHIPS_EMPTY = [
    "Analyze competitor.com signup flow",
    "Compare two products' pricing",
    "Audit my landing page UX",
  ];

  const CHIPS_IN_PROGRESS = [
    "Focus on the pricing page",
    "Skip to the signup flow",
    "Take a screenshot here",
  ];

  const CHIPS_COMPLETED = [
    "Compare with another competitor",
    "Generate a report",
    "Dig deeper into signup friction",
  ];

  const getCurrentChips = () => {
      switch (taskState) {
          case 'empty': return CHIPS_EMPTY;
          case 'in_progress': return CHIPS_IN_PROGRESS;
          case 'completed': return CHIPS_COMPLETED;
          default: return [];
      }
  };

  const getPlaceholder = () => {
    switch (taskState) {
      case "empty":
        return "Paste a URL or describe what you'd like to analyze...";
      case "in_progress":
        return "Ask a follow-up or redirect the analysis...";
      case "completed":
        return "Compare, dig deeper, or generate a report...";
      case "thinking":
        return "Type to redirect or wait for results...";
      default:
        return "Ask Upliftly to analyze a flow...";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
    
    // Cycle mock state for demo purposes if needed, or just keep in_progress
    // setTaskState(prev => prev === 'empty' ? 'in_progress' : prev === 'in_progress' ? 'completed' : 'empty');
  };

  const handleChipClick = (chip: string) => {
      onSendMessage(chip);
      // Optional: cycle state on chip click to show dynamic nature
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
        <ChatMessageList messages={events.filter(e => ['user', 'ai'].includes(e.type))} />
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-[var(--chat-background)] flex flex-col">
        <SuggestionChips chips={getCurrentChips()} onSelect={handleChipClick} />
        
        <div className="p-4 pt-2">
            <form 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-2"
            >
            {/* Input Row */}
            <div className="flex items-end gap-2 bg-muted/30 rounded-xl border border-border/50 px-3 py-2 focus-within:ring-1 focus-within:ring-primary/20 focus-within:shadow-sm transition-all duration-300">
                <TextareaAutosize
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholder()}
                    minRows={1}
                    maxRows={6}
                    className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground min-h-[24px] py-1"
                    data-testid="input-chat"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="h-7 w-7 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 mb-0.5"
                    disabled={!input.trim()}
                    title="Send message"
                >
                    <Send className="w-3.5 h-3.5" />
                </Button>
            </div>
            
            {/* Toolbar Row */}
            <div className="flex justify-between items-center px-1">
                <div className="flex gap-1">
                    <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                        title="Attach a file or screenshot"
                    >
                        <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                        title="Mention a specific agent"
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
                        title="Enter a URL to analyze"
                    >
                        <Globe className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
}
