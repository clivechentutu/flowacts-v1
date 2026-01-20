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
  CheckCircle2
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
        </div>
    </div>
  );
}
