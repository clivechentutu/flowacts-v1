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
  PanelLeftOpen,
  Edit,
  BarChart,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Trash2
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
  
  if (activeTab !== 'experience') return null;

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
                    <span className="text-sm font-medium">新建任务</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Search className="w-4 h-4" />
                    <span className="text-sm font-medium">搜索</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9 px-2">
                    <Library className="w-4 h-4" />
                    <span className="text-sm font-medium">库</span>
                </Button>
            </div>

            <Separator className="bg-border/50 mx-4 w-auto" />
            
            <ScrollArea className="flex-1">
                <div className="p-4 pt-4">
                    <h3 className="text-xs font-semibold text-muted-foreground/50 mb-2 px-2 uppercase tracking-wider">Projects</h3>
                    <div className="space-y-0.5">
                        {projects.map(project => (
                            <div key={project.id} className="group relative flex items-center w-full">
                                <TooltipProvider>
                                    <Tooltip delayDuration={500}>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                className={cn(
                                                    "w-full justify-start gap-3 h-9 px-2 text-muted-foreground hover:text-foreground font-normal pr-8",
                                                    project.isFavorite && "text-foreground font-medium"
                                                )}
                                            >
                                                <MessageSquare className="w-4 h-4 shrink-0" />
                                                <span className="truncate text-sm text-left flex-1 min-w-0">{project.title}</span>
                                                {project.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-[200px] break-words z-50">
                                            {project.title}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <div className="absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-muted">
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
            </ScrollArea>
        </div>
    </div>
  );
}
