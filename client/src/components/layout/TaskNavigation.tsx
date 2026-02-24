import { useState } from "react";
import { 
  ChevronRight,
  ChevronLeft,
  Edit,
  Search,
  MessageSquare,
  Star,
  MoreHorizontal,
  Trash2,
  Pencil,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TaskNavigation({ activeTab }: { activeTab: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects] = useState([
    { id: 'p1', title: 'Competitor Analysis - Q3 Report', isFavorite: true },
    { id: 'p2', title: 'New Product Launch Marketing Strategy', isFavorite: false },
    { id: 'p3', title: 'User Interview Notes - Batch 2', isFavorite: false },
    { id: 'p4', title: 'Website Redesign Feedback Collection', isFavorite: true },
    { id: 'p5', title: 'Q4 Budget Planning', isFavorite: false },
  ]);
  const [activeProjectId, setActiveProjectId] = useState<string>('p1');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const toggleProjectFavorite = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = () => {
    if (editingId && editTitle.trim()) {
      setProjects(projects.map(p => p.id === editingId ? { ...p, title: editTitle.trim() } : p));
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveRename();
    if (e.key === 'Escape') setEditingId(null);
  };
  
  if (activeTab !== 'project') return null;

  return (
    <div className="h-full z-20 flex-shrink-0 flex flex-row relative group">
        {/* Sidebar Container */}
        <div 
          className={cn(
            "h-full bg-[var(--sidebar-background)] backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden border-r border-border",
            isExpanded ? "w-64" : "w-0 border-r-0" 
          )}
        >
            <div className="w-64 h-full flex flex-col">
                {/* Top Actions */}
                <div className="p-4 space-y-1 flex-shrink-0">
                    <div className="flex items-center w-full">
                      <Button variant="ghost" className="flex-1 justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                          <Edit className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">New Project</span>
                      </Button>
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 rounded-md ml-1">
                              <Info className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center" className="max-w-[250px] p-3 text-sm z-50 bg-popover text-popover-foreground border border-border shadow-md rounded-lg">
                            <p className="font-semibold mb-1 text-foreground">Projects contain pages</p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              A project is a collection of related pages. You can create multiple pages within a single project to organize your work.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                        <Search className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">Search</span>
                    </Button>
                </div>

                <Separator className="bg-border/50 mx-4 w-auto flex-shrink-0" />
                
                {/* Projects List */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
                    <div className="p-4 pt-4">
                        <h3 className="text-xs font-semibold text-muted-foreground/50 mb-2 px-2 uppercase tracking-wider flex-shrink-0">Projects</h3>
                        <div className="flex flex-col gap-0.5 w-full">
                            {projects.map(project => {
                                const isActive = activeProjectId === project.id;
                                return (
                                <div 
                                    key={project.id} 
                                    className={cn(
                                        "group/item relative w-full rounded-md transition-all duration-200",
                                        isActive 
                                            ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]" 
                                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    )}
                                    onClick={() => setActiveProjectId(project.id)}
                                >
                                    <TooltipProvider>
                                        <Tooltip delayDuration={500}>
                                            <TooltipTrigger asChild>
                                                <div 
                                                    className={cn(
                                                        "grid grid-cols-[16px_1fr_auto] gap-3 items-center h-9 px-2 w-full cursor-pointer transition-colors",
                                                        isActive && "font-semibold"
                                                    )}
                                                >
                                                    <MessageSquare className={cn("w-4 h-4 flex-shrink-0 transition-transform", isActive && "scale-110")} />
                                                    {editingId === project.id ? (
                                                        <Input
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            onBlur={saveRename}
                                                            className="h-6 py-0 px-1 text-sm bg-background border-primary/30 focus-visible:ring-1 focus-visible:ring-primary/40"
                                                            autoFocus
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    ) : (
                                                        <span className="truncate text-sm text-left select-none min-w-0">
                                                            {project.title}
                                                        </span>
                                                    )}
                                                    {project.isFavorite && !editingId && (
                                                        <Star className={cn(
                                                            "w-3 h-3 flex-shrink-0",
                                                            isActive ? "text-primary fill-primary/20" : "text-amber-500 fill-amber-500"
                                                        )} />
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="max-w-[200px] break-words z-50">
                                                {project.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Dropdown Menu - Absolute positioned */}
                                    <div className={cn(
                                        "absolute right-0 top-0 bottom-0 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center pl-2 pr-1",
                                        isActive ? "bg-transparent" : "bg-gradient-to-l from-muted/50 via-muted/50 to-transparent"
                                    )}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className={cn(
                                                        "h-7 w-7 shadow-sm",
                                                        isActive ? "hover:bg-primary/20" : "hover:bg-background/80"
                                                    )}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" side="right" className="w-40" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleProjectFavorite(project.id); }}>
                                                    <Star className={cn("w-4 h-4 mr-2", project.isFavorite ? "fill-amber-400 text-amber-400" : "")} />
                                                    {project.isFavorite ? 'Unfavorite' : 'Favorite'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); startRename(project.id, project.title); }}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Rename
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Toggle Button Wrapper - Sits outside the overflow-hidden container */}
        <div className="h-full w-0 relative z-50">
             <Button
                variant="secondary"
                size="icon"
                className="absolute top-[8.75rem] -left-3 h-6 w-6 rounded-full shadow-md border border-border"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {isExpanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
        </div>
    </div>
  );
}
