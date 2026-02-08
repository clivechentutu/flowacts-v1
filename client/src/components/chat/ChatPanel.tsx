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

// Intent & Plan Card (Zone 1 - "Pre-positioned" - v6 Compact)
function IntentPlanCard({ intentSummary, steps }: { intentSummary: string, steps: TaskPlanStep[] }) {
  const doneCount = steps.filter((s) => s.status === "done").length;
  
  const agentIcons: Record<string, string> = {
    scout: "🕵️", capturer: "📸", analyst: "📊",
    comparator: "⚖️", reporter: "📝",
  };

  return (
    <div className="mx-1 mt-3 rounded-xl border border-border/15 bg-muted/5 overflow-hidden">
      {/* Intent summary header */}
      <div className="px-4 py-3 border-b border-border/10">
        <p className="text-sm text-foreground/90 leading-relaxed">
          {intentSummary}
        </p>
      </div>

      {/* Step list — always visible, very compact */}
      <div className="px-4 py-3 space-y-1.5">
        {steps.map((step) => {
          const icon = agentIcons[step.agentRole] || "🤖";
          return (
            <div key={step.id} className="flex items-center gap-2 text-xs">
              <span className={`shrink-0 ${
                step.status === "done"
                  ? "text-muted-foreground/40"
                  : step.status === "active"
                  ? "text-blue-400"
                  : "text-muted-foreground/25"
              }`}>
                {step.status === "done" ? "✓" :
                 step.status === "active" ? "●" : "○"}
              </span>
              <span className={`${
                step.status === "done"
                  ? "text-muted-foreground/40 line-through"
                  : step.status === "active"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/30"
              }`}>
                {icon} {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer: progress bar removed */}
    </div>
  );
}

// Process Timeline (Zone 2 - "Unified Process")
function ProcessTimeline({ steps, stepMessages }: { steps: TaskPlanStep[]; stepMessages: Record<string, StoryEvent[]> }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

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

  const hasActive = allProcessGroups.some((g) =>
    g.processSteps.some((s) => s.status === "active")
  );

  // Auto-expand when there's an active process step
  const expanded = isExpanded || hasActive;

  if (totalProcessCount === 0) return null;

  const agentIcons: Record<string, string> = {
    scout: "🕵️", capturer: "📸", analyst: "📊",
    comparator: "⚖️", reporter: "📝",
  };

  return (
    <div className="border-t border-border/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-2
          text-left hover:bg-muted/8 transition-colors"
      >
        <span className="text-[10px] text-muted-foreground/30
          shrink-0 w-3">
          {expanded ? "▾" : "▸"}
        </span>
        <span className="text-[11px] text-muted-foreground/40">
          Process Timeline ({totalProcessCount})
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 max-h-[200px] overflow-y-auto">
          <div className="space-y-3">
            {allProcessGroups.map((group) => {
              const icon =
                agentIcons[group.step.agentRole] || "🤖";
              const isActiveStep =
                group.step.status === "active";

              return (
                <div key={group.step.id}>
                  {/* Step group header */}
                  <div className="text-[10px] text-muted-foreground/40
                    font-medium tracking-wider mb-1">
                    {icon} {group.step.label}
                  </div>

                  {/* Process steps */}
                  <div className="ml-2 space-y-0.5">
                    {group.processSteps.map((ps, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5
                          text-[10px] ${
                            isActiveStep
                              ? "text-muted-foreground/50"
                              : "text-muted-foreground/30"
                          }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full
                            shrink-0 ${
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
                          <span className="text-muted-foreground/20
                            ml-auto">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Execution Card (Zone 2 - "DynamicExecutionCard" - v8 Single Dynamic Title + Unified Process)
function DynamicExecutionCard({ steps, stepMessages }: { steps: TaskPlanStep[]; stepMessages: Record<string, StoryEvent[]> }) {
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [isTitleExpanded, setIsTitleExpanded] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const doneCount = steps.filter((s) => s.status === "done").length;
  const activeStep = steps.find((s) => s.status === "active");
  const doneSteps = steps.filter((s) => s.status === "done");

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

  // Helper to render content for a step (Results ONLY for active/history)
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
    <div className="mx-1 mt-2 rounded-xl border border-border/15 bg-muted/5 overflow-hidden transition-all duration-300">
      
      {/* ── Dynamic Title Bar ── */}
      <div 
        className="flex items-center justify-between px-4 py-2.5 border-b border-border/10 bg-card/50 cursor-pointer hover:bg-card/70 transition-colors"
        onClick={() => setIsTitleExpanded(!isTitleExpanded)}
      >
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
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
                <span className="text-xs text-foreground/80 truncate">
                  {agentIcons[activeStep.agentRole]}{" "}
                  {activeStep.label}
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
        
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {/* Progress counter with scale animation on change */}
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

      {/* ── Active Content Area (current step's L1/L2 results) ── */}
      {activeStep && (
        <div className={cn(
          "px-4 py-3 transition-all duration-300", // Removed bg-background/30 to remove "inset" look
          !isTitleExpanded ? "max-h-[80px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-muted/20 after:to-transparent pointer-events-none" : ""
        )}>
          <div className="space-y-1.5">
            {renderStepContent(
              (stepMessages[activeStep.id] || []).filter((m) => {
                const level = m.messageLevel || getDefaultLevel(m);
                return level === "insight" || level === "progress";
              })
            )}
          </div>
        </div>
      )}

      {/* ── Unified Process Timeline (ALL steps) ── */}
      {isTitleExpanded && <ProcessTimeline steps={steps} stepMessages={stepMessages} />}

      {/* ── Collapsible History Section ── */}
      {doneCount > 0 && isTitleExpanded && (
        <div className="border-t border-border/10">
          {/* History toggle header */}
          <button
            onClick={() => setHistoryExpanded(!historyExpanded)}
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-muted/8 transition-colors group"
          >
            <span className="text-[10px] text-muted-foreground/30 shrink-0 w-3">
                {historyExpanded ? "▾" : "▸"}
            </span>
            <span className="text-[11px] text-muted-foreground/40 font-normal group-hover:text-muted-foreground/60 transition-colors">
              {doneCount} step{doneCount !== 1 ? "s" : ""} completed
            </span>
          </button>

          {/* History List */}
          {historyExpanded && (
              <div className="px-4 pb-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
                  {doneSteps.map(step => {
                      const icon = agentIcons[step.agentRole] || "🤖";
                      const dotColor = agentDotColors[step.agentRole] || "bg-muted-foreground/40";
                      const isExpanded = expandedSteps.has(step.id);
                      const msgs = stepMessages[step.id] || [];
                      const summaryText = step.resultSummary || step.summary;

                      return (
                          <div key={step.id} className="rounded-lg border border-border/10 bg-card/40 overflow-hidden">
                              <div 
                                  className="flex flex-col cursor-pointer hover:bg-muted/5 transition-colors p-2.5"
                                  onClick={() => toggleStepResults(step.id)}
                              >
                                  <div className="flex items-center gap-2.5">
                                      {/* Agent color dot */}
                                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                                      
                                      <span className="text-[12px] text-foreground/60 font-medium truncate flex-1">
                                          {icon} {step.label}
                                      </span>
                                      
                                      {/* Level 1 Summary (Result Penetration) */}
                                      {!isExpanded && summaryText && (
                                          <span className="text-[10px] text-muted-foreground/70 bg-muted/10 px-1.5 py-0.5 rounded max-w-[150px] truncate">
                                              {summaryText}
                                          </span>
                                      )}
                                      <span className="text-[10px] text-muted-foreground/30 shrink-0 w-3">
                                        {isExpanded ? "▾" : "▸"}
                                      </span>
                                  </div>
                              </div>

                              {/* Level 2 Drill Down */}
                              {isExpanded && (
                                  <div className="px-3 pb-3 pt-0 pl-8 space-y-2 border-t border-border/5 pt-2">
                                       {summaryText && (
                                           <div className="text-xs font-medium text-foreground/80 mb-2">
                                               {summaryText}
                                           </div>
                                       )}
                                       {renderStepContent(msgs)}
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
          )}
        </div>
      )}
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
             <DynamicExecutionCard steps={taskPlanSteps} stepMessages={stepMessages} />
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
