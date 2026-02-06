import React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertTriangle, X, ChevronRight, ArrowRight, ArrowDown } from "lucide-react";

// --- Types ---

export interface PageTab {
  id: string;
  icon: string;
  title: string;
  completedSteps: number;
  totalSteps: number;
}

export interface Metric {
  status: 'good' | 'warning' | 'issue';
  label: string;
}

export interface ScreenshotCardProps {
  step: string;
  title: string;
  screenshot?: string;
  metrics: Metric[];
  onClick?: () => void;
}

export interface SummaryCardProps {
  totalPages: number;
  totalIssues: number;
  totalInsights: number;
  findings: { icon: string; text: string; type: 'good' | 'warning' | 'issue' }[];
}

// --- Components ---

export function PageTabNav({ 
  pages, 
  activePageId, 
  onSwitch, 
  onAdd 
}: { 
  pages: PageTab[]; 
  activePageId: string; 
  onSwitch: (id: string) => void; 
  onAdd: () => void; 
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto bg-background/95 backdrop-blur z-10 sticky top-0 w-full no-scrollbar">
      {pages.map((page) => {
        const isActive = page.id === activePageId;
        return (
          <button
            key={page.id}
            onClick={() => onSwitch(page.id)}
            className={cn(
              "flex flex-col items-start px-3 py-2 rounded-lg text-left min-w-[140px] transition-all border",
              isActive
                ? "bg-primary/10 border-primary/20 shadow-sm"
                : "bg-card hover:bg-muted/50 border-transparent hover:border-border"
            )}
          >
            <span className="text-xs font-medium flex items-center gap-1.5 mb-1.5 w-full">
              <span className="text-base leading-none">{page.icon}</span>
              <span className={cn(
                "truncate text-xs font-semibold",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {page.title}
              </span>
            </span>
            <div className="flex gap-1 w-full">
              {Array.from({ length: page.totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i < page.completedSteps 
                      ? "bg-primary" 
                      : "bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </button>
        );
      })}
      <button
        onClick={onAdd}
        className="h-[52px] w-[52px] flex items-center justify-center rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground transition-all shrink-0"
        title="Add New Page"
      >
        <span className="text-xl">+</span>
      </button>
    </div>
  );
}

export function ScreenshotCard({ step, title, screenshot, metrics, onClick }: ScreenshotCardProps) {
  const statusStyles = {
    good:    { icon: <Check className="w-3 h-3" />, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    warning: { icon: <AlertTriangle className="w-3 h-3" />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    issue:   { icon: <X className="w-3 h-3" />, color: "text-rose-500",   bg: "bg-rose-500/10 border-rose-500/20" }
  };

  return (
    <div
      className="w-[240px] shrink-0 rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group relative"
      onClick={onClick}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
        <span className="text-[10px] font-mono text-muted-foreground font-medium uppercase tracking-wider">{step}</span>
        <span className="text-xs font-semibold truncate text-foreground/90">{title}</span>
      </div>
      
      {/* Screenshot */}
      <div className="aspect-[4/3] bg-muted overflow-hidden relative group-hover:ring-2 group-hover:ring-primary/20 transition-all">
        {screenshot ? (
          <img
            src={screenshot}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50">
             <div className="text-4xl opacity-20">🖼️</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Status Tags */}
      <div className="p-3 flex flex-wrap gap-1.5 bg-background">
        {metrics.map((m, i) => {
          const s = statusStyles[m.status] || statusStyles.good;
          return (
            <span
              key={i}
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border",
                s.bg,
                s.color
              )}
            >
              <span>{s.icon}</span>
              <span>{m.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function FlowConnector({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
  if (direction === "horizontal") {
    return (
      <div className="flex items-center justify-center w-8 shrink-0 self-center">
        <div className="w-full h-px bg-border/50 relative">
            <ArrowRight className="w-3 h-3 text-muted-foreground/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-12 w-full py-1 shrink-0">
      <div className="h-full w-px bg-border/50 relative">
         <ArrowDown className="w-3 h-3 text-muted-foreground/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

export function SummaryCard({ totalPages, totalIssues, totalInsights, findings }: SummaryCardProps) {
  return (
    <div className="w-[240px] shrink-0 rounded-xl border border-primary/20 bg-primary/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-3 py-2.5 border-b border-primary/10 flex items-center gap-2 bg-primary/10">
        <span className="text-xs font-bold text-primary flex items-center gap-1.5">
           <span className="text-base">📊</span> Summary
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-1 p-3 border-b border-primary/10">
        <div className="text-center p-1.5 rounded bg-background/50">
          <div className="text-lg font-bold text-foreground">{totalPages}</div>
          <div className="text-[9px] text-muted-foreground uppercase font-medium">Pages</div>
        </div>
        <div className="text-center p-1.5 rounded bg-background/50">
          <div className="text-lg font-bold text-amber-500">{totalIssues}</div>
          <div className="text-[9px] text-muted-foreground uppercase font-medium">Issues</div>
        </div>
        <div className="text-center p-1.5 rounded bg-background/50">
          <div className="text-lg font-bold text-indigo-500">{totalInsights}</div>
          <div className="text-[9px] text-muted-foreground uppercase font-medium">Insights</div>
        </div>
      </div>
      
      <div className="p-3 space-y-2 bg-background/30">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Findings</div>
        {findings.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className={cn(
                "mt-0.5 shrink-0",
                f.type === 'good' ? "text-emerald-500" : 
                f.type === 'warning' ? "text-amber-500" : "text-rose-500"
            )}>
                {f.type === 'good' ? <Check className="w-3 h-3" /> : f.type === 'warning' ? <AlertTriangle className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </span>
            <span className="text-muted-foreground leading-snug">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
