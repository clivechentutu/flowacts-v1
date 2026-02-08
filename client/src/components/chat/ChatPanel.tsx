import { StoryEvent, ThoughtProcess, TaskPlanStep } from "@/lib/mock-data";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatPanelProps {
  events: StoryEvent[];
  onSendMessage: (message: string) => void;
  persona: string;
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

// Message Actions Component
function MessageActions({ messageId, role }: { messageId: string, role: 'user' | 'ai' }) {
  const actions = role === "ai"
    ? [
        { icon: "📋", label: "Copy", tooltip: "Copy message" },
        { icon: "📌", label: "Pin", tooltip: "Pin to Canvas" },
        { icon: "🔄", label: "Retry", tooltip: "Retry this step" },
      ]
    : [
        { icon: "📋", label: "Copy", tooltip: "Copy message" },
        { icon: "✏️", label: "Edit", tooltip: "Edit message" },
      ];

  return (
    <div className={`absolute top-1 ${
      role === "ai" ? "right-2" : "left-2"
    } flex items-center gap-0.5 bg-background/90 backdrop-blur-sm
      border border-border/50 rounded-lg px-1 py-0.5 shadow-sm animate-in fade-in duration-200`}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          title={action.tooltip}
          onClick={() => console.log(action.label, messageId)}
          className="w-7 h-7 flex items-center justify-center
            rounded hover:bg-muted text-muted-foreground
            hover:text-foreground transition-colors text-xs"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

// Insight Message Component (L1)
function InsightMessage({ message, insideTimeline = false }: { message: StoryEvent, insideTimeline?: boolean }) {
  const agentColors: Record<string, string> = {
    scout: "border-blue-400/50",
    capturer: "border-purple-400/50",
    analyst: "border-orange-400/50",
    comparator: "border-green-400/50",
    reporter: "border-pink-400/50",
  };
  
  const [showActions, setShowActions] = useState(false);

  // Inside timeline: simplified card (no agent label, no left border)
  if (insideTimeline) {
    return (
      <div 
        className="group relative px-3.5 py-3 rounded-lg bg-muted/8 hover:bg-muted/15 transition-colors"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        {message.canvasLinkId && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary cursor-pointer transition-colors">
            <span>📌</span>
            <span>→ {message.canvasCardTitle || "View in Canvas"}</span>
          </div>
        )}
        
        {/* Hover action buttons */}
        {showActions && (
          <MessageActions messageId={message.id} role="ai" />
        )}
      </div>
    );
  }

  // Outside timeline (e.g., greeting): full card with agent label + left border
  const borderColor = agentColors[message.agentRole || ''] || "border-border";
  return (
    <div 
        className={`group relative px-4 py-3 my-2 rounded-lg bg-muted/10 border-l-2 ${borderColor} hover:bg-muted/20 transition-colors`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
    >
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

      {/* Hover action buttons */}
      {showActions && (
        <MessageActions messageId={message.id} role="ai" />
      )}
    </div>
  );
}

// Progress Message Component (L2)
function ProgressMessage({ message }: { message: StoryEvent }) {
  return (
    <div className="py-0.5">
      <span className="text-xs text-muted-foreground/60 leading-relaxed">
        {message.content}
      </span>
    </div>
  );
}

// Process Message Component (L3)
function ProcessMessage({ messages }: { messages: StoryEvent[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveStep = messages.some(
    (m) => m.thoughtProcess?.steps?.some((s) => s.status === "active")
  );

  const allSteps = messages.flatMap(
    (m) => m.thoughtProcess?.steps || []
  );

  const expanded = isExpanded || hasActiveStep;
  const doneSteps = allSteps.filter((s) => s.status === "done").length;

  return (
    <div className="py-0.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
      >
        <span className="text-[9px]">{expanded ? "▾" : "▸"}</span>
        <span>
          {hasActiveStep
            ? "working..."
            : `${doneSteps} step${doneSteps !== 1 ? "s" : ""} completed`}
        </span>
      </button>

      {expanded && (
        <div className="mt-1 ml-2.5 space-y-0.5">
          {allSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40">
              <span className={cn(
                "w-1 h-1 rounded-full shrink-0",
                step.status === "done"
                  ? "bg-muted-foreground/25"
                  : step.status === "active"
                  ? "bg-blue-400 animate-pulse"
                  : "bg-muted-foreground/15"
              )} />
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Default level helper
function getDefaultLevel(msg: StoryEvent) {
  if (msg.taskPlan) return "plan";
  if (msg.canvasLinkId) return "insight";
  if (msg.agentRole && ["analyst", "comparator", "reporter"].includes(msg.agentRole)) {
    return "insight";
  }
  // Scout/Capturer default logic
  if (msg.agentRole === 'scout' || msg.agentRole === 'capturer') {
     if (msg.thoughtProcess && !msg.thoughtProcess.steps.some(s => s.status === 'active')) {
         return "process"; // Default collapsed for finished processes
     }
     if (msg.content.includes("landed") || msg.content.includes("reached") || msg.content.includes("started")) {
         return "progress"; // Milestones
     }
     return "process"; // Everything else is process
  }
  
  if (msg.thoughtProcess) return "process";
  return "progress";
}

// Intent & Plan Card (Zone 1 - "Pre-positioned")
function IntentPlanCard({ intentSummary, steps }: { intentSummary: string, steps: TaskPlanStep[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const doneCount = steps.filter((s) => s.status === "done").length;

  return (
    <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden shadow-sm">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-primary/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Intent & Plan</span>
        </div>
        <div className="flex items-center gap-2">
             <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {doneCount} / {steps.length} Steps
             </span>
             <ChevronDown className={cn("w-4 h-4 text-muted-foreground/50 transition-transform duration-200", !isExpanded && "-rotate-90")} />
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
          <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
            {/* Intent Summary */}
            <div className="mb-4 text-xs text-muted-foreground leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/40">
                <span className="font-semibold text-primary/80 mr-1">Goal:</span>
                {intentSummary}
            </div>

            {/* Plan Steps */}
            <div className="space-y-1 relative pl-2">
                {/* Connecting Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/40" />
                
                {steps.map((step, i) => (
                    <div key={step.id} className="relative flex items-center gap-3 z-10">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0 ring-4 ring-background",
                            step.status === "done" ? "bg-primary" : 
                            step.status === "active" ? "bg-blue-400 animate-pulse" : "bg-muted-foreground/30"
                        )} />
                        <span className={cn(
                            "text-xs",
                            step.status === "done" ? "text-muted-foreground line-through decoration-border/50" : 
                            step.status === "active" ? "text-foreground font-medium" : "text-muted-foreground/60"
                        )}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
}

// Execution Card (Zone 2 - "Dynamic Process" with Result Penetration)
function ExecutionCard({ steps, stepMessages }: { steps: TaskPlanStep[]; stepMessages: Record<string, StoryEvent[]> }) {
  // State to track expanded steps
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Auto-expand active step on change
  const activeStep = steps.find(s => s.status === 'active');
  React.useEffect(() => {
      if (activeStep) {
          setExpandedIds(prev => {
              const next = new Set(prev);
              next.add(activeStep.id);
              return next;
          });
      }
  }, [activeStep?.id]);

  const toggleStep = (id: string) => {
    setExpandedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  const agentIcons: Record<string, string> = {
    scout: "🕵️", capturer: "📸", analyst: "📊",
    comparator: "⚖️", reporter: "📝",
  };

  const renderMessages = (msgs: StoryEvent[]) => {
      const results = msgs.filter(m => m.messageLevel === 'insight' || m.messageLevel === 'progress' || m.canvasLinkId);
      const logs = msgs.filter(m => !results.includes(m)); 

      return (
          <div className="space-y-3">
              {/* Results First */}
              {results.length > 0 && (
                  <div className="space-y-2">
                      {results.map(msg => (
                          <div key={msg.id}>
                              {msg.messageLevel === 'insight' ? (
                                  <InsightMessage message={msg} insideTimeline={true} />
                              ) : (
                                  <div className="text-xs text-foreground/80 bg-muted/10 p-2 rounded border border-border/20">
                                      {msg.content}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              )}

              {/* Logs / Process Details */}
              {logs.length > 0 && (
                  <div className="mt-2">
                       <details className="group" open={logs.some(l => l.thoughtProcess?.steps?.some(s => s.status === 'active'))}>
                           <summary className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer select-none list-none flex items-center gap-1.5">
                               <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90" />
                               <span>View process details ({logs.length})</span>
                           </summary>
                           <div className="mt-2 pl-4 space-y-1 border-l border-border/20 ml-1.5">
                               {logs.map((log) => (
                                   <div key={log.id} className="text-[10px] text-muted-foreground/60 font-mono">
                                       <span className="opacity-50 mr-1.5">
                                            {new Date(log.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                       </span>
                                       {log.content}
                                   </div>
                               ))}
                           </div>
                       </details>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="space-y-2">
        {steps.map((step) => {
            const isExpanded = expandedIds.has(step.id);
            const msgs = stepMessages[step.id] || [];
            // Check for insights to show in penetration zone
            const insights = msgs.filter(m => m.messageLevel === 'insight' || m.canvasLinkId);
            const hasInsights = insights.length > 0;
            // Use resultSummary or summary, fallback to first insight if needed?
            const summaryText = step.resultSummary || step.summary;

            return (
                <div key={step.id} className={cn(
                    "rounded-xl border transition-all duration-300 overflow-hidden",
                    step.status === 'active' 
                        ? "border-blue-500/30 bg-blue-500/5 shadow-sm ring-1 ring-blue-500/10" 
                        : "border-border/30 bg-card"
                )}>
                    {/* Header */}
                    <div 
                        className="flex flex-col cursor-pointer hover:bg-muted/5 transition-colors"
                        onClick={() => toggleStep(step.id)}
                    >
                        <div className="flex items-center gap-3 px-3 py-2.5">
                            {/* Status Icon */}
                            <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors",
                                step.status === 'done' ? "bg-green-500/10 text-green-600" :
                                step.status === 'active' ? "bg-blue-500/10 text-blue-600" :
                                "bg-muted text-muted-foreground/50"
                            )}>
                                {step.status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                 step.status === 'active' ? <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span></span> :
                                 <div className="w-2 h-2 rounded-full bg-current" />}
                            </div>

                            {/* Label & Agent */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className={cn(
                                    "text-sm font-medium truncate",
                                    step.status === 'done' ? "text-muted-foreground line-through decoration-border/40" : 
                                    step.status === 'active' ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                                )}>
                                    {step.label}
                                </span>
                                {step.status === 'active' && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-medium uppercase tracking-wide">
                                        {step.agentRole} Working
                                    </span>
                                )}
                            </div>

                            {/* Result Penetration (Header Summary) */}
                            {!isExpanded && summaryText && (
                                <span className="hidden sm:inline-block text-xs text-muted-foreground truncate max-w-[200px] bg-muted/10 px-2 py-0.5 rounded">
                                    {summaryText}
                                </span>
                            )}

                            <ChevronDown className={cn("w-4 h-4 text-muted-foreground/30 transition-transform duration-200 shrink-0", !isExpanded && "-rotate-90")} />
                        </div>

                        {/* Result Penetration (Insight Zone - visible when collapsed) */}
                        {!isExpanded && hasInsights && (
                            <div className="px-3 pb-2.5 pl-[3.25rem] animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="text-xs text-foreground/80 bg-blue-500/5 p-2 rounded-md border-l-2 border-blue-500/40 flex items-start gap-2">
                                    <span className="shrink-0 mt-0.5 text-[10px]">💡</span>
                                    <span className="line-clamp-2 leading-relaxed">
                                        {insights[0].content}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Expanded Body */}
                    {isExpanded && (
                        <div className="px-4 pb-4 pt-0 pl-[3.25rem] animate-in slide-in-from-top-2 duration-200 space-y-3 border-t border-border/5 mt-1 pt-3">
                             {/* Expanded Summary if available */}
                             {summaryText && (
                                <div className="text-sm text-foreground/90 font-medium border-l-2 border-primary/20 pl-3 py-1">
                                    {summaryText}
                                </div>
                             )}
                             {renderMessages(msgs)}
                        </div>
                    )}
                </div>
            );
        })}
    </div>
  );
}
  
// Main List Renderer
function ChatMessageList({ messages }: { messages: StoryEvent[] }) {
    // 1. Separate special messages from flow messages
    const taskPlanMsg = messages.find((m) => m.taskPlan);
    const taskPlanSteps = taskPlanMsg?.taskPlan || [];
  
    // 2. Group messages by taskPlanStepId
    const stepMessages: Record<string, StoryEvent[]> = {};
    taskPlanSteps.forEach((step) => {
      stepMessages[step.id] = [];
    });
  
    const preFlowMessages: StoryEvent[] = []; // Messages before the flow (greeting, user request, task plan)
  
    messages.forEach((msg) => {
      if (msg.taskPlan || msg.role === "user" || (!msg.taskPlanStepId && msg.messageLevel === "insight" && !taskPlanMsg)) {
        // If it's a task plan, we skip rendering it as a card, but we use it to define the timeline steps
        if (!msg.taskPlan) {
            preFlowMessages.push(msg);
        }
      } else if (msg.taskPlanStepId && stepMessages[msg.taskPlanStepId]) {
        stepMessages[msg.taskPlanStepId].push(msg);
      } else {
        // Fallback for messages not linked to a plan or before plan exists
        // Only if it's not a user message (already handled) and not the task plan itself
         if (!msg.taskPlan && msg.role !== 'user') {
             // Treat as pre-flow if no task plan exists yet, or put in preFlowMessages
             preFlowMessages.push(msg);
         }
      }
    });

    const renderedPreFlow = [];
    let i = 0;
    while(i < preFlowMessages.length) {
        const msg = preFlowMessages[i];
         // User message
         if (msg.role === "user") {
            renderedPreFlow.push(
              <div key={msg.id} className="flex justify-end px-4 py-2">
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-primary/15 text-sm text-foreground leading-relaxed">
                  {msg.content}
                </div>
              </div>
            );
            i++;
            continue;
          }

          // Unlinked messages
          const level = msg.messageLevel || getDefaultLevel(msg);
          if (level === "plan") {
             // Should not happen as we filtered it out above, but just in case
             i++;
          } else if (level === "insight") {
             renderedPreFlow.push(<InsightMessage key={msg.id} message={msg} insideTimeline={false} />);
             i++;
          } else if (level === "progress") {
             renderedPreFlow.push(<ProgressMessage key={msg.id} message={msg} />);
             i++;
          } else {
              // Process messages (unlinked)
               const group = [msg];
               while (
                i + 1 < preFlowMessages.length &&
                preFlowMessages[i + 1].role === "ai" &&
                (preFlowMessages[i + 1].messageLevel || getDefaultLevel(preFlowMessages[i + 1])) === "process" &&
                preFlowMessages[i + 1].agentRole === msg.agentRole
              ) {
                i++;
                group.push(preFlowMessages[i + 1]);
              }
              renderedPreFlow.push(
                <ProcessMessage key={`proc-${msg.id}`} messages={group} />
              );
              i += group.length; 
          }
    }
  
    // 3. Render
    return (
      <div className="flex flex-col gap-2 pb-10">
        {/* Pre-flow messages */}
        {renderedPreFlow}

        {/* Zone 1: Intent & Plan Card */}
        {taskPlanMsg && taskPlanMsg.taskPlan && (
            <IntentPlanCard 
                intentSummary={taskPlanMsg.intentSummary || "I've created a plan."} 
                steps={taskPlanMsg.taskPlan} 
            />
        )}

        {/* Zone 2: Execution Card */}
        {taskPlanSteps.length > 0 && (
             <ExecutionCard steps={taskPlanSteps} stepMessages={stepMessages} />
        )}
      </div>
    );
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
  const [selectedModel, setSelectedModel] = useState("Upliftly Pro");
  
  // Mock Task State
  const [taskState, setTaskState] = useState<'empty' | 'in_progress' | 'completed' | 'thinking'>('in_progress');

  const MODELS = [
    { name: "Upliftly Pro", icon: "⚡", description: "Best for complex tasks" },
    { name: "Upliftly Flash", icon: "🚀", description: "Fastest response" },
    { name: "Claude 3.5 Sonnet", icon: "🧠", description: "High reasoning" },
    { name: "GPT-4o", icon: "🤖", description: "Balanced performance" },
  ];

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
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          type="button"
                          variant="ghost" 
                          className="h-8 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                          title="Select Model"
                        >
                          <span className="text-foreground/80">{selectedModel}</span>
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px]">
                        {MODELS.map((model) => (
                          <DropdownMenuItem 
                            key={model.name}
                            onClick={() => setSelectedModel(model.name)}
                            className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <span>{model.icon}</span>
                              <span className="font-medium">{model.name}</span>
                              {selectedModel === model.name && (
                                <CheckCircle2 className="w-3 h-3 text-primary ml-auto" />
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground pl-6">
                              {model.description}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

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
