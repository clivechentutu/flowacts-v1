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
    <div className="flex items-center justify-between px-2 py-2 border-t border-border bg-background/80 backdrop-blur-sm h-[48px] overflow-hidden">
      {/* Tabs Area */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar mask-linear-fade">
        {pages.map((page) => {
            const isActive = page.id === activePageId;
            return (
                <button
                    key={page.id}
                    onClick={() => onSwitch(page.id)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all whitespace-nowrap border text-sm max-w-[200px]",
                        isActive 
                            ? "bg-muted text-foreground border-border shadow-sm font-medium" 
                            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    <span className="text-base leading-none select-none">{page.icon}</span>
                    
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
                            className="bg-transparent border-b border-primary outline-none text-sm font-medium text-foreground min-w-[60px] max-w-[120px] p-0 h-5"
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
                        <span className={cn("text-[10px] tabular-nums opacity-60", isActive ? "text-foreground" : "text-muted-foreground")}>
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
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
        title="New Task Page"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
