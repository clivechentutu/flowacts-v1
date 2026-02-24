import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProjectInfo {
  id: string;
  icon: string;
  name: string;
}

interface ProjectHeaderProps {
  project: ProjectInfo;
  onRename: (newName: string) => void;
  onToggleProjectList?: () => void;
  isProjectListExpanded?: boolean;
}

export function ProjectHeader({ project, onRename, onToggleProjectList, isProjectListExpanded }: ProjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (editValue.trim() && editValue.trim() !== project.name) {
      onRename(editValue.trim().slice(0, 100));
    } else if (!editValue.trim()) {
      setEditValue(project.name);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isEditing && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        handleConfirm();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isEditing, editValue, project.name]);

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <button
        type="button"
        onClick={onToggleProjectList}
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 bg-background/40 hover:bg-background/70 text-muted-foreground hover:text-foreground shadow-sm transition-colors",
          !onToggleProjectList && "opacity-40 pointer-events-none"
        )}
        title={isProjectListExpanded ? "Collapse Project List" : "Expand Project List"}
        data-testid="button-toggle-project-list"
      >
        {isProjectListExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") {
              setEditValue(project.name);
              setIsEditing(false);
            }
          }}
          onBlur={handleConfirm}
          className="bg-transparent border-b border-primary outline-none text-sm font-semibold text-foreground h-5 w-[calc(50vw-16rem)] min-w-[200px] max-w-[600px] p-0"
          maxLength={100}
        />
      ) : (
        <span
          className="text-sm font-semibold text-foreground truncate cursor-pointer group relative max-w-[calc(50vw-15rem)] min-w-[100px] select-none"
          onDoubleClick={() => {
            setIsEditing(true);
            setEditValue(project.name);
          }}
          title="Double click to rename project"
        >
          {project.name}
          <span className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground text-[10px] transition-opacity">
            ✏️
          </span>
        </span>
      )}
    </div>
  );
}
