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

export function TaskNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);

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
                            <Filter className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                        </div>
                        <div className="space-y-0.5">
                            {[
                                { icon: FileText, label: 'Reverse Photo Search Keywords', starred: false },
                                { icon: Brain, label: 'AI Market Opportunities', starred: false },
                                { icon: LayoutGrid, label: 'Twitter Viewer Pricing', starred: true },
                                { icon: SearchIcon, label: 'AI Persona Tool Research', starred: true },
                                { icon: FileText, label: 'Website Data Storage Query', starred: false },
                                { icon: Brain, label: 'Shopify Plugin Research', starred: true },
                            ].map((task, i) => (
                                <Button key={i} variant="ghost" className={cn("w-full justify-start gap-2 h-8 px-2 group", i === 3 ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground")}>
                                    <task.icon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="text-sm truncate flex-1 text-left">{task.label}</span>
                                    {task.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
  );
}
