import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Library, 
  Folder, 
  MoreHorizontal, 
  Filter, 
  Star, 
  FileText,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Edit,
  BarChart,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { StoryEvent } from "@/lib/mock-data";

interface TaskNavigationProps {
  events: StoryEvent[];
}

export function TaskNavigation({ events }: TaskNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  
  // Transform events into tasks
  const tasks = useMemo(() => {
    const actionEvents = events.filter(e => e.type === 'action');
    
    return actionEvents.map((event, index) => {
      // Determine status based on position
      // Last item is running, previous are completed
      // If it's the very last item of ALL events (including AI/User), it might be more accurate
      // But for now, let's use the logic from TaskSidebar
      const isLast = index === actionEvents.length - 1;
      const status = isLast ? 'running' : 'completed';
      
      return {
        id: event.id,
        icon: FileText, // Could vary based on metadata
        label: event.title || `Step ${index + 1}: ${event.content.slice(0, 30)}...`,
        starred: starredIds.has(event.id),
        status: status as 'running' | 'completed' | 'pending'
      };
    });
  }, [events, starredIds]);

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newStarred = new Set(starredIds);
    if (newStarred.has(id)) {
      newStarred.delete(id);
    } else {
      newStarred.add(id);
    }
    setStarredIds(newStarred);
  };

  const filteredTasks = filterFavorites ? tasks.filter(t => t.starred) : tasks;

  return (
    <div 
      className={cn(
        "h-full relative transition-all duration-300 ease-in-out z-20 flex-shrink-0",
        isExpanded ? "w-64" : "w-0" 
      )}
    >
        {/* Toggle Button - positioned on the right edge */}
        <div className="absolute top-6 -right-3 z-50">
             <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 rounded-full shadow-md border border-border"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {isExpanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
        </div>

      <div className={cn(
          "h-full w-64 bg-card/95 backdrop-blur-xl border-r border-border flex flex-col overflow-hidden transition-opacity duration-200",
          isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
            {/* Top Actions */}
            <div className="p-4 space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">New Task</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Search className="w-4 h-4" />
                    <span className="text-sm font-medium">Search</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Library className="w-4 h-4" />
                    <span className="text-sm font-medium">Library</span>
                </Button>
            </div>

            <Separator className="bg-border/50" />

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Projects Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-2 group cursor-pointer">
                            <h3 className="text-xs font-semibold text-muted-foreground/70">Projects</h3>
                            <Plus className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground" />
                        </div>
                        <div className="space-y-0.5">
                            {['Competitor Analysis', 'User Journey Mapping', 'Market Research', 'Feature Validation'].map((folder) => (
                                <Button key={folder} variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-muted-foreground hover:text-foreground">
                                    <Folder className="w-4 h-4" />
                                    <span className="text-sm truncate">{folder}</span>
                                </Button>
                            ))}
                            <Button variant="ghost" className="w-full justify-start gap-3 h-8 px-2 text-muted-foreground/50 hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="text-sm">View More</span>
                            </Button>
                        </div>
                    </div>

                    {/* All Tasks Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-2">
                            <h3 className="text-xs font-semibold text-muted-foreground/70">All Tasks</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("h-4 w-4 hover:bg-transparent", filterFavorites ? "text-primary" : "text-muted-foreground")}>
                                        <Filter className="w-3.5 h-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setFilterFavorites(false)}>
                                        Show All
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterFavorites(true)}>
                                        Favorites Only
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <TooltipProvider>
                            <div className="space-y-0.5">
                                {filteredTasks.length === 0 && (
                                  <div className="text-xs text-muted-foreground px-2 py-4 italic">
                                    {events.length === 0 ? "Waiting for tasks..." : "No matching tasks found"}
                                  </div>
                                )}
                                {filteredTasks.map((task) => (
                                    <Tooltip key={task.id} delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                className={cn(
                                                    "w-full justify-start gap-3 h-8 px-2 group relative pr-8 transition-colors", 
                                                    task.status === 'running' ? "bg-primary/5 text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <div className="relative shrink-0 w-4 h-4 flex items-center justify-center">
                                                    {/* Status Icon Logic */}
                                                    {task.status === 'running' ? (
                                                       <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                                                    ) : task.status === 'completed' ? (
                                                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                    ) : (
                                                       <Circle className="w-3.5 h-3.5" />
                                                    )}
                                                </div>
                                                
                                                <span className={cn(
                                                  "text-sm truncate flex-1 text-left font-normal",
                                                  task.status === 'completed' && "line-through opacity-70"
                                                )}>{task.label}</span>
                                                
                                                <div 
                                                    role="button"
                                                    onClick={(e) => toggleStar(e, task.id)}
                                                    className={cn(
                                                        "absolute right-2 top-1/2 -translate-y-1/2 transition-opacity",
                                                        task.starred ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                    )}
                                                >
                                                    <Star className={cn("w-3.5 h-3.5", task.starred ? "text-amber-400 fill-amber-400" : "text-muted-foreground hover:text-foreground")} />
                                                </div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" sideOffset={10} className="max-w-[300px] break-words">
                                            {task.label}
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
  );
}
