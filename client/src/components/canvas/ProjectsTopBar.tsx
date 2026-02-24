import { Project } from "@/types/project";
import { Search, Plus } from "lucide-react";

export function ProjectsTopBar({
  searchQuery,
  setSearchQuery,
  onNewProject
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNewProject: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-foreground">Projects</h1>
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-md w-64 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* New Project button */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>
    </div>
  );
}