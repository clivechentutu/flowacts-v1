import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Plus, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PageTab {
  id: string;
  icon: string;
  title: string;
  completedSteps: number;
  totalSteps: number;
  isActive: boolean;
  status: "idle" | "running" | "completed";
}

interface PageTabNavProps {
  pages: PageTab[];
  activePageId: string;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onRenameTab: (id: string, newTitle: string) => void;
}

export function PageTabNav({ pages, activePageId, onSwitch, onAdd, onRenameTab }: PageTabNavProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleDoubleClick = (page: PageTab) => {
    setEditingId(page.id);
    setEditValue(page.title);
  };

  const handleRenameConfirm = (pageId: string) => {
    if (editValue.trim()) {
      onRenameTab(pageId, editValue.trim().slice(0, 18));
    }
    setEditingId(null);
  };

  const visiblePages = pages.length > 6 ? pages.slice(0, 1) : pages;
  const isBreadcrumbMode = pages.length > 6;

  // Breadcrumb mode for 7+ tabs
  if (isBreadcrumbMode) {
    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    
    return (
      <div className="flex items-center px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground font-medium">Project Name</span>
          <span className="text-muted-foreground/50">/</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/20">
              <span className="flex items-center gap-1.5 font-medium">
                <span>{activePage.icon}</span>
                <span>{activePage.title}</span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              {pages.map(page => (
                <DropdownMenuItem 
                  key={page.id}
                  onClick={() => onSwitch(page.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span>{page.icon}</span>
                    <span className={cn(page.id === activePageId && "font-medium")}>{page.title}</span>
                  </div>
                  {page.id === activePageId && <Check className="w-3.5 h-3.5 text-primary" />}
                  {page.status === 'running' && page.id !== activePageId && (
                     <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem 
                onSelect={(e) => {
                    e.preventDefault();
                    onAdd();
                }}
                className="border-t border-border mt-1 pt-2 text-muted-foreground cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-2" />
                New Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b border-border overflow-x-auto scrollbar-thin bg-background/50 backdrop-blur-sm z-30">
      {pages.map((page) => {
        const isActive = page.id === activePageId;
        const isEditing = editingId === page.id;

        return (
          <div
            key={page.id}
            onClick={() => !isEditing && onSwitch(page.id)}
            onDoubleClick={() => handleDoubleClick(page)}
            className={cn(
                "flex flex-col items-start px-3 py-2 rounded-lg text-left min-w-[120px] max-w-[160px] transition-all shrink-0 cursor-pointer group relative select-none",
                isActive ? "bg-primary/10 border border-primary/20 shadow-sm" : "hover:bg-muted/50 border border-transparent"
            )}
          >
            {/* Title row: icon + title */}
            <div className="flex items-center gap-1.5 w-full">
              <span className="shrink-0 text-base leading-none">{page.icon}</span>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameConfirm(page.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => handleRenameConfirm(page.id)}
                  className="bg-transparent border-b border-primary outline-none text-xs w-full text-foreground p-0 h-4"
                  maxLength={18}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={cn(
                    "text-xs font-medium truncate w-full",
                    isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {page.title}
                </span>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex gap-1 mt-1.5 pl-[1.35rem]">
              {page.totalSteps === 0 ? (
                /* Task just started — pulsing dot */
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" />
              ) : page.totalSteps > 7 ? (
                /* Too many steps — show as text */
                <span className="text-[10px] text-muted-foreground font-mono leading-none">
                  {page.completedSteps}/{page.totalSteps}
                </span>
              ) : (
                /* Normal — show dots */
                Array.from({ length: page.totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        i < page.completedSteps ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                ))
              )}
            </div>
            
            {/* Hover Edit Hint (Optional visual cue) */}
            {!isEditing && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Could add a pencil icon here if needed, but clean is better per spec */}
                </div>
            )}
          </div>
        );
      })}

      {/* Add new page button */}
      <button
        onClick={onAdd}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground shrink-0 transition-colors ml-1"
        title="New task"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
