import { useState, useEffect, useRef } from "react";
import { Shell } from "@/components/layout/Shell";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TaskNavigation } from "@/components/layout/TaskNavigation";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { FlowCanvas } from "@/components/canvas/FlowCanvas";
import { SCENARIOS, StoryEvent, GENERATED_FILES } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Sparkles, 
  Paperclip, 
  Globe, 
  Zap, 
  Brain, 
  ArrowRight,
  Layout,
  BarChart,
  Search,
  MessageSquare,
  Play,
  Target,
  BookOpen,
  Eye,
  CheckCircle,
  Plus,
  FileText,
  Image as ImageIcon,
  Video,
  Star,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  AtSign,
  Download,
  File,
  FileJson,
  Film,
  Image,
  CheckSquare,
  Square,
  X,
  Upload,
  Library,
  Users,
  MoreVertical,
  Trash2,
  Pencil,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PromptCard {
  id: string;
  title: string;
  description: string;
  icon: 'sparkles' | 'users' | 'check-square' | 'message-square';
  usageCount?: number;
  lastUsed?: string;
  category: 'creative' | 'product' | 'technical' | 'common';
}

const INITIAL_COMMON_PROMPTS: PromptCard[] = [
  { id: 'common-1', title: 'Daily Standup Update 1', description: 'Structure for summarizing daily progress, blockers, and next steps for the team.', icon: 'message-square', usageCount: 12, lastUsed: '2d ago', category: 'common' },
  { id: 'common-2', title: 'Daily Standup Update 2', description: 'Structure for summarizing daily progress, blockers, and next steps for the team.', icon: 'message-square', usageCount: 8, lastUsed: '3d ago', category: 'common' },
  { id: 'common-3', title: 'Daily Standup Update 3', description: 'Structure for summarizing daily progress, blockers, and next steps for the team.', icon: 'message-square', usageCount: 5, lastUsed: '5d ago', category: 'common' },
  { id: 'common-4', title: 'Daily Standup Update 4', description: 'Structure for summarizing daily progress, blockers, and next steps for the team.', icon: 'message-square', usageCount: 3, lastUsed: '1w ago', category: 'common' },
  { id: 'common-5', title: 'Daily Standup Update 5', description: 'Structure for summarizing daily progress, blockers, and next steps for the team.', icon: 'message-square', usageCount: 1, lastUsed: '2w ago', category: 'common' },
];

const INITIAL_RECOMMENDED_PROMPTS: PromptCard[] = [
  { id: 'rec-1', title: 'Creative Writing V1', description: 'Optimized for creative storytelling and world building with enhanced context.', icon: 'sparkles', category: 'creative' },
  { id: 'rec-2', title: 'Creative Writing V2', description: 'Optimized for creative storytelling and world building with enhanced context.', icon: 'sparkles', category: 'creative' },
  { id: 'rec-3', title: 'Creative Writing V3', description: 'Optimized for creative storytelling and world building with enhanced context.', icon: 'sparkles', category: 'creative' },
  { id: 'rec-4', title: 'Product Manager 1', description: 'Expert in agile methodologies, user research, and product strategy.', icon: 'users', category: 'product' },
  { id: 'rec-5', title: 'Product Manager 2', description: 'Expert in agile methodologies, user research, and product strategy.', icon: 'users', category: 'product' },
  { id: 'rec-6', title: 'Product Manager 3', description: 'Expert in agile methodologies, user research, and product strategy.', icon: 'users', category: 'product' },
  { id: 'rec-7', title: 'Competitor Analysis 1', description: 'Standard framework for analyzing market competitors and their feature sets.', icon: 'check-square', category: 'technical' },
  { id: 'rec-8', title: 'Competitor Analysis 2', description: 'Standard framework for analyzing market competitors and their feature sets.', icon: 'check-square', category: 'technical' },
  { id: 'rec-9', title: 'Competitor Analysis 3', description: 'Standard framework for analyzing market competitors and their feature sets.', icon: 'check-square', category: 'technical' },
];

function SortablePromptCard({ 
  card, 
  isOverlay = false, 
  onEdit, 
  onDelete 
}: { 
  card: PromptCard; 
  isOverlay?: boolean;
  onEdit?: (card: PromptCard) => void;
  onDelete?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'users': return <Users className="w-3.5 h-3.5 text-indigo-500" />;
      case 'check-square': return <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'message-square': return <MessageSquare className="w-3.5 h-3.5 text-primary" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative p-3 rounded-xl border bg-card transition-all group flex flex-col h-full shadow-sm",
        isOverlay ? "border-primary shadow-lg cursor-grabbing scale-105 z-50" : "border-border hover:bg-muted/50 hover:border-primary/50",
        card.category === 'common' && "cursor-grab active:cursor-grabbing"
      )}
      {...attributes}
      {...listeners}
    >
       <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1 rounded-md",
              card.icon === 'message-square' ? "bg-primary/10" : "bg-muted/50"
            )}>
               {getIcon(card.icon)}
            </div>
            {card.category === 'common' && (
               <div className="md:hidden">
                 <GripVertical className="w-3 h-3 text-muted-foreground/30" />
               </div>
            )}
          </div>
          
          {card.category === 'common' && !isOverlay && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onEdit?.(card)} className="text-xs">
                  <Pencil className="w-3 h-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(card.id)} className="text-xs text-destructive focus:text-destructive">
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
       </div>
       <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors truncate">{card.title}</div>
       <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
          {card.description}
       </p>
       {card.category === 'common' && (
         <div className="text-[10px] text-muted-foreground/60 font-mono mt-auto">
            Used {card.usageCount} times
         </div>
       )}
    </div>
  );
}

function DraggablePromptCard({ card }: { card: PromptCard }) {
  const {attributes, listeners, setNodeRef, isDragging} = useSortable({
    id: card.id,
    data: { card }
  });
  
  const style = {
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'users': return <Users className="w-3.5 h-3.5 text-indigo-500" />;
      case 'check-square': return <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'message-square': return <MessageSquare className="w-3.5 h-3.5 text-primary" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div 
       ref={setNodeRef} 
       style={style}
       {...attributes} 
       {...listeners}
       className="p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all group"
    >
       <div className="flex items-center gap-2 mb-2">
           {getIcon(card.icon)}
           <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">{card.title}</div>
       </div>
       <div className="text-[11px] text-muted-foreground line-clamp-2">{card.description}</div>
    </div>
  );
}

const HISTORY_TASKS = [
    {
        id: 'h1',
        title: 'Q4 Competitor Analysis Report',
        description: 'Comprehensive analysis of top 3 competitors in the SaaS market, focusing on pricing strategies and feature sets.',
        date: '2025-01-15',
        isFavorite: true,
        assets: { documents: 2, images: 5, videos: 0 }
    },
    {
        id: 'h2',
        title: 'Mobile App Onboarding Flow',
        description: 'User journey mapping for the new mobile onboarding experience, identifying drop-off points.',
        date: '2025-01-18',
        isFavorite: false,
        assets: { documents: 1, images: 8, videos: 1 }
    },
    {
        id: 'h3',
        title: 'Holiday Marketing Campaign',
        description: 'Visual assets and copy generation for the upcoming holiday season social media push.',
        date: '2025-01-19',
        isFavorite: true,
        assets: { documents: 3, images: 12, videos: 2 }
    },
    {
        id: 'h4',
        title: 'Feature Release Blog Post',
        description: 'Drafting announcement blog post for the new collaboration features.',
        date: '2025-01-20',
        isFavorite: true,
        assets: { documents: 1, images: 2, videos: 0 }
    },
    {
        id: 'h5',
        title: 'User Interview Script',
        description: 'Generating questions for user research interviews regarding the new dashboard.',
        date: '2025-01-20',
        isFavorite: false,
        assets: { documents: 1, images: 0, videos: 0 }
    },
    {
        id: 'h6',
        title: 'Landing Page Hero Copy',
        description: 'A/B testing copy variations for the main landing page value prop.',
        date: '2025-01-21',
        isFavorite: false,
        assets: { documents: 2, images: 0, videos: 0 }
    }
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'competitor', label: 'Competitor Analysis', icon: Layout },
  { id: 'product', label: 'Product Optimization', icon: Target },
  { id: 'learning', label: 'Structured Learning', icon: BookOpen },
  { id: 'ad', label: 'Ad Inspection', icon: Eye },
  { id: 'fact', label: 'Fact Verification', icon: CheckCircle },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'project' | 'library'>('home');
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<'all' | 'favorites'>('all');
  const [activeLibraryFilter, setActiveLibraryFilter] = useState<'all' | 'creative' | 'product' | 'technical'>('all');
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [viewMode, setViewMode] = useState<'canvas' | 'files'>('canvas');
  const [uploadedFiles, setUploadedFiles] = useState<StoryEvent[]>([]);
  const [activeFileTab, setActiveFileTab] = useState<'generated' | 'uploaded'>('generated');
  const [pages, setPages] = useState<string[]>(['Page 1']);
  const [activePage, setActivePage] = useState('Page 1');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const [commonPrompts, setCommonPrompts] = useState<PromptCard[]>(INITIAL_COMMON_PROMPTS);
  const [recommendedPrompts, setRecommendedPrompts] = useState<PromptCard[]>(INITIAL_RECOMMENDED_PROMPTS);
  const [editingCard, setEditingCard] = useState<PromptCard | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    // Handle drag between lists
    const activeId = active.id as string;
    const overId = over.id as string;

    const isCommonActive = commonPrompts.some(p => p.id === activeId);
    const isRecommendedActive = recommendedPrompts.some(p => p.id === activeId);
    
    // Check if dropping over a container or an item within a container
    const isOverCommonContainer = overId === 'common-prompts-container';
    const isOverCommonItem = commonPrompts.some(p => p.id === overId);
    
    const isOverRecommendedContainer = overId === 'recommended-prompts-container';
    const isOverRecommendedItem = recommendedPrompts.some(p => p.id === overId);

    // Moving from Recommended to Common
    if (isRecommendedActive && (isOverCommonContainer || isOverCommonItem)) {
      const item = recommendedPrompts.find(p => p.id === activeId);
      if (item) {
        setRecommendedPrompts(recommendedPrompts.filter(p => p.id !== activeId));
        setCommonPrompts([...commonPrompts, { ...item, category: 'common', usageCount: 0, lastUsed: 'Just now' }]);
        toast({ title: "Added to Common Prompts", description: `${item.title} moved to your favorites.` });
      }
      return;
    }

    // Moving from Common to Recommended (removing from common)
    if (isCommonActive && (isOverRecommendedContainer || isOverRecommendedItem)) {
      const item = commonPrompts.find(p => p.id === activeId);
      if (item) {
        setCommonPrompts(commonPrompts.filter(p => p.id !== activeId));
        // We restore it to recommended if it originally belonged there or just remove it
        // Ideally we check if it already exists or just add it back as a recommended template
        const originalCategory = item.icon === 'sparkles' ? 'creative' : item.icon === 'users' ? 'product' : 'technical';
        setRecommendedPrompts([...recommendedPrompts, { ...item, category: originalCategory }]);
        toast({ title: "Removed from Common Prompts", description: `${item.title} moved back to recommendations.` });
      }
      return;
    }

    // Reordering within Common Prompts
    if (isCommonActive && isOverCommonItem && activeId !== overId) {
      setCommonPrompts((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDeleteCard = (id: string) => {
    setCommonPrompts(commonPrompts.filter(p => p.id !== id));
    toast({ title: "Prompt Deleted", description: "The prompt has been removed from your list." });
  };

  const handleEditCard = (card: PromptCard) => {
    setEditingCard(card);
  };

  const saveEditedCard = (newTitle: string, newDesc: string) => {
    if (!editingCard) return;
    setCommonPrompts(commonPrompts.map(p => 
      p.id === editingCard.id ? { ...p, title: newTitle, description: newDesc } : p
    ));
    setEditingCard(null);
    toast({ title: "Changes Saved", description: "Your prompt has been updated." });
  };

  // Helper to find or reconstruct scenario from ID
  const getScenarioById = (id: string) => {
    const existing = SCENARIOS.find(s => s.id === id);
    if (existing) return existing;

    // Handle dummy scenarios
    if (id.startsWith('comp-dummy-')) {
        const index = parseInt(id.split('-').pop() || '0');
        return { ...SCENARIOS[0], id, name: `${SCENARIOS[0].name} ${index + 1}`, goal: `${SCENARIOS[0].goal} - Variant ${index + 1}` };
    }
    if (id.startsWith('ad-dummy-')) {
        const index = parseInt(id.split('-').pop() || '0');
        return { ...SCENARIOS[1], id, name: `${SCENARIOS[1].name} ${index + 1}`, goal: `${SCENARIOS[1].goal} - Variant ${index + 1}` };
    }
    if (id.startsWith('comp-')) {
         const index = parseInt(id.split('-').pop() || '0');
         return { ...SCENARIOS[0], id, name: `${SCENARIOS[0].name} ${index + 1}`, goal: `${SCENARIOS[0].goal} - Variant ${index + 1}` };
    }
    if (id.startsWith('ad-')) {
         const index = parseInt(id.split('-').pop() || '0');
         return { ...SCENARIOS[1], id, name: `${SCENARIOS[1].name} ${index + 1}`, goal: `${SCENARIOS[1].goal} - Variant ${index + 1}` };
    }
    if (id.startsWith('prod-')) {
         const template = { ...SCENARIOS[0], name: 'User Retention Flow Analysis', goal: 'Optimize retention rates', persona: 'Sarah, Product Owner' };
         const index = parseInt(id.split('-').pop() || '0');
         return { ...template, id, name: `${template.name} ${index + 1}`, goal: `${template.goal} - Variant ${index + 1}` };
    }
    if (id.startsWith('learn-')) {
         const template = { ...SCENARIOS[0], name: 'React Hooks Deep Dive', goal: 'Structure learning path', persona: 'Dev Student' };
         const index = parseInt(id.split('-').pop() || '0');
         return { ...template, id, name: `${template.name} ${index + 1}`, goal: `${template.goal} - Variant ${index + 1}` };
    }
    if (id.startsWith('fact-')) {
         const template = { ...SCENARIOS[1], name: 'News Source Verification', goal: 'Check multiple sources', persona: 'Journalist' };
         const index = parseInt(id.split('-').pop() || '0');
         return { ...template, id, name: `${template.name} ${index + 1}`, goal: `${template.goal} - Variant ${index + 1}` };
    }

    return SCENARIOS[0]; // Fallback
  };

  const [homeInput, setHomeInput] = useState("");
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const activeScenario = getScenarioById(activeScenarioId);

  // Simulate progressive revealing of the story
  useEffect(() => {
    if (activeTab !== 'project') return;
    
    setEvents([]);
    
    let timeout: NodeJS.Timeout;
    const playNextStep = (index: number) => {
      if (index >= activeScenario.events.length) return;
      const event = activeScenario.events[index];
      const delay = event.type === 'action' ? 2000 : event.type === 'ai' ? 1000 : 800;
      
      timeout = setTimeout(() => {
        setEvents(prev => [...prev, event]);
        playNextStep(index + 1);
      }, delay);
    };

    playNextStep(0);
    return () => clearTimeout(timeout);
  }, [activeScenarioId, activeTab]);

  const handleSendMessage = (message: string) => {
    toast({
      title: "Demo Mode",
      description: "This is a playback demo. Try switching scenarios to see different flows!",
    });
  };

  const handleScenarioClick = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setActiveTab('project');
  };

  const toggleFileSelection = (id: string) => {
      if (selectedFiles.includes(id)) {
          setSelectedFiles(selectedFiles.filter(fid => fid !== id));
      } else {
          setSelectedFiles([...selectedFiles, id]);
      }
  };

  const toggleAllFiles = () => {
      if (selectedFiles.length === GENERATED_FILES.length) {
          setSelectedFiles([]);
      } else {
          setSelectedFiles(GENERATED_FILES.map(f => f.id));
      }
  };

  const handleDownloadSelected = () => {
      toast({
          title: "Download Started",
          description: `Downloading ${selectedFiles.length} files...`,
      });
  };

  const handleAddPage = () => {
      const newPage = `Page ${pages.length + 1}`;
      setPages([...pages, newPage]);
      setActivePage(newPage);
      setEvents([]); // Clear AI chat events when adding a new page
      toast({
          title: "Page Added",
          description: `${newPage} has been created.`,
      });
  };


  const getFilteredScenarios = () => {
    // Helper to generate multiple dummy items based on a template
    const generateDummies = (template: typeof SCENARIOS[0], count: number, prefix: string) => {
      return Array.from({ length: count }).map((_, i) => ({
        ...template,
        id: `${prefix}-${i}`,
        name: `${template.name} ${i + 1}`,
        goal: `${template.goal} - Variant ${i + 1}`
      }));
    };

    let allScenarios: typeof SCENARIOS = [];
    
    // Define scenarios for each category
    const competitorScenarios = [SCENARIOS[0], ...generateDummies(SCENARIOS[0], 5, 'comp')];
    const adScenarios = [SCENARIOS[1], ...generateDummies(SCENARIOS[1], 5, 'ad')];
    const productScenarios = generateDummies({ ...SCENARIOS[0], name: 'User Retention Flow Analysis', goal: 'Optimize retention rates', persona: 'Sarah, Product Owner' }, 6, 'prod');
    const learningScenarios = generateDummies({ ...SCENARIOS[0], name: 'React Hooks Deep Dive', goal: 'Structure learning path', persona: 'Dev Student' }, 6, 'learn');
    const factScenarios = generateDummies({ ...SCENARIOS[1], name: 'News Source Verification', goal: 'Check multiple sources', persona: 'Journalist' }, 6, 'fact');

    if (activeCategory === 'all') {
        // Collect ALL scenarios from all categories
        return [
            ...competitorScenarios,
            ...adScenarios,
            ...productScenarios,
            ...learningScenarios,
            ...factScenarios
        ];
    } else if (activeCategory === 'competitor') {
        return competitorScenarios;
    } else if (activeCategory === 'ad') {
        return adScenarios;
    } else if (activeCategory === 'product') {
        return productScenarios;
    } else if (activeCategory === 'learning') {
        return learningScenarios;
    } else if (activeCategory === 'fact') {
        return factScenarios;
    }
    
    return [];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center h-full w-full bg-background relative overflow-y-auto">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none" />
            
            <div className="w-full max-w-[1400px] px-6 py-20 flex flex-col items-center gap-10 relative z-10">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-2 bg-primary/5 rounded-full mb-4">
                    <Sparkles className="w-5 h-5 text-primary mr-2" />
                    <span className="text-sm font-medium text-primary">AI-Powered Analysis Agent</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-heading">
                  What can I help you build?
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Describe your task, analyze a competitor, or simulate a user journey to get started.
                </p>
              </div>

              {/* Large Chat Input */}
              <div className="w-full relative group max-w-3xl">
                <div className="relative flex flex-col bg-card border border-border shadow-xl rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                  <textarea 
                    value={homeInput}
                    onChange={(e) => setHomeInput(e.target.value)}
                    placeholder="Ask anything... 'Analyze the signup flow for competitor.com'" 
                    className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none p-6 min-h-[120px] text-lg placeholder:text-muted-foreground/50 font-medium shadow-none ring-0 selection:bg-primary/20"
                  />
                  
                  <div className="flex justify-between items-center p-4 pt-0 border-t-0 bg-transparent">
                     <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg" title="Attach">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg" title="Call Roles">
                          <AtSign className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg" title="Search">
                          <Globe className="w-4 h-4" />
                        </Button>
                        
                        <div className="h-4 w-px bg-border mx-1 self-center" />
                        
                        <div 
                           role="button"
                           onClick={() => setIsThinkingMode(!isThinkingMode)}
                           className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                           <div className={cn(
                              "w-8 h-4 rounded-full relative transition-colors duration-300",
                              isThinkingMode ? "bg-indigo-500/20" : "bg-amber-500/20"
                           )}>
                              <div className={cn(
                                "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center",
                                isThinkingMode ? "left-[18px] bg-indigo-500" : "left-0.5 bg-amber-500"
                              )}>
                                {isThinkingMode ? <Brain className="w-2 h-2 text-white" /> : <Zap className="w-2 h-2 text-white fill-white" />}
                              </div>
                           </div>
                           <span className="text-xs font-medium text-muted-foreground">
                              {isThinkingMode ? "Deep Think" : "Fast"}
                           </span>
                        </div>
                     </div>
                     
                     <Button 
                        size="icon" 
                        className={cn(
                            "h-10 w-10 rounded-xl transition-all duration-300", 
                            homeInput.trim() ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90" : "bg-muted text-muted-foreground"
                        )}
                        disabled={!homeInput.trim()}
                        onClick={() => handleSendMessage(homeInput)}
                     >
                        <ArrowRight className="w-5 h-5" />
                     </Button>
                  </div>
                </div>
              </div>

              {/* History Tasks Section */}
              <div className="w-full space-y-4 mt-24 md:mt-32 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
                 <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Project
                        </h3>
                        
                        <div className="flex bg-muted/50 p-0.5 rounded-lg scale-90 origin-left">
                            <button 
                                onClick={() => setActiveHistoryFilter('all')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    activeHistoryFilter === 'all' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setActiveHistoryFilter('favorites')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                                    activeHistoryFilter === 'favorites' ? "bg-background shadow-sm text-amber-500" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Star className="w-3 h-3 fill-current" />
                                Favorites
                            </button>
                        </div>
                    </div>
                 </div>
                 
                 <div className="relative group/history">
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x scroll-smooth"
                    >
                        {HISTORY_TASKS
                            .filter(task => activeHistoryFilter === 'all' || task.isFavorite)
                            .map(task => (
                            <div 
                                key={task.id} 
                                className="snap-start shrink-0 w-[280px] group bg-card border border-border/60 hover:border-primary/30 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-[140px]"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1" title={task.title}>
                                            {task.title}
                                        </h4>
                                        {task.isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {task.description}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 mt-auto border-t border-dashed border-border/50">
                                    <div className="flex items-center gap-3">
                                        {task.assets.documents > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <FileText className="w-3 h-3" /> {task.assets.documents}
                                            </div>
                                        )}
                                        {task.assets.images > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <ImageIcon className="w-3 h-3" /> {task.assets.images}
                                            </div>
                                        )}
                                        {task.assets.videos > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Video className="w-3 h-3" /> {task.assets.videos}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                                        {task.date.slice(5)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {/* Spacer for right padding in scroll view */}
                        <div className="w-2 shrink-0" />
                    </div>

                    {/* Navigation Arrows */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all opacity-0 group-hover/history:opacity-100 z-20 hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all opacity-0 group-hover/history:opacity-100 z-20 hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* Categorized Scenarios */}
              <div className="w-full space-y-6 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                 {/* Tabs */}
                 <div className="flex items-center justify-center gap-1 p-1 bg-muted/30 rounded-xl overflow-x-auto no-scrollbar mx-auto w-full max-w-fit">
                    {CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                activeCategory === category.id 
                                    ? "bg-background text-primary shadow-sm ring-1 ring-border" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <category.icon className="w-4 h-4" />
                            {category.label}
                        </button>
                    ))}
                 </div>

                 {/* Cards Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
                    {getFilteredScenarios().map((scenario, idx) => (
                        <div 
                            key={scenario.id}
                            onClick={() => handleScenarioClick(scenario.id)}
                            className="group relative p-5 bg-card hover:bg-muted/50 border border-border rounded-2xl cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 flex flex-col gap-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                    idx % 2 === 0 ? "bg-primary/10 text-primary" : "bg-purple-500/10 text-purple-600"
                                )}>
                                    {activeCategory === 'competitor' ? <Layout className="w-5 h-5" /> : 
                                     activeCategory === 'ad' ? <Eye className="w-5 h-5" /> : 
                                     activeCategory === 'learning' ? <BookOpen className="w-5 h-5" /> :
                                     <Sparkles className="w-5 h-5" />}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary -mr-2 -mt-2">
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                                    {scenario.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {scenario.goal} - Simulating {scenario.persona}
                                </p>
                            </div>

                            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
                                <Play className="w-3 h-3 fill-current" />
                                <span>Start Simulation</span>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="flex flex-col h-full w-full bg-background p-6 overflow-y-auto">
             <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Library className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Library</h2>
             </div>
             
             <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
             >
             <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full">
                {/* User's Common Prompts */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        My Common Prompts
                     </h3>
                   </div>
                   
                   <SortableContext 
                      items={commonPrompts.map(p => p.id)}
                      strategy={rectSortingStrategy}
                   >
                     <div 
                        id="common-prompts-container"
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 min-h-[120px] p-2 -m-2 rounded-xl transition-colors border border-transparent hover:border-dashed hover:border-border/60 hover:bg-muted/5"
                     >
                        {commonPrompts.map(card => (
                           <SortablePromptCard 
                              key={card.id} 
                              card={card} 
                              onEdit={handleEditCard}
                              onDelete={handleDeleteCard}
                           />
                        ))}
                        {commonPrompts.length === 0 && (
                           <div className="col-span-full flex flex-col items-center justify-center h-full min-h-[120px] text-muted-foreground/40 border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                              <Star className="w-6 h-6 mb-2 opacity-50" />
                              <p className="text-sm font-medium">Drag recommended prompts here to save them</p>
                           </div>
                        )}
                     </div>
                   </SortableContext>
                </div>

                <div className="w-full h-px bg-border/60" />

                {/* Official Recommended Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        Official Recommendations
                     </h3>
                     <div className="flex bg-muted/50 p-0.5 rounded-lg text-xs">
                        <button 
                          onClick={() => setActiveLibraryFilter('all')}
                          className={cn(
                            "px-2.5 py-1 rounded-md transition-all font-medium",
                            activeLibraryFilter === 'all' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          All
                        </button>
                        <button 
                          onClick={() => setActiveLibraryFilter('creative')}
                          className={cn(
                            "px-2.5 py-1 rounded-md transition-all font-medium",
                            activeLibraryFilter === 'creative' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Creative
                        </button>
                        <button 
                          onClick={() => setActiveLibraryFilter('product')}
                          className={cn(
                            "px-2.5 py-1 rounded-md transition-all font-medium",
                            activeLibraryFilter === 'product' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Product
                        </button>
                        <button 
                          onClick={() => setActiveLibraryFilter('technical')}
                          className={cn(
                            "px-2.5 py-1 rounded-md transition-all font-medium",
                            activeLibraryFilter === 'technical' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Technical
                        </button>
                     </div>
                   </div>
                   
                   <SortableContext 
                      items={recommendedPrompts.map(p => p.id)}
                      strategy={rectSortingStrategy}
                   >
                     <div 
                       id="recommended-prompts-container"
                       className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 min-h-[120px] p-2 -m-2 rounded-xl transition-colors border border-transparent hover:border-dashed hover:border-border/60 hover:bg-muted/5"
                     >
                        {recommendedPrompts
                          .filter(card => activeLibraryFilter === 'all' || card.category === activeLibraryFilter)
                          .map(card => (
                             <SortablePromptCard key={card.id} card={card} />
                          ))}
                        
                        {recommendedPrompts.length === 0 && (
                           <div className="col-span-full flex flex-col items-center justify-center h-full min-h-[120px] text-muted-foreground/40 border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                              <Sparkles className="w-6 h-6 mb-2 opacity-50" />
                              <p className="text-sm font-medium">No recommendations available</p>
                           </div>
                        )}
                     </div>
                   </SortableContext>
                </div>
             </div>

             <DragOverlay>
                {activeDragId ? (
                  <SortablePromptCard 
                    card={
                      [...commonPrompts, ...recommendedPrompts].find(p => p.id === activeDragId)!
                    }
                    isOverlay
                  />
                ) : null}
             </DragOverlay>
             </DndContext>

             {/* Edit Dialog */}
             <Dialog open={!!editingCard} onOpenChange={(open) => !open && setEditingCard(null)}>
               <DialogContent>
                 <DialogHeader>
                   <DialogTitle>Edit Prompt</DialogTitle>
                   <DialogDescription>
                     Make changes to your saved prompt card here.
                   </DialogDescription>
                 </DialogHeader>
                 {editingCard && (
                   <div className="grid gap-4 py-4">
                     <div className="grid gap-2">
                       <Label htmlFor="title">Title</Label>
                       <Input 
                         id="title" 
                         defaultValue={editingCard.title} 
                         onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                       />
                     </div>
                     <div className="grid gap-2">
                       <Label htmlFor="desc">Description</Label>
                       <Textarea 
                         id="desc" 
                         defaultValue={editingCard.description} 
                         onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                       />
                     </div>
                   </div>
                 )}
                 <DialogFooter>
                   <Button variant="outline" onClick={() => setEditingCard(null)}>Cancel</Button>
                   <Button onClick={() => saveEditedCard(editingCard?.title || '', editingCard?.description || '')}>Save Changes</Button>
                 </DialogFooter>
               </DialogContent>
             </Dialog>
          </div>
        );
      case 'project':
      default:
        return (
          <>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-card/80 backdrop-blur-md p-1 rounded-lg border border-border shadow-sm">
              <button
                onClick={() => setViewMode('canvas')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  viewMode === 'canvas' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                Canvas
              </button>
              <button
                onClick={() => setViewMode('files')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  viewMode === 'files' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                Files
              </button>
            </div>
            
            {/* Page Management - Only visible in Canvas mode */}
            {viewMode === 'canvas' && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="flex items-center gap-0.5 bg-muted/10 backdrop-blur-[1px] p-0.5 rounded-lg border border-white/5 hover:border-border/20 transition-all group/pages">
                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => setActivePage(page)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[11px] transition-all duration-200 border border-transparent",
                                    activePage === page
                                        ? "bg-card/80 text-foreground font-medium shadow-sm border-border/30"
                                        : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/10"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <div className="w-px h-3 bg-border/20 mx-1" />
                        <button 
                            onClick={handleAddPage}
                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted/20 transition-colors text-muted-foreground/50 hover:text-foreground"
                            title="Add New Page"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
            
            <div className="relative w-full h-full">
                {/* Canvas is ALWAYS rendered underneath */}
                <FlowCanvas 
                    events={activePage === 'Page 1' ? events : []} 
                    droppedFiles={uploadedFiles} 
                    onFileDrop={(files) => setUploadedFiles(files)} 
                    onFileDelete={(id) => setUploadedFiles(prev => prev.filter(f => f.id !== id))}
                />

                {/* Files Overlay Panel - Absolute positioned, not replacing canvas */}
                {viewMode === 'files' && (
                    <>
                        {/* Backdrop for click-away to close */}
                        <div 
                            className="absolute inset-0 z-30 bg-transparent" 
                            onClick={() => setViewMode('canvas')}
                        />
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-4xl max-h-[calc(100vh-140px)] bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden z-40 flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top">
                            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-semibold tracking-tight">Files</h2>
                                    <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/50">
                                        <button
                                            onClick={() => setActiveFileTab('generated')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                                activeFileTab === 'generated' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Generated
                                        </button>
                                        <button
                                            onClick={() => setActiveFileTab('uploaded')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                                activeFileTab === 'uploaded' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Uploaded
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {activeFileTab === 'generated' && (
                                        <>
                                            <Button size="sm" onClick={handleDownloadSelected} className="gap-2 h-8 text-xs">
                                                <Download className="w-3.5 h-3.5" />
                                                {selectedFiles.length > 0 ? `Download (${selectedFiles.length})` : 'Download All'}
                                            </Button>
                                            <div className="w-px h-4 bg-border mx-1" />
                                        </>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                                        onClick={() => setViewMode('canvas')}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                        {activeFileTab === 'generated' ? (
                            <>
                                {/* Batch Selection Header */}
                                <div className="px-4 py-2 border-b border-border bg-muted/10 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                    <div className="flex items-center gap-3 w-8 shrink-0 justify-center">
                                        <Checkbox 
                                            checked={selectedFiles.length === GENERATED_FILES.length && GENERATED_FILES.length > 0} 
                                            onCheckedChange={toggleAllFiles}
                                            id="select-all-files"
                                        />
                                    </div>
                                    <div className="flex-1">File Name</div>
                                    <div className="w-24 text-right">Size</div>
                                    <div className="w-32 text-right">Date</div>
                                    <div className="w-10"></div>
                                </div>

                                <div className="overflow-y-auto p-2 space-y-1">
                                    {GENERATED_FILES.map((file, i) => (
                                        <div 
                                            key={file.id} 
                                            className={cn(
                                                "flex items-center gap-4 p-2 rounded-lg transition-all group",
                                                selectedFiles.includes(file.id) ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 w-8 shrink-0 justify-center">
                                                <Checkbox 
                                                    checked={selectedFiles.includes(file.id)} 
                                                    onCheckedChange={() => toggleFileSelection(file.id)}
                                                />
                                            </div>

                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={cn(
                                                    "h-9 w-9 rounded-md flex items-center justify-center shrink-0",
                                                    file.type === 'pdf' && "bg-red-500/10 text-red-500",
                                                    file.type === 'image' && "bg-blue-500/10 text-blue-500",
                                                    file.type === 'json' && "bg-amber-500/10 text-amber-500",
                                                    file.type === 'video' && "bg-purple-500/10 text-purple-500",
                                                )}>
                                                    {file.type === 'pdf' && <FileText className="w-4 h-4" />}
                                                    {file.type === 'image' && <Image className="w-4 h-4" />}
                                                    {file.type === 'json' && <FileJson className="w-4 h-4" />}
                                                    {file.type === 'video' && <Film className="w-4 h-4" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{file.type}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="w-24 text-right text-xs text-muted-foreground font-mono">{file.size}</div>
                                            <div className="w-32 text-right text-xs text-muted-foreground">{file.timestamp.split(' ')[1]}</div>
                                            
                                            <div className="w-10 flex justify-end">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Download className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Uploaded Files Header */}
                                <div className="px-4 py-2 border-b border-border bg-muted/10 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                    <div className="flex-1">File Name</div>
                                    <div className="w-24 text-right">Size</div>
                                    <div className="w-32 text-right">Date</div>
                                    <div className="w-10"></div>
                                </div>

                                <div className="overflow-y-auto p-2 space-y-1">
                                    {uploadedFiles.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                                                <Upload className="w-6 h-6 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-sm font-medium">No uploaded files</p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">Drag and drop files onto the canvas to add them.</p>
                                        </div>
                                    ) : (
                                        uploadedFiles.map((file) => (
                                            <div 
                                                key={file.id} 
                                                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="h-9 w-9 rounded-md flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-500">
                                                        {file.fileType === 'folder' ? <Layout className="w-4 h-4" /> : <File className="w-4 h-4" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm text-foreground truncate">{file.title}</p>
                                                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{file.fileType === 'folder' ? 'Folder' : 'File'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="w-24 text-right text-xs text-muted-foreground font-mono">{file.content}</div>
                                                <div className="w-32 text-right text-xs text-muted-foreground">{file.timestamp}</div>
                                                
                                                <div className="w-10 flex justify-end">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                                                            toast({ description: "File deleted" });
                                                        }}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    </>
                )}
            </div>
          </>
        );
    }
  };

  return (
    <Shell
      nav={
        <div className="flex h-full">
            <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <TaskNavigation activeTab={activeTab} />
        </div>
      }
      rightPanel={
        activeTab === 'project' ? (
            <ChatPanel 
              events={events} 
              onSendMessage={handleSendMessage} 
              persona={activeScenario.persona}
            />
        ) : null
      }
    >
      {renderContent()}
    </Shell>
  );
}
