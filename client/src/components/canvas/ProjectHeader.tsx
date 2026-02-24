import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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
      onRename(editValue.trim().slice(0, 100));
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">

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
