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
    <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background/80 backdrop-blur-sm h-[48px]">
      {/* Left: navigation arrows + current page */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
              !hasPrev ? "opacity-30 cursor-not-allowed text-muted-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-2">
          <span className="text-lg leading-none select-none">{currentPage.icon}</span>
          
          {isEditing ? (
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
              className="bg-transparent border-b border-primary outline-none text-sm font-medium text-foreground w-[150px] p-0 h-5"
              maxLength={18}
            />
          ) : (
            <div 
                className="flex items-baseline gap-2 group cursor-pointer relative py-1"
                onDoubleClick={() => {
                    setIsEditing(true);
                    setEditValue(currentPage.title);
                }}
                title="Double click to rename page"
            >
                <span className="text-sm font-medium text-foreground select-none">
                    {currentPage.title}
                </span>
                
                {currentPage.totalSteps > 0 && (
                    <span className="text-xs text-muted-foreground select-none">
                    ({currentPage.completedSteps}/{currentPage.totalSteps})
                    </span>
                )}
                
                <span className="opacity-0 group-hover:opacity-100 absolute -right-5 top-1.5 text-muted-foreground text-[10px] transition-opacity">
                    ✏️
                </span>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
              !hasNext ? "opacity-30 cursor-not-allowed text-muted-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          title="Next Page"
        >
           <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Page dots (if 2-6 pages) - Only show if enough space or make absolutely centered? 
          Actually doc says "subtle page indicator below the title" in the example, 
          but in the "Layout Anatomy" it doesn't explicitly place it.
          The visual mock shows:
          ←  🔍 Signup Flow (3/5)  →
                   ● ○ ○ 
          Let's place it absolutely centered in the container or just next to the title group if simple.
          For now, let's keep it simple in the flex flow or centered absolutely.
      */}
      
      {pages.length > 1 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex gap-1.5 opacity-40">
            {pages.length <= 6 ? (
                pages.map((p, i) => (
                    <div 
                        key={p.id}
                        className={cn(
                            "w-1.5 h-1.5 rounded-full transition-colors",
                            i === currentIndex ? "bg-foreground" : "bg-muted-foreground"
                        )}
                    />
                ))
            ) : (
                <span className="text-[10px] text-muted-foreground font-mono">
                    {currentIndex + 1} of {pages.length}
                </span>
            )}
        </div>
      )}

      {/* Right: Add Button */}
      <button
        onClick={onAdd}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        title="New Task Page"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
