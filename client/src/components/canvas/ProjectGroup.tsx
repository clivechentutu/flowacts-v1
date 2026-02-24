import { useState } from "react";
import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectGroup({
  label,
  icon,
  projects,
  defaultCollapsed = false,
  onProjectClick,
  onToggleFavorite,
  onTogglePin,
  onStartRename,
  onMarkCompleted,
  onReopen,
  onArchive,
  onUnarchive,
  onConfirmDelete
}: {
  label: string;
  icon: string;
  projects: Project[];
  defaultCollapsed?: boolean;
  onProjectClick: (id: string) => void;
  onToggleFavorite: (p: Project) => void;
  onTogglePin: (p: Project) => void;
  onStartRename: (p: Project) => void;
  onMarkCompleted: (p: Project) => void;
  onReopen: (p: Project) => void;
  onArchive: (p: Project) => void;
  onUnarchive: (p: Project) => void;
  onConfirmDelete: (p: Project) => void;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (projects.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Group header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        <span>{icon}</span>
        <span>{label}</span>
        <span className="text-muted-foreground/60">{projects.length} projects</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", collapsed && "-rotate-90")} />
      </button>

      {/* Card grid */}
      {!collapsed && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onClick={onProjectClick}
              onToggleFavorite={onToggleFavorite}
              onTogglePin={onTogglePin}
              onStartRename={onStartRename}
              onMarkCompleted={onMarkCompleted}
              onReopen={onReopen}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              onConfirmDelete={onConfirmDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
