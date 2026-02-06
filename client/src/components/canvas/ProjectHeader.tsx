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
}

export function ProjectHeader({ project, onRename }: ProjectHeaderProps) {
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
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="text-base select-none">{project.icon}</span>
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
          className="bg-transparent border-b border-primary outline-none text-sm font-semibold text-foreground h-5 w-[200px] p-0"
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
          <span className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground text-[10px] transition-opacity absolute -right-4 top-0.5">
            ✏️
          </span>
        </span>
      )}
    </div>
  );
}
