import { useState } from "react";
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
  Settings,
  Brain,
  Search as SearchIcon,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen
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

export function TaskNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  
  const [tasks, setTasks] = useState([
    { id: 1, icon: FileText, label: 'Reverse Photo Search Keywords', starred: false },
    { id: 2, icon: Brain, label: 'AI Market Opportunities', starred: false },
    { id: 3, icon: LayoutGrid, label: 'Twitter Viewer Pricing', starred: true },
    { id: 4, icon: SearchIcon, label: 'AI Persona Tool Research', starred: true },
    { id: 5, icon: FileText, label: 'Website Data Storage Query', starred: false },
    { id: 6, icon: Brain, label: 'Shopify Plugin Research', starred: true },
  ]);

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTasks(tasks.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
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
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">New Task</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Search className="w-4 h-4" />
                    <span className="text-sm font-medium">Search</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Library className="w-4 h-4" />
                    <span className="text-sm font-medium">Library</span>
                </Button>
            </div>

            <Separator className="bg-border/50" />

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Projects Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-2">
                            <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Projects</h3>
                            <Plus className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                        </div>
                        <div className="space-y-0.5">
                            {['Erasa Related', 'Twitter Project', 'Opportunity Mining', 'Product Research', 'DR Related'].map((folder) => (
                                <Button key={folder} variant="ghost" className="w-full justify-start gap-2 h-8 px-2 text-muted-foreground hover:text-foreground">
                                    <Folder className="w-3.5 h-3.5" />
                                    <span className="text-sm truncate">{folder}</span>
                                </Button>
                            ))}
                            <Button variant="ghost" className="w-full justify-start gap-2 h-8 px-2 text-muted-foreground/50 hover:text-foreground">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                                <span className="text-sm">See More</span>
                            </Button>
                        </div>
                    </div>

                    {/* All Tasks Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-2">
                            <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">All Tasks</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("h-4 w-4 hover:bg-transparent", filterFavorites ? "text-primary" : "text-muted-foreground")}>
                                        <Filter className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setFilterFavorites(false)}>
                                        Show All
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterFavorites(true)}>
                                        Starred Only
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <TooltipProvider>
                            <div className="space-y-0.5">
                                {filteredTasks.map((task) => (
                                    <Tooltip key={task.id} delayDuration={300}>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                className={cn(
                                                    "w-full justify-start gap-2 h-8 px-2 group relative pr-8", // added padding right for star
                                                    task.id === 4 ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <task.icon className="w-3.5 h-3.5 shrink-0" />
                                                <span className="text-sm truncate flex-1 text-left">{task.label}</span>
                                                
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
                                        <TooltipContent side="right" sideOffset={10}>
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
