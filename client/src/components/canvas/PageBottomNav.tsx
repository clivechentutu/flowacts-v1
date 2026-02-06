import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PageTab } from "./PageTabNav"; // Reusing the type

interface PageBottomNavProps {
  pages: PageTab[];
  activePageId: string;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onRenameTab: (id: string, newTitle: string) => void;
}

export function PageBottomNav({
  pages,
  activePageId,
  onSwitch,
  onAdd,
  onRenameTab
}: PageBottomNavProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const currentIndex = pages.findIndex((p) => p.id === activePageId);
  const currentPage = pages[currentIndex];
  
  // Safety check
  if (!currentPage) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pages.length - 1;

  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (editValue.trim()) {
      onRenameTab(currentPage.id, editValue.trim().slice(0, 18));
    }
    setIsEditing(false);
  };

  const handlePrev = () => {
    if (hasPrev) onSwitch(pages[currentIndex - 1].id);
  };

  const handleNext = () => {
    if (hasNext) onSwitch(pages[currentIndex + 1].id);
  };

  return (
    <div className="flex items-center justify-between px-2 py-2 border-t border-border bg-background/80 backdrop-blur-sm h-10 overflow-hidden">
      {/* Pages Label */}
      <div className="flex items-center gap-1 pr-2 border-r border-border mr-1 shrink-0">
        <span className="text-xs">📄</span>
        <span className="text-xs font-medium text-muted-foreground">Pages</span>
      </div>

      {/* Tabs Area */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar mask-linear-fade">
        {pages.map((page) => {
            const isActive = page.id === activePageId;
            return (
                <button
                    key={page.id}
                    onClick={() => onSwitch(page.id)}
                    className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-md transition-all whitespace-nowrap text-xs max-w-[140px]",
                        isActive 
                            ? "bg-primary/10 text-foreground font-medium" 
                            : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    <span className="text-sm leading-none select-none">{page.icon}</span>
                    
                    {isActive && isEditing ? (
                         <input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleConfirm();
                                if (e.key === "Escape") setIsEditing(false);
                            }}
                            onBlur={handleConfirm}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent border-b border-primary outline-none text-xs font-medium text-foreground min-w-[60px] max-w-[100px] p-0 h-4"
                            maxLength={18}
                            autoFocus
                        />
                    ) : (
                        <span 
                            className="truncate select-none"
                            onDoubleClick={(e) => {
                                if (isActive) {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                    setEditValue(page.title);
                                }
                            }}
                            title={isActive ? "Double click to rename" : page.title}
                        >
                            {page.title}
                        </span>
                    )}
                    
                    {page.totalSteps > 0 && (
                        <span className={cn("text-[10px] tabular-nums ml-1", isActive ? "text-foreground opacity-80" : "text-muted-foreground opacity-60")}>
                            {page.completedSteps}/{page.totalSteps}
                        </span>
                    )}
                </button>
            );
        })}
      </div>

      {/* Right: Add Button */}
      <button
        onClick={onAdd}
        className="ml-auto px-2 h-7 rounded text-xs text-muted-foreground hover:bg-muted shrink-0 flex items-center gap-0.5"
        title="Add page to this project"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Page</span>
      </button>
    </div>
  );
}
