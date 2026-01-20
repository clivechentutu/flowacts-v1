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

export function TaskNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  
  const [tasks, setTasks] = useState([
    { id: 1, icon: FileText, label: 'Reverse Photo Search Keywords Optimization', starred: false, status: 'completed' },
    { id: 2, icon: Brain, label: '挖掘AI领域新机会及适合项目方向', starred: false, status: 'running' },
    { id: 3, icon: LayoutGrid, label: 'Twitter Viewer Subscription Pricing Research', starred: true, status: 'completed' },
    { id: 4, icon: SearchIcon, label: 'AI用户角色模拟分析工具市场调研', starred: true, status: 'pending' },
    { id: 5, icon: FileText, label: '网站数据存储和删除操作查询及整合', starred: false, status: 'pending' },
    { id: 6, icon: Brain, label: 'Shopify插件市场AI产品调研与分析', starred: true, status: 'completed' },
    { id: 7, icon: BarChart, label: '监测并分析7天内多平台更新变化', starred: false, status: 'pending' },
    { id: 8, icon: MessageSquare, label: 'Creating SEO-Friendly Blog Content Strategy', starred: false, status: 'pending' },
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
