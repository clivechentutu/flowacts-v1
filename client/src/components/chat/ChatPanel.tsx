import { StoryEvent, ThoughtProcess, TaskPlanStep } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TextareaAutosize from "react-textarea-autosize";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef } from "react";

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
        <div className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium">
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
      <div className="text-xs text-foreground/90 leading-relaxed mt-1.5 whitespace-pre-wrap font-medium">
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

// Intent & Plan Card (Zone 1 - "Pre-positioned" - v6 Compact)
function IntentPlanCard({ steps, isUpdate }: { steps: TaskPlanStep[], isUpdate?: boolean }) {
  return (
    <div className="mx-1 mt-1.5 rounded-xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header with Title */}
      <div className="px-4 py-2 bg-secondary/30 border-b border-border/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-1 h-3 rounded-full bg-orange-400/30"></div>
           <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-foreground/70">
            {isUpdate ? "Update To Do" : "To Do"}
           </span>
        </div>
      </div>

      {/* Step list — always visible, very compact */}
      <div className="px-4 py-3 space-y-2 bg-card/50">
        {steps.map((step) => {
          return (
            <div key={step.id} className="flex items-center gap-2 text-xs">
              <span className="shrink-0">
                {step.status === "done" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <div className={`w-3.5 h-3.5 rounded border ${
                    step.status === "active" 
                      ? "border-blue-400 bg-blue-50/50" 
                      : "border-muted-foreground/30 bg-muted/20"
                  }`} />
                )}
              </span>
              <span className={`${
                step.status === "done"
                  ? "text-muted-foreground/40 line-through"
                  : step.status === "active"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/30"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Process Timeline (Zone 2 - "Unified Process")
function ProcessTimeline({ steps, stepMessages }: { steps: TaskPlanStep[]; stepMessages: Record<string, StoryEvent[]> }) {
  // Collect ALL process messages across ALL steps
  const allProcessGroups = steps
    .filter((step) => step.status === "done" || step.status === "active")
    .map((step) => {
      const msgs = stepMessages[step.id] || [];
      const processMsgs = msgs.filter((m) => {
        const level = m.messageLevel || getDefaultLevel(m);
        return level === "process";
      });
      const allSteps = processMsgs.flatMap(
        (m) => m.thoughtProcess?.steps || []
      );
      return { step, processSteps: allSteps };
    })
    .filter((group) => group.processSteps.length > 0);

  const totalProcessCount = allProcessGroups.reduce(
    (sum, g) => sum + g.processSteps.length, 0
  );

  if (totalProcessCount === 0) return null;

  const agentIcons: Record<string, string> = {
    scout: "🕵️", capturer: "📸", analyst: "📊",
    comparator: "⚖️", reporter: "📝",
  };

  return (
    <div className="space-y-3 pt-2">
        {allProcessGroups.map((group) => {
            const icon = agentIcons[group.step.agentRole] || "🤖";
            const isActiveStep = group.step.status === "active";

            return (
            <div key={group.step.id}>
                {/* Step group header */}
                <div className="text-[10px] text-muted-foreground/40 font-medium tracking-wider mb-1">
                {icon} {group.step.label}
                </div>

                {/* Process steps */}
                <div className="ml-2 space-y-0.5">
                {group.processSteps.map((ps, i) => (
                    <div
                    key={i}
                    className={`flex items-center gap-1.5 text-[10px] ${
                        isActiveStep
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground/30"
                    }`}
                    >
                    <span
                        className={`w-1 h-1 rounded-full shrink-0 ${
                        ps.status === "done"
                            ? isActiveStep
                            ? "bg-muted-foreground/30"
                            : "bg-muted-foreground/15"
                            : ps.status === "active"
                            ? "bg-blue-400 animate-pulse"
                            : "bg-muted-foreground/10"
                        }`}
                    />
                    <span>{ps.label}</span>
                    {ps.status === "done" && (
                        <span className="text-muted-foreground/20 ml-auto">✓</span>
                    )}
                    </div>
                ))}
                </div>
            </div>
            );
        })}
    </div>
  );
}

// Completed History Card (Independent Component)
function CompletedHistoryCard({ steps, stepMessages }: { steps: TaskPlanStep[]; stepMessages: Record<string, StoryEvent[]> }) {
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const doneSteps = steps.filter((s) => s.status === "done");
  const doneCount = doneSteps.length;

  if (doneCount === 0) return null;

  const agentIcons: Record<string, string> = {
    scout: "🕵️", capturer: "📸", analyst: "📊",
    comparator: "⚖️", reporter: "📝",
  };

  const agentDotColors: Record<string, string> = {
    scout: "bg-blue-400",
    capturer: "bg-purple-400",
    analyst: "bg-orange-400",
    comparator: "bg-green-400",
    reporter: "bg-pink-400",
  };

  const toggleStepResults = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  // Helper to render content for a step
  const renderStepContent = (msgs: StoryEvent[]) => {
      const results = msgs.filter(m => {
          const level = m.messageLevel || getDefaultLevel(m);
          return level === 'insight' || level === 'progress' || m.canvasLinkId;
      });

      return (
          <div className="space-y-3">
              {/* Results */}
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
          </div>
      );
  };

  const allCompleted = doneCount === steps.length;

  return (
    <div className="mx-1 mt-2 rounded-xl border border-border/40 bg-card shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* History toggle header */}
      <button
        onClick={() => setHistoryExpanded(!historyExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-muted/30 to-transparent border-b border-border/10 hover:bg-muted/40 transition-colors group"
      >
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5">
              {allCompleted ? (
                 <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (
                 <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                 </div>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                {doneCount} step{doneCount !== 1 ? "s" : ""} completed
              </span>
          </div>
        </div>
        
        <span className="text-[10px] text-muted-foreground/30 shrink-0 w-3 text-right">
            {historyExpanded ? "▾" : "▸"}
        </span>
      </button>

      {/* History List - Timeline Style */}
      {historyExpanded && (
          <div className="relative px-4 pb-4 pt-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
              {/* Continuous vertical line connecting the steps */}
              <div className="absolute left-[24px] top-6 bottom-6 w-0.5 bg-foreground/15" />

              {doneSteps.map((step, index) => {
                  const icon = agentIcons[step.agentRole] || "🤖";
                  const dotColor = agentDotColors[step.agentRole] || "bg-muted-foreground/40";
                  const isExpanded = expandedSteps.has(step.id);
                  const msgs = stepMessages[step.id] || [];
                  const summaryText = step.resultSummary || step.summary;

                  return (
                      <div key={step.id} className="relative z-10">
                          <div 
                              className="flex flex-col cursor-pointer group"
                              onClick={() => toggleStepResults(step.id)}
                          >
                              <div className="flex items-start gap-3">
                                  {/* Agent color dot with background mask for line gap effect */}
                                  <div className="relative flex items-center justify-center w-[18px] h-[18px] mt-0.5 bg-card shrink-0 rounded-full z-10 ring-4 ring-card">
                                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor} shadow-[0_0_0_1px_rgba(0,0,0,0.1)]`} />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                          <span className="text-[12px] text-foreground/80 font-medium truncate">
                                              {icon} {step.label}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground/30 shrink-0 w-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                              {isExpanded ? "▾" : "▸"}
                                          </span>
                                      </div>

                                      {/* Level 1 Summary (Result Penetration) */}
                                      {!isExpanded && summaryText && (
                                          <div className="mt-1 text-[11px] text-muted-foreground/80 leading-snug line-clamp-2">
                                              {summaryText}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>

                          {/* Level 2 Drill Down */}
                          {isExpanded && (
                              <div className="mt-3 ml-[9px] space-y-4 border-l-2 border-border/10 pl-5">
                                   {summaryText && (
                                       <div className="text-[13px] font-bold text-foreground leading-tight tracking-tight">
                                           {summaryText}
                                       </div>
                                   )}
                                   <div className="pl-1">
                                       {renderStepContent(msgs)}
                                   </div>
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
}

function ExecutionOverflowMenu({ onAction }: { onAction: (item: any) => void }) {
  const MENU_ITEMS = [
    { icon: "🎯", label: "Focus on this section", action: "focus" },
    { icon: "⏭", label: "Skip to next step", action: "skip" },
    { icon: "📸", label: "Take a screenshot", action: "screenshot" },
    { icon: "⏹", label: "Pause execution", action: "pause" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1 rounded-md
            text-muted-foreground/50 hover:text-muted-foreground/80
            hover:bg-white/5
            transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="12" cy="8" r="1.5" />
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-popover border border-border rounded-xl
          shadow-xl min-w-[200px] p-1"
      >
        {MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.action}
            onClick={() => onAction(item)}
            className="flex items-center gap-2 px-3 py-2
              rounded-lg cursor-pointer
              text-sm text-muted-foreground
              hover:text-foreground hover:bg-muted/50
              transition-colors duration-100"
          >
            <span className="text-[13px]">{item.icon}</span>
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChatInput({ onSend, taskState }: { onSend: (msg: string) => void, taskState: string }) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getPlaceholder = (state: string) => {
    switch (state) {
      case "empty":
        return "Paste a URL or describe what you'd like to analyze...";
      case "in_progress":
        return "Type to redirect or intervene...";
      case "completed":
        return "Compare, dig deeper, or start a new analysis...";
      case "thinking":
        return "Type to redirect or wait for results...";
      default:
        return "Ask Upliftly to analyze a flow...";
    }
  };

  const placeholder = getPlaceholder(taskState);
  const hasContent = inputValue.trim().length > 0;

  const handleSend = () => {
    if (!hasContent) return;
    onSend(inputValue.trim());
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex items-end gap-2
      bg-muted/20 rounded-2xl
      border border-border/60
      focus-within:border-primary/50
      focus-within:ring-1 focus-within:ring-primary/20
      px-4 py-3
      transition-all duration-200">

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent resize-none outline-none
          text-sm text-foreground
          placeholder:text-muted-foreground/40
          min-h-[20px] max-h-[120px]"
        rows={1}
      />

      {/* Send button — INSIDE the input box */}
      <button
        onClick={handleSend}
        disabled={!hasContent}
        className={`shrink-0 p-1.5 rounded-lg transition-all duration-150
          ${hasContent
            ? "bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
            : "bg-muted/50 text-muted-foreground/30 cursor-default"
          }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M2 8L14 8M14 8L8 2M14 8L8 14"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            transform="rotate(-45 8 8)" />
        </svg>
      </button>
    </div>
  );
}

function ToolbarButton({ icon, tooltip, onClick }: { icon: string, tooltip: string, onClick?: () => void }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="p-1.5 rounded-md
              text-muted-foreground/50 hover:text-muted-foreground/80
              hover:bg-muted/30
              transition-colors duration-150"
          >
            <span className="text-sm">{icon}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-popover border border-border rounded-lg
            px-2.5 py-1.5 shadow-lg text-xs"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Execution Card (Zone 2 - "DynamicExecutionCard" - v8 Single Dynamic Title + Unified Process)
// Refactored to ONLY show Active Step and Process Timeline
function DynamicExecutionCard({ steps, stepMessages, onSend, taskState }: { steps: TaskPlanStep[]; stepMessages: Record<string, StoryEvent[]>, onSend: (msg: string) => void, taskState: string }) {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  const doneCount = steps.filter((s) => s.status === "done").length;
  const activeStep = steps.find((s) => s.status === "active");

  const agentIcons: Record<string, string> = {
    scout: "🕵️", capturer: "📸", analyst: "📊",
    comparator: "⚖️", reporter: "📝",
  };

  // Helper to render content for a step
  const renderStepContent = (msgs: StoryEvent[]) => {
      const results = msgs.filter(m => {
          const level = m.messageLevel || getDefaultLevel(m);
          return level === 'insight' || level === 'progress' || m.canvasLinkId;
      });

      return (
          <div className="space-y-3">
              {/* Results */}
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
          </div>
      );
  };

  return (
    <div className="mx-1 mt-1 rounded-xl border border-primary/20 bg-background shadow-md shadow-primary/5 ring-1 ring-primary/5 overflow-hidden transition-all duration-300">
      
      {/* ── Dynamic Title Bar ── */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent border-b border-border/10 cursor-pointer hover:bg-muted/20 transition-colors"
      >
        <div 
            className="flex items-center gap-2 min-w-0 overflow-hidden flex-1"
            onClick={() => setIsTitleExpanded(!isTitleExpanded)}
        >
          <AnimatePresence mode="wait">
            {activeStep ? (
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center gap-2 min-w-0"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  Processing: {activeStep.label}
                </span>
              </motion.div>
            ) : (
              <motion.span
                key="all-done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-muted-foreground/50"
              >
                ✓ All steps completed
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-3">
           {/* Overflow Menu */}
           {taskState === "in_progress" && activeStep && (
            <ExecutionOverflowMenu
                onAction={(item: any) => {
                    // Send as user message
                    onSend(item.label);
                }}
            />
          )}

          {/* Progress counter with scale animation on change */}
          <div onClick={() => setIsTitleExpanded(!isTitleExpanded)} className="flex items-center gap-1">
            <AnimatePresence mode="wait">
                <motion.span
                    key={doneCount}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] text-muted-foreground/40 tabular-nums font-mono"
                >
                    {doneCount}/{steps.length}
                </motion.span>
            </AnimatePresence>
            <span className="text-[10px] text-muted-foreground/30 w-3">
                {isTitleExpanded ? "▾" : "▸"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Active Content Area (current step's L1/L2 results) ── */}
      <div className={cn(
        "px-4 py-3 transition-all duration-300", 
        !isTitleExpanded ? "max-h-[120px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-12 after:bg-gradient-to-t after:from-muted/20 after:to-transparent pointer-events-none" : ""
      )}>
        <div className="space-y-1.5">
          {activeStep && renderStepContent(
            (stepMessages[activeStep.id] || []).filter((m) => {
              const level = m.messageLevel || getDefaultLevel(m);
              return level === "insight" || level === "progress";
            })
          )}
           
           {/* Unified Process Timeline (ALL steps) */}
           <ProcessTimeline steps={steps} stepMessages={stepMessages} />
        </div>
      </div>

      {/* ── Removed Separate Process Timeline ── */}
    </div>
  );
}
  
// Main List Renderer
function ChatMessageList({ messages, onSendMessage, taskState }: { messages: StoryEvent[], onSendMessage: (msg: string) => void, taskState: string }) {
    // 1. Separate special messages from flow messages
    // Use the latest plan if multiple exist (e.g. after an update)
    const taskPlanMsg = [...messages].reverse().find((m) => m.taskPlan);
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
         // Treat as pre-flow if no task plan exists yet, or put in preFlowMessages
         preFlowMessages.push(msg);
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
      <div className="flex flex-col gap-1.5 pb-10">
        {/* Pre-flow messages */}
        {renderedPreFlow}

        {/* Main Process Timeline Container */}
        <div className="relative pl-6 mt-4">
            {/* The Continuous Vertical Line */}
            {/* Starts from top dot, ends at bottom dot. calculated via absolute positioning */}
            <div className="absolute left-[11px] top-6 bottom-10 w-0.5 bg-border/40" />

            {/* Zone 1: Intent & Plan Card */}
            {taskPlanMsg && taskPlanMsg.taskPlan && (
                <div className="relative mb-8">
                    {/* Dot 1 - Neutral (Planning) */}
                    <div className="absolute -left-[22px] top-[50px] flex items-center justify-center w-5 h-5 bg-background ring-[6px] ring-background rounded-full z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground shadow-sm" />
                    </div>

                    <div className="px-1 py-1 mb-2">
                        <p className="text-xs text-foreground/80 leading-relaxed">
                            {taskPlanMsg.intentSummary || "I've created a plan."}
                        </p>
                    </div>
                    <IntentPlanCard 
                        steps={taskPlanMsg.taskPlan} 
                        isUpdate={messages.filter(m => m.role === 'user').length > 1}
                    />
                </div>
            )}

            {/* AI Transition Message */}
            {taskPlanMsg && taskPlanMsg.taskPlan && taskPlanSteps.length > 0 && (
                <div className="relative mb-8 ml-1">
                    <div className="text-xs text-foreground/60 leading-relaxed pl-3 border-l-2 border-primary/20 italic">
                        Plan approved. Initiating execution sequence...
                    </div>
                </div>
            )}

            {/* Zone 2: Execution Card */}
            {taskPlanSteps.length > 0 && (
                 <div className="relative mb-8">
                    {/* Dot 2 - Neutral Active (Processing) */}
                    <div className="absolute -left-[22px] top-[22px] flex items-center justify-center w-5 h-5 bg-background ring-[6px] ring-background rounded-full z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-foreground shadow-sm" />
                    </div>

                     <DynamicExecutionCard 
                        steps={taskPlanSteps} 
                        stepMessages={stepMessages}
                        onSend={onSendMessage}
                        taskState={taskState}
                     />
                 </div>
            )}

            {/* Zone 3: Completed History Card */}
            {taskPlanSteps.length > 0 && (
                 <div className="relative">
                     {/* Dot 3 - Neutral Dim (History) */}
                     <div className="absolute -left-[22px] top-[22px] flex items-center justify-center w-5 h-5 bg-background ring-[6px] ring-background rounded-full z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 shadow-sm" />
                     </div>

                     <div className="mt-0">
                         <CompletedHistoryCard steps={taskPlanSteps} stepMessages={stepMessages} />
                     </div>
                 </div>
            )}
        </div>
      </div>
    );
}

// Suggestion Chips Component REMOVED

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

  const TOOLBAR_ITEMS = [
    { icon: "📎", tooltip: "Attach a file or screenshot" },
    { icon: "@", tooltip: "Mention a specific agent" },
    { icon: "⚡", tooltip: "Quick commands" },
    { icon: "🌐", tooltip: "Enter a URL to analyze" },
  ];

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
        <ChatMessageList 
            messages={events.filter(e => ['user', 'ai'].includes(e.type))} 
            onSendMessage={onSendMessage}
            taskState={taskState}
        />
      </ScrollArea>

      {/* Input Area (New Layout) */}
      <div className="border-t border-border bg-[var(--chat-background)] flex flex-col relative">
        {/* Gradient fade */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-[var(--chat-background)] to-transparent pointer-events-none" />

        <div className="px-4 pb-2 pt-4">
            <ChatInput onSend={onSendMessage} taskState={taskState} />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-5 pb-3">
            {TOOLBAR_ITEMS.map((item, i) => (
                <ToolbarButton
                    key={i}
                    icon={item.icon}
                    tooltip={item.tooltip}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
