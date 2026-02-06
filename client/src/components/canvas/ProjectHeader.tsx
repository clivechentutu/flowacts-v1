import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export interface ProjectInfo {
  id: string;
  icon: string;
  name: string;
}

interface ProjectHeaderProps {
  project: ProjectInfo;
  onRename: (newName: string) => void;
  onNewProject?: () => void;
}

export function ProjectHeader({ project, onRename, onNewProject }: ProjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (editValue.trim()) {
      onRename(editValue.trim().slice(0, 28));
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <button
        onClick={onNewProject}
        className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-1"
        title="New Project"
      >
        <Plus className="w-4 h-4" />
      </button>

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
          className="bg-transparent border-b border-primary outline-none text-sm font-semibold text-foreground h-5 w-[180px] p-0"
          maxLength={28}
        />
      ) : (
        <span
          className="text-sm font-semibold text-foreground truncate cursor-pointer group relative max-w-[200px] select-none"
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
