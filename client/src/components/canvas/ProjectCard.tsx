import { Project } from "@/types/project";
import { formatDistanceToNow, format } from "date-fns";
import { FileText, MoreHorizontal, Pin, Star, Pencil, Check, RotateCcw, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function timeAgo(dateString?: string) {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  return format(new Date(dateString), "MMM d, yyyy");
}

function DynamicStatus({ project }: { project: Project }) {
  if (project.containerStatus?.overall === "new_changes") {
    return (
      <span className="text-xs font-medium text-blue-400">
        🔵 {project.containerStatus.newChangesCount} new changes · {timeAgo(project.containerStatus.lastCheckedAt)}
      </span>
    );
  }

  if (project.containerStatus?.overall === "failed") {
    return (
      <span className="text-xs text-red-400">
        🔴 {project.containerStatus.count} failed · {timeAgo(project.containerStatus.lastCheckedAt)}
      </span>
    );
  }

  if (project.containerStatus?.overall === "running") {
    return (
      <span className="text-xs text-green-400">
        🟢 Running · updated {timeAgo(project.containerStatus.lastCheckedAt)}
      </span>
    );
  }

  if (project.containerStatus?.overall === "paused") {
    return (
      <span className="text-xs text-yellow-400">
        🟡 Paused
      </span>
    );
  }

  if (project.status === "completed") {
    return (
      <span className="text-xs text-muted-foreground">
        Completed {formatDate(project.completedAt)}
      </span>
    );
  }

  return (
    <span className="text-xs text-muted-foreground">
      Updated {timeAgo(project.updatedAt)}
    </span>
  );
}

export function ProjectCard({ 
  project,
  onClick,
  onToggleFavorite,
  onTogglePin,
  onStartRename,
  onMarkCompleted,
  onReopen,
  onArchive,
  onUnarchive,
  onConfirmDelete
}: { 
  project: Project;
  onClick: (id: string) => void;
  onToggleFavorite: (p: Project) => void;
  onTogglePin: (p: Project) => void;
  onStartRename: (p: Project) => void;
  onMarkCompleted: (p: Project) => void;
  onReopen: (p: Project) => void;
  onArchive: (p: Project) => void;
  onUnarchive: (p: Project) => void;
  onConfirmDelete: (p: Project) => void;
}) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-card p-4 cursor-pointer",
        "hover:border-primary/50 transition-colors",
        project.status === "completed" && "opacity-70",
        project.status === "archived" && "opacity-50"
      )}
      onClick={() => onClick(project.id)}
    >
      {/* Line 1: Title + actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className={cn(
          "text-sm font-medium line-clamp-2 flex-1",
          project.status === "active" ? "text-foreground" : "text-muted-foreground"
        )}>
          {project.status === "completed" && <span className="mr-1.5">✅</span>}
          {project.status === "archived" && <span className="mr-1.5">📦</span>}
          {project.name}
        </h3>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(project); }} 
            className="p-1 rounded hover:bg-muted"
          >
            <Star className={cn("w-4 h-4", project.isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1 rounded hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTogglePin(project); }}>
                <Pin className="w-4 h-4 mr-2" />
                {project.isPinned ? "Unpin" : "Pin to top"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(project); }}>
                <Star className={cn("w-4 h-4 mr-2", project.isFavorite ? "fill-amber-400 text-amber-400" : "")} />
                {project.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStartRename(project); }}>
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {project.status === "active" && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkCompleted(project); }}>
                  <Check className="w-4 h-4 mr-2" />
                  Mark as completed
                </DropdownMenuItem>
              )}
              {project.status === "completed" && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onReopen(project); }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reopen
                </DropdownMenuItem>
              )}
              {project.status !== "archived" && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(project); }}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              )}
              {project.status === "archived" && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUnarchive(project); }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Unarchive
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onConfirmDelete(project); }}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Line 2: Context summary (optional) */}
      {project.contextSummary && (
        <p className={cn(
          "text-xs truncate mt-1.5",
          project.status === "active" ? "text-muted-foreground" : "text-muted-foreground/60"
        )}>
          {project.contextSummary}
        </p>
      )}

      {/* Line 3: Dynamic status + Canvas count */}
      <div className="flex items-center justify-between mt-2">
        <DynamicStatus project={project} />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {project.canvasCount}
        </span>
      </div>
    </div>
  );
}
