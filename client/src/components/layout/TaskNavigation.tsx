import { useState } from "react";
import { 
  ChevronRight,
  ChevronLeft,
  Edit,
  Search,
  MessageSquare,
  Star,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

  const toggleProjectFavorite = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
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
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                        <Edit className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">New Project</span>
                    </Button>
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
                            {projects.map(project => (
                                <div key={project.id} className="group/item relative w-full hover:bg-muted/50 rounded-md transition-colors">
                                    <TooltipProvider>
                                        <Tooltip delayDuration={500}>
                                            <TooltipTrigger asChild>
                                                <div 
                                                    className={cn(
                                                        "grid grid-cols-[16px_1fr_auto] gap-3 items-center h-9 px-2 w-full cursor-pointer text-muted-foreground hover:text-foreground transition-colors",
                                                        project.isFavorite && "text-foreground font-medium"
                                                    )}
                                                >
                                                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                                    <span className="truncate text-sm text-left select-none min-w-0">
                                                        {project.title}
                                                    </span>
                                                    {project.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="max-w-[200px] break-words z-50">
                                                {project.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Dropdown Menu - Absolute positioned */}
                                    <div className="absolute right-0 top-0 bottom-0 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center bg-gradient-to-l from-muted/50 via-muted/50 to-transparent pl-2 pr-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background/80 shadow-sm">
                                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" side="right" className="w-40">
                                                <DropdownMenuItem onClick={() => toggleProjectFavorite(project.id)}>
                                                    <Star className={cn("w-4 h-4 mr-2", project.isFavorite ? "fill-amber-400 text-amber-400" : "")} />
                                                    {project.isFavorite ? 'Unfavorite' : 'Favorite'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteProject(project.id)} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
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
