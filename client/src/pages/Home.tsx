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
  GripVertical,
  FolderKanban,
  Layers,
  Megaphone,
  Lightbulb,
  Map,
  Database,
  Info,
  AlignLeft,
  Table,
  ListTodo
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
  useDroppable,
  useDraggable
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

import { PageBottomNav } from "@/components/canvas/PageBottomNav";
import { PageTab } from "@/components/canvas/PageTabNav";
import { ProjectHeader, ProjectInfo } from "@/components/canvas/ProjectHeader";
import { TopRightToolbar } from "@/components/canvas/TopRightToolbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PromptCard {
  id: string;
  title: string;
  description: string;
  icon: 'sparkles' | 'users' | 'check-square' | 'message-square';
  usageCount?: number;
  lastUsed?: string;
  category: 'creative' | 'product' | 'technical' | 'common';
}

import analystAvatar from '@/assets/avatars/analyst.jpg';
import pmAvatar from '@/assets/avatars/pm.jpg';
import uxAvatar from '@/assets/avatars/ux.jpg';
import marketingAvatar from '@/assets/avatars/marketing.jpg';
import dataAvatar from '@/assets/avatars/data.jpg';

import caseOnboardingImg from '@/assets/images/case-onboarding.jpg';
import casePricingImg from '@/assets/images/case-pricing.jpg';
import caseUxAuditImg from '@/assets/images/case-ux-audit.jpg';

interface Persona {
  id: string;
  role: string;
  mission: string;
  deliverables: string[];
  value: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  personaIds: string[];
  status: 'active' | 'pool';
}

type PersonaGroup = {
  id: string;
  title: string;
  description: string;
  icon: any;
  personas: Persona[];
};

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'p-1',
    role: 'Competitive Intelligence Analyst',
    mission: 'Collect, organize, and preliminarily analyze competitive intelligence to build an intelligence database.',
    deliverables: ['Competitor Profiles', 'Intel Briefs', 'Dynamic Reports'],
    value: 'Information Advantage & Early Warning',
    avatar: analystAvatar
  },
  {
    id: 'p-2',
    role: 'Product Manager',
    mission: 'Make product decisions based on intelligence, defining roadmaps and differentiation.',
    deliverables: ['Competitive Analysis', 'Feature Matrix', 'Roadmap Updates'],
    value: 'Strategic Guidance & Market Differentiation',
    avatar: pmAvatar
  },
  {
    id: 'p-3',
    role: 'UX Researcher',
    mission: 'Evaluate competitor UX to identify design strengths, weaknesses, and opportunities.',
    deliverables: ['UX Analysis Report', 'Journey Comparison', 'Usability Benchmarks'],
    value: 'UX Benchmarking & Design Support',
    avatar: uxAvatar
  },
  {
    id: 'p-4',
    role: 'Product Marketing Manager',
    mission: 'Analyze competitor market strategy, positioning, and messaging.',
    deliverables: ['Market Positioning', 'Messaging Framework', 'Content Strategy'],
    value: 'Market Differentiation & Clear Positioning',
    avatar: marketingAvatar
  },
  {
    id: 'p-5',
    role: 'Data Analyst',
    mission: 'Collect and analyze quantitative data to provide objective competitive assessments.',
    deliverables: ['Competitive Dashboard', 'Market Share Analysis', 'Sentiment Analysis'],
    value: 'Objective Assessment & Data-Driven Decisions',
    avatar: dataAvatar
  }
];

function MiniPersonaCard({ persona, onClick }: { persona: Persona; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: persona.id,
    data: { type: 'persona', persona }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-grab active:cursor-grabbing group transition-colors border border-transparent hover:border-border/50"
    >
       <div className="w-10 h-10 rounded-full bg-muted/50 overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform">
          <img src={persona.avatar} alt={persona.role} className="w-full h-full object-cover" />
       </div>
       <div className="flex-1 min-w-0 text-left">
          <div className="font-medium text-xs text-foreground truncate">{persona.role}</div>
          <div className="text-[10px] text-muted-foreground truncate opacity-80 group-hover:opacity-100">
             Official Agent
          </div>
       </div>
       <Info className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
    </div>
  );
}
function PersonaCard({ persona, isDraggable = false, dragId }: { persona: Persona; isDraggable?: boolean; dragId?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: dragId || persona.id,
    data: { type: 'persona', persona }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const content = (
    <div className={cn(
      "p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-md relative overflow-hidden",
      isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
    )}>
       {/* Avatar Header */}
       <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 mb-3 overflow-hidden border-2 border-background shadow-sm group-hover:scale-105 transition-transform duration-300 ring-2 ring-primary/10 group-hover:ring-primary/30">
             <img src={persona.avatar} alt={persona.role} className="w-full h-full object-cover" />
          </div>
          <div className="font-bold text-xs leading-tight text-foreground px-2">{persona.role}</div>
       </div>

       <div className="space-y-3 flex-1 flex flex-col relative z-10">
          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
             <p className="text-[10px] text-foreground/80 leading-tight line-clamp-3">{persona.mission}</p>
          </div>

          <div>
             <div className="flex flex-wrap gap-1">
                {persona.deliverables.slice(0, 2).map(d => (
                   <span key={d} className="text-[9px] px-1.5 py-0.5 bg-background rounded-md border border-border text-muted-foreground/90 font-medium shadow-sm">{d}</span>
                ))}
             </div>
          </div>

           <div className="mt-auto pt-2 border-t border-dashed border-border/50">
             <p className="text-[10px] font-semibold text-primary/90 truncate">{persona.value}</p>
          </div>
       </div>
       <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
    </div>
  );

  if (isDraggable) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {content}
      </div>
    );
  }

  return content;
}

function TeamSection({ 
  team, 
  personas, 
  onAddPersona 
}: { 
  team: Team; 
  personas: Persona[]; 
  onAddPersona: () => void 
}) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: team.id,
    data: { type: 'team', teamId: team.id }
  });

  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: `drag-team-${team.id}`,
    data: { type: 'team-card', team }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
        ref={setDraggableRef}
        style={style}
        {...attributes} 
        {...listeners}
        className={cn("group/team relative h-full", isDragging && "z-50")}
    >
        <div 
        ref={setDroppableRef}
        className={cn(
            "p-6 rounded-2xl border-2 border-dashed transition-all min-h-[400px] flex flex-col h-full",
            isOver ? "border-primary bg-primary/5 shadow-inner scale-[1.01]" : "border-border bg-muted/20",
            // Add a grab handle cursor for the team card header area if we want, or just make the whole thing draggable but maybe exclude content?
            // Actually, for team dragging, usually we want a specific handle or make the header draggable.
            // But let's make the whole card draggable for now, but we need to ensure inner elements are still interactive.
            // To fix interaction: useDraggable usually handles this, but inputs inside might be tricky.
        )}
        >
        <div className="flex items-center justify-between mb-6 cursor-grab active:cursor-grabbing">
            <div>
            <h4 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {team.name}
            </h4>
            <p className="text-sm text-muted-foreground">{team.description}</p>
            </div>
            <div className="flex items-center gap-2">
                 <div className="bg-background px-3 py-1 rounded-full text-xs font-semibold border shadow-sm">
                    {team.personaIds.length} Members
                </div>
                {/* Drag Handle Indicator */}
                <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover/team:text-muted-foreground transition-colors" />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start cursor-default" onPointerDown={(e) => e.stopPropagation()}>
            {team.personaIds.map(id => {
            const persona = personas.find(p => p.id === id);
            if (!persona) return null;
            return <PersonaCard key={`${team.id}-${id}`} dragId={`${team.id}::${id}`} persona={persona} isDraggable />;
            })}
            
            {team.personaIds.length === 0 && !isOver && (
            <div className="col-span-full flex flex-col items-center justify-center h-48 text-muted-foreground opacity-50">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-2">
                <Plus className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Drag AI characters here</p>
            </div>
            )}
        </div>
        </div>
    </div>
  );
}

function DroppableWorkspace({ teams, personas, className }: { teams: Team[], personas: Persona[], className?: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'workspace-zone',
    data: { type: 'workspace-zone' }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "bg-muted/10 p-6 rounded-2xl border-2 border-dashed transition-all",
        isOver ? "border-primary bg-primary/5" : "border-border/60",
        className
      )}
    >
      {teams.length === 0 ? (
        <div className="h-full py-12 flex flex-col items-center justify-center text-muted-foreground opacity-60">
          <p className="text-sm font-medium">Drag entire teams here to activate them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {teams.map(team => (
            <TeamSection 
              key={team.id} 
              team={team} 
              personas={personas}
              onAddPersona={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DroppableTeamPool({ teams, personas }: { teams: Team[], personas: Persona[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'pool-zone',
    data: { type: 'pool-zone' }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "min-h-[200px] transition-all p-4 -m-4 rounded-2xl",
        isOver ? "bg-muted/20" : ""
      )}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {teams.map(team => (
          <TeamSection 
            key={team.id} 
            team={team} 
            personas={personas}
            onAddPersona={() => {}}
          />
        ))}
      </div>
      {teams.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground opacity-60 border-2 border-dashed border-border/40 rounded-xl">
          <p className="text-sm">No teams in pool</p>
        </div>
      )}
    </div>
  );
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
        assets: { documents: 2, images: 5, videos: 0 },
        thumbnail: "/thumbnails/dashboard.jpg"
    },
    {
        id: 'h2',
        title: 'Mobile App Onboarding Flow',
        description: 'User journey mapping for the new mobile onboarding experience, identifying drop-off points.',
        date: '2025-01-18',
        isFavorite: false,
        assets: { documents: 1, images: 8, videos: 1 },
        thumbnail: "/thumbnails/mobile-flow.jpg"
    },
    {
        id: 'h3',
        title: 'Holiday Marketing Campaign',
        description: 'Visual assets and copy generation for the upcoming holiday season social media push.',
        date: '2025-01-19',
        isFavorite: true,
        assets: { documents: 3, images: 12, videos: 2 },
        thumbnail: "/thumbnails/kanban.jpg"
    },
    {
        id: 'h4',
        title: 'Feature Release Blog Post',
        description: 'Drafting announcement blog post for the new collaboration features.',
        date: '2025-01-20',
        isFavorite: true,
        assets: { documents: 1, images: 2, videos: 0 },
        thumbnail: "/thumbnails/doc.jpg"
    },
    {
        id: 'h5',
        title: 'User Interview Script',
        description: 'Generating questions for user research interviews regarding the new dashboard.',
        date: '2025-01-20',
        isFavorite: false,
        assets: { documents: 1, images: 0, videos: 0 },
        thumbnail: "/thumbnails/code.jpg"
    },
    {
        id: 'h6',
        title: 'Landing Page Hero Copy',
        description: 'A/B testing copy variations for the main landing page value prop.',
        date: '2025-01-21',
        isFavorite: false,
        assets: { documents: 2, images: 0, videos: 0 },
        thumbnail: "/thumbnails/landing.jpg"
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

const AI_ROLES: Record<string, { avatar: string; name: string; description: string }> = {
  scout: {
    avatar: uxAvatar,
    name: "Scout",
    description: "Browses websites and navigates through pages"
  },
  analyst: {
    avatar: analystAvatar,
    name: "Analyst",
    description: "Analyzes data, patterns, and strategies"
  },
  reporter: {
    avatar: marketingAvatar,
    name: "Reporter",
    description: "Synthesizes findings into clear reports"
  },
  capturer: {
    avatar: pmAvatar,
    name: "Capturer",
    description: "Takes screenshots and captures visual evidence"
  },
  comparator: {
    avatar: dataAvatar,
    name: "Comparator",
    description: "Compares and contrasts multiple sources"
  }
};

function RoleMention({ role }: { role: string }) {
  const roleData = AI_ROLES[role];
  if (!roleData) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center mr-1.5 transition-all hover:scale-105 relative cursor-default">
            <span className="text-primary/70 mr-0.5 text-lg font-light leading-none">@</span>
            <div className="w-6 h-6 rounded-full ring-1 ring-border/50 overflow-hidden bg-muted shadow-sm">
              <img src={roleData.avatar} alt={roleData.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg max-w-[200px]">
          <p className="font-semibold text-sm text-foreground">{roleData.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{roleData.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const DEMO_PAGES: PageTab[] = [
  {
    id: "p1",
    icon: "🔍",
    title: "Signup Flow",
    completedSteps: 4,
    totalSteps: 5,
    status: "completed",
    isActive: true
  },
  {
    id: "p2",
    icon: "⚖️",
    title: "Pricing Compare",
    completedSteps: 2,
    totalSteps: 5,
    status: "running",
    isActive: false
  },
  {
    id: "p3",
    icon: "📋",
    title: "Features Audit",
    completedSteps: 0,
    totalSteps: 0,
    status: "idle",
    isActive: false
  }
];

const getPageIcon = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.match(/analyze|audit|check|review|inspect/)) return "🔍";
  if (lower.match(/compare|vs|versus|difference|benchmark/)) return "⚖️";
  if (lower.match(/pricing|price|cost|plan|subscription/)) return "💰";
  if (lower.match(/signup|register|onboard|login|auth/)) return "📝";
  if (lower.match(/mobile|responsive|phone|tablet/)) return "📱";
  if (lower.match(/landing|homepage|hero/)) return "🏠";
  return "📋";
};

const generatePageTitle = (text: string, count: number): string => {
    // Naive extraction logic based on instructions
    // Extract core object + action
    
    const lower = text.toLowerCase();
    let title = `Task ${count + 1}`;

    // Common patterns
    if (lower.includes('signup') && lower.includes('flow')) title = "Signup Flow";
    else if (lower.includes('pricing') && lower.includes('compare')) title = "Pricing Compare";
    else if (lower.includes('mobile') && lower.includes('check')) title = "Mobile Check";
    else if (lower.includes('checkout')) title = "Checkout Audit";
    else if (lower.includes('onboarding')) title = "Onboarding";
    else if (lower.includes('landing') && lower.includes('analy')) title = "Landing Analysis";
    else {
        // Fallback: First 2 meaningful words
        const words = text.split(' ').filter(w => w.length > 2 && !['the', 'of', 'and', 'for', 'to'].includes(w.toLowerCase()));
        if (words.length >= 2) {
             title = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        } else if (words.length === 1) {
             title = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        }
    }

    if (title.length > 18) title = title.slice(0, 17) + '…';
    return title;
};

const generateProjectName = (text: string): string => {
    // Extract target + goal
    const lower = text.toLowerCase();
    let name = "Untitled Project";
    
    // Attempt to find a target (domain or brand)
    const words = text.split(' ');
    let target = "";
    
    // Look for domains or capitalized words (heuristic)
    const domainMatch = text.match(/([a-zA-Z0-9-]+\.(com|io|net|so|org))/);
    if (domainMatch) {
        target = domainMatch[1].split('.')[0];
        target = target.charAt(0).toUpperCase() + target.slice(1);
    } else {
        // Look for brands (often capitalized in prompt, but we have lower here... wait)
        // Let's use the original text for brand detection if possible, but `text` arg is sufficient
        const potentialBrand = words.find(w => w[0] === w[0].toUpperCase() && w.length > 3 && !['Analyze', 'Check', 'Audit', 'Compare', 'The', 'How'].includes(w));
        if (potentialBrand) target = potentialBrand;
    }

    if (!target) {
        // Fallback target extraction
        if (lower.includes('notion')) target = 'Notion';
        else if (lower.includes('slack')) target = 'Slack';
        else if (lower.includes('linear')) target = 'Linear';
        else if (lower.includes('stripe')) target = 'Stripe';
        else if (lower.includes('google')) target = 'Google';
        else if (lower.includes('competitor')) target = 'Competitor';
    }

    // Extract Goal
    let goal = "Analysis";
    if (lower.includes('signup')) goal = "Signup Analysis";
    else if (lower.includes('pricing')) goal = "Pricing Review";
    else if (lower.includes('mobile')) goal = "Mobile UX";
    else if (lower.includes('onboarding')) goal = "Onboarding";
    else if (lower.includes('audit')) goal = "Audit";
    else if (lower.includes('compare')) goal = "Comparison";

    if (target) {
        name = `${target} ${goal}`;
    } else {
        // Just use first few words
        const cleanWords = words.filter(w => w.length > 3).slice(0, 3);
        if (cleanWords.length > 0) name = cleanWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    if (name.length > 28) name = name.slice(0, 27) + '…';
    return name;
}

export default function Home() {
  const [activeRoles, setActiveRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'project' | 'projects-list'>('home');
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<'all' | 'favorites'>('all');
  const [activeLibraryFilter, setActiveLibraryFilter] = useState<'all' | 'creative' | 'product' | 'technical'>('all');
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [viewMode, setViewMode] = useState<'canvas' | 'files'>('canvas');
  const [uploadedFiles, setUploadedFiles] = useState<StoryEvent[]>([]);
  const [activeFileTab, setActiveFileTab] = useState<'generated' | 'uploaded'>('generated');
  
  // Replaced simple pages string array with PageTab objects
  const [pages, setPages] = useState<PageTab[]>(DEMO_PAGES);
  const [activePageId, setActivePageId] = useState(DEMO_PAGES[0].id);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
      id: 'proj-1',
      icon: '🕵️',
      name: 'Notion Signup Analysis'
  });

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [projectListSearch, setProjectListSearch] = useState("");
  const [projectListFilter, setProjectListFilter] = useState<'all' | 'favorites'>('all');

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
  const [activeDragData, setActiveDragData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setActiveDragData(event.active.data.current);
  };

  // AI Teams State
  const [allPersonas, setAllPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team-1', name: 'Strategic Research', description: 'Focused on market analysis and intelligence', personaIds: ['p-1', 'p-5'], status: 'pool' },
    { id: 'team-2', name: 'Product Growth', description: 'Focused on feature differentiation and UX', personaIds: ['p-2', 'p-3'], status: 'pool' }
  ]);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isAddingPersona, setIsAddingPersona] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle Team Dragging
    if (activeData?.type === 'team-card') {
      const draggedTeam = activeData.team as Team;
      
      // Dropped into Workspace Zone
      if (overId === 'workspace-zone') {
        setTeams(prev => prev.map(t => 
          t.id === draggedTeam.id ? { ...t, status: 'active' } : t
        ));
        toast({ title: "Team Activated", description: `${draggedTeam.name} is now active.` });
        return;
      }

      // Dropped into Pool Zone
      if (overId === 'pool-zone') {
        setTeams(prev => prev.map(t => 
          t.id === draggedTeam.id ? { ...t, status: 'pool' } : t
        ));
        toast({ title: "Team Deactivated", description: `${draggedTeam.name} moved back to pool.` });
        return;
      }
      return;
    }

    // Handle Persona Dragging to Teams
    if (activeData?.type === 'persona') {
      const activePersonaId = activeData.persona.id;
      const targetTeamId = overData?.teamId || (teams.find(t => t.id === overId) ? overId : null);
      
      if (targetTeamId) {
        setTeams(prevTeams => prevTeams.map(team => {
          // If it's the target team, add the persona if not already present
          if (team.id === targetTeamId) {
            if (!team.personaIds.includes(activePersonaId)) {
              return { ...team, personaIds: [...team.personaIds, activePersonaId] };
            }
          }
          // Do not remove from other teams (allow multi-team membership)
          return team;
        }));
        
        const persona = allPersonas.find(p => p.id === activePersonaId);
        toast({ 
          title: "Team Updated", 
          description: `${persona?.role} added to ${teams.find(t => t.id === targetTeamId)?.name}` 
        });
        return;
      }
    }

    // Existing Prompt dragging logic...
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
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeScenario = getScenarioById(activeScenarioId);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setHomeInput(newValue);

    const cursorPos = e.target.selectionEnd;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
        const query = textBeforeCursor.slice(lastAtIndex + 1);
        // Simple heuristic: if query is short and has no newlines, treat as mention search
        if (!query.includes('\n') && query.length < 20) {
            setMentionQuery(query);
            setShowMentions(true);
            return;
        }
    }
    setShowMentions(false);
  };

  const handleAtButtonClick = () => {
      const textarea = inputRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionEnd;
      const text = homeInput;
      const newText = text.slice(0, cursorPos) + "@" + text.slice(cursorPos);
      
      setHomeInput(newText);
      setMentionQuery("");
      setShowMentions(true);
      
      setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
      }, 0);
  };

  const handleSelectMention = (card: PromptCard) => {
      const textarea = inputRef.current;
      if (!textarea) return;
      
      const cursorPos = textarea.selectionEnd;
      const text = homeInput;
      const textBeforeCursor = text.slice(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex !== -1) {
          const textBeforeAt = text.slice(0, lastAtIndex);
          const textAfterCursor = text.slice(cursorPos);
          const newText = textBeforeAt + card.description + " " + textAfterCursor;
          setHomeInput(newText);
          setShowMentions(false);
          
          setTimeout(() => {
             textarea.focus();
             const newCursorPos = (textBeforeAt + card.description + " ").length;
             textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
      }
  };

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
    // Generate semantic title and icon from user input
    const title = generatePageTitle(message, pages.length);
    const icon = getPageIcon(message);
    
    // Update project name if it's the first real interaction or if generic
    if (projectInfo.name === 'Untitled Project' || projectInfo.name === 'Notion Signup Analysis') {
        const newProjectName = generateProjectName(message);
        setProjectInfo(prev => ({ ...prev, name: newProjectName }));
    }

    // Create a new page tab for this task
    const newPageId = `p-${Date.now()}`;
    const newPage: PageTab = {
        id: newPageId,
        icon,
        title,
        completedSteps: 1, 
        totalSteps: 5, 
        isActive: true,
        status: 'running'
    };
    
    // Add to pages and switch to it
    setPages(prev => [...prev, newPage]);
    setActivePageId(newPageId);
    setActiveTab('project');
    
    toast({
      title: "Task Started",
      description: `Analysis for "${title}" has begun.`,
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
      const newPageId = `p${Date.now()}`;
      const newPage: PageTab = {
          id: newPageId,
          icon: "📋",
          title: `Task ${pages.length + 1}`,
          completedSteps: 0,
          totalSteps: 0,
          isActive: true,
          status: 'idle'
      };
      setPages([...pages, newPage]);
      setActivePageId(newPageId);
      setEvents([]); // Clear AI chat events when adding a new page
      toast({
          title: "Task Added",
          description: `${newPage.title} has been created.`,
      });
  };

  const handleRenameTab = (id: string, newTitle: string) => {
      setPages(pages.map(p => p.id === id ? { ...p, title: newTitle } : p));
  };

  const handleRenameProject = (newName: string) => {
      setProjectInfo(prev => ({ ...prev, name: newName }));
  };

  const handleNewProject = () => {
    setProjectInfo({
      id: `proj-${Date.now()}`,
      icon: '🕵️',
      name: 'Untitled Project'
    });
    setPages(DEMO_PAGES);
    setActivePageId(DEMO_PAGES[0].id);
    setEvents([]);
    setActiveTab('home');
    toast({
      title: "New Project Started",
      description: "Ready for a new analysis session.",
    });
  };


  const getFilteredScenarios = () => {
    // Helper to generate multiple dummy items based on a template
    const generateDummies = (template: typeof SCENARIOS[0], count: number, prefix: string) => {
      return Array.from({ length: count }).map((_, i) => ({
        ...template,
        id: `${prefix}-${i}`,
        name: `${template.name} ${i + 1}`,
        goal: `${template.goal} - Variant ${i + 1}`,
        // Rotate through thumbnails for variety if not defined, or keep template's
        thumbnail: template.thumbnail 
      }));
    };

    let allScenarios: typeof SCENARIOS = [];
    
    // Define scenarios for each category
    const competitorScenarios = [SCENARIOS[0], ...generateDummies(SCENARIOS[0], 5, 'comp')];
    const adScenarios = [SCENARIOS[1], ...generateDummies(SCENARIOS[1], 5, 'ad')];
    const productScenarios = generateDummies({ ...SCENARIOS[0], name: 'User Retention Flow Analysis', goal: 'Optimize retention rates', persona: 'Sarah, Product Owner', thumbnail: '/thumbnails/mobile-flow.jpg' }, 6, 'prod');
    const learningScenarios = generateDummies({ ...SCENARIOS[0], name: 'React Hooks Deep Dive', goal: 'Structure learning path', persona: 'Dev Student', thumbnail: '/thumbnails/code.jpg' }, 6, 'learn');
    const factScenarios = generateDummies({ ...SCENARIOS[1], name: 'News Source Verification', goal: 'Check multiple sources', persona: 'Journalist', thumbnail: '/thumbnails/doc.jpg' }, 6, 'fact');

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
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-heading" data-testid="text-home-slogan">
                  Your AI team. Complex tasks. Clear canvas.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto" data-testid="text-home-slogan-subtitle">
                  Start with a URL or a question — we’ll turn it into a structured workspace.
                </p>
              </div>

              {/* Large Chat Input */}
              <div className="w-full relative group max-w-3xl" data-testid="section-home-input">
                {showMentions && (
                    <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm max-h-[300px] overflow-y-auto bg-popover border border-border rounded-xl shadow-lg z-50 p-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/30 rounded-md mb-1">
                            Suggested Prompts
                        </div>
                        {[...commonPrompts, ...recommendedPrompts]
                            .filter(p => p.title.toLowerCase().includes(mentionQuery.toLowerCase()) || p.description.toLowerCase().includes(mentionQuery.toLowerCase()))
                            .map((prompt) => (
                            <button
                                key={prompt.id}
                                onClick={() => handleSelectMention(prompt)}
                                className="w-full flex flex-col items-start gap-1 p-2 rounded-lg hover:bg-muted/80 transition-colors text-left group/item"
                            >
                                <div className="flex items-center gap-2 w-full">
                                    {prompt.icon === 'sparkles' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                                    {prompt.icon === 'users' && <Users className="w-3.5 h-3.5 text-indigo-500" />}
                                    {prompt.icon === 'check-square' && <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />}
                                    {prompt.icon === 'message-square' && <MessageSquare className="w-3.5 h-3.5 text-primary" />}
                                    <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors line-clamp-1">{prompt.title}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground line-clamp-1 pl-5.5 opacity-80">
                                    {prompt.description}
                                </p>
                            </button>
                        ))}
                        {[...commonPrompts, ...recommendedPrompts].filter(p => p.title.toLowerCase().includes(mentionQuery.toLowerCase())).length === 0 && (
                            <div className="p-3 text-center text-xs text-muted-foreground">
                                No matching prompts found
                            </div>
                        )}
                    </div>
                )}

                <div className="relative flex flex-col bg-card border border-border shadow-xl rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                  {/* AI Roles Display Area - Positioned absolutely to appear inline */}
                  {activeRoles.length > 0 && (
                     <div className="absolute top-6 left-6 flex items-center pointer-events-none z-10 animate-in fade-in duration-300 select-none">
                        <div className="flex items-center pointer-events-auto">
                            {activeRoles.map(role => <RoleMention key={role} role={role} />)}
                        </div>
                     </div>
                  )}

                  <textarea 
                    ref={inputRef}
                    value={homeInput}
                    onChange={handleInputChange}
                    placeholder={activeRoles.length > 0 ? "" : "Enter a URL or describe what you'd like to explore..."}
                    style={{ textIndent: activeRoles.length > 0 ? `${(activeRoles.length * 44) + 24}px` : '0px' }}
                    className={cn(
                        "w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none px-6 py-6 min-h-[120px] text-lg placeholder:text-muted-foreground/50 font-medium shadow-none ring-0 selection:bg-primary/20",
                    )}
                    data-testid="input-home-primary"
                  />

                  <div className="flex justify-between items-center p-4 pt-0 border-t-0 bg-transparent">
                     <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg" title="Attach">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg" 
                            title="Call Roles"
                            onClick={handleAtButtonClick}
                        >
                          <AtSign className="w-4 h-4" />
                        </Button>
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
                  
                  <div className="flex items-center gap-1 px-4 pb-4 bg-transparent border-t border-border/20 pt-3">
                     <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                           <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                           <Table className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                           <Brain className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                           <ListTodo className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
                           <AlignLeft className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
                </div>

                <div className="pt-4" data-testid="section-home-quickstart">
                  <div className="flex flex-wrap justify-center gap-2" data-testid="list-home-quickstart">
                    {[
                      {
                        icon: "🔍",
                        label: "Onboarding Analysis",
                        roles: ["scout", "capturer", "analyst", "reporter"],
                        prompt: "Walk through the signup and onboarding flow of [competitor.com], identify UX strengths and friction points.",
                      },
                      {
                        icon: "💰",
                        label: "Pricing Comparison",
                        roles: ["scout", "analyst", "comparator", "reporter"],
                        prompt: "Compare the pricing pages of [company A] and [company B], analyze their pricing strategies and positioning.",
                      },
                      {
                        icon: "🎯",
                        label: "UX Audit",
                        roles: ["scout", "capturer", "analyst", "reporter"],
                        prompt: "Audit the user experience of [website.com], focusing on navigation, clarity, and conversion paths.",
                      },
                      {
                        icon: "📊",
                        label: "Feature Comparison",
                        roles: ["scout", "analyst", "comparator", "reporter"],
                        prompt: "Compare the feature sets of [product A] and [product B], create a visual comparison.",
                      },
                      {
                        icon: "📱",
                        label: "Mobile UX",
                        roles: ["scout", "capturer", "analyst", "reporter"],
                        prompt: "Explore the mobile experience of [website.com], test responsiveness and mobile interactions.",
                      },
                    ].map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => {
                          setHomeInput(s.prompt);
                          setActiveRoles(s.roles);
                          requestAnimationFrame(() => inputRef.current?.focus());
                        }}
                        className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors flex items-center gap-2 border border-border/50"
                        data-testid={`chip-home-quickstart-${s.label.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <span aria-hidden="true" data-testid={`icon-home-quickstart-${s.label.replace(/\s+/g, '-').toLowerCase()}`}>{s.icon}</span>
                        <span className="text-xs font-semibold text-foreground/90" data-testid={`text-home-quickstart-${s.label.replace(/\s+/g, '-').toLowerCase()}`}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* History Tasks Section */}
              <div className="w-full space-y-4 mt-24 md:mt-32 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
                 <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Recent Projects
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

              {/* See what you'll get Section */}
              <div className="w-full space-y-10 mt-16 md:mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 pb-20">
                 <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-heading">
                      See what you'll get
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Real examples of AI team's work
                    </p>
                 </div>

                 {/* Case Studies Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                    {[
                      {
                        id: 1,
                        icon: "🔍",
                        title: "Competitor Onboarding Analysis",
                        description: "Analyzed Notion's 5-step signup flow, identified 3 UX friction points",
                        image: caseOnboardingImg,
                        link: "#"
                      },
                      {
                        id: 2,
                        icon: "💰",
                        title: "Pricing Page Comparison",
                        description: "Compared Stripe vs Square pricing strategies with visual breakdown",
                        image: casePricingImg,
                        link: "#"
                      },
                      {
                        id: 3,
                        icon: "🎯",
                        title: "E-commerce UX Audit",
                        description: "Audited checkout flow with 12 actionable insights",
                        image: caseUxAuditImg,
                        link: "#"
                      }
                    ].map((study) => (
                        <div 
                            key={study.id}
                            className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                        >
                            {/* Image Area */}
                            <div className="aspect-video bg-muted overflow-hidden relative">
                                <img 
                                    src={study.image} 
                                    alt={study.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>

                            {/* Content Area */}
                            <div className="p-5">
                                <h3 className="font-semibold text-base mb-2 flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                                    <span>{study.icon}</span>
                                    <span>{study.title}</span>
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {study.description}
                                </p>
                                <div className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    View Report
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>

                 <div className="text-center mt-6">
                    <Button variant="outline" className="gap-2">
                        View more examples <ArrowRight className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="flex h-full w-full bg-background overflow-hidden">
             <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
             >
                {/* Main Scrollable Content */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-primary/10 rounded-lg">
                        <Library className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Library</h2>
                    </div>

                    <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full">
                        {/* AI Teams Workspace Section */}
                        <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    Your Elite AI Teams
                                </h3>
                                <p className="text-sm text-muted-foreground">Organize specialized agents into collaborative teams</p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => setIsAddingPersona(true)}
                                >
                                <Plus className="w-4 h-4" /> Create Agent
                                </Button>
                                <Button 
                                variant="default" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => setIsAddingTeam(true)}
                                >
                                <Users className="w-4 h-4" /> New Team
                                </Button>
                            </div>
                        </div>

                        {/* Custom Agent Library / Active Workspace */}
                        <div className="space-y-4">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Database className="w-3.5 h-3.5" /> Active Workspace
                            </div>
                            
                            {/* Droppable Zone for Active Teams */}
                            <DroppableWorkspace 
                                teams={teams.filter(t => t.status === 'active')}
                                personas={allPersonas}
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5" /> Available Team Pool
                            </div>
                            {/* Droppable Zone for Team Pool */}
                            <DroppableTeamPool 
                                teams={teams.filter(t => t.status === 'pool')}
                                personas={allPersonas}
                            />
                        </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Official Recommendations */}
                <div className="w-80 border-l border-border bg-card/50 flex flex-col overflow-hidden shadow-xl z-20">
                    <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Official Agents
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Drag to your team to recruit
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {DEFAULT_PERSONAS.map(persona => (
                            <MiniPersonaCard 
                                key={persona.id} 
                                persona={persona} 
                                onClick={() => setActivePersona(persona)}
                            />
                        ))}
                    </div>
                </div>

                <DragOverlay>
                    {activeDragId && activeDragData ? (
                        (() => {
                            if (activeDragData.card) {
                                return <SortablePromptCard card={activeDragData.card} isOverlay />;
                            }
                            
                            if (activeDragData.persona) {
                                return <div className="w-64 opacity-90 rotate-3 cursor-grabbing"><PersonaCard persona={activeDragData.persona} /></div>;
                            }
                            
                            if (activeDragData.type === 'team-card') {
                                return (
                                    <div className="w-[400px] opacity-90 rotate-2 cursor-grabbing bg-background rounded-2xl border-2 border-primary shadow-2xl overflow-hidden pointer-events-none">
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-5 h-5 text-primary" />
                                                <span className="font-bold text-lg">{activeDragData.team.name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{activeDragData.team.description}</p>
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })()
                    ) : null}
                </DragOverlay>
             </DndContext>

             {/* Modals */}
             <Dialog open={isAddingTeam} onOpenChange={setIsAddingTeam}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New AI Team</DialogTitle>
                    <DialogDescription>Create a specialized collaborative workspace.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                    <Label>Team Name</Label>
                    <Input id="team-name" placeholder="e.g. Marketing Strike Force" />
                    </div>
                    <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea id="team-desc" placeholder="What is this team's focus?" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTeam(false)}>Cancel</Button>
                    <Button onClick={() => {
                    const name = (document.getElementById('team-name') as HTMLInputElement).value;
                    const desc = (document.getElementById('team-desc') as HTMLTextAreaElement).value;
                    if (name) {
                        setTeams([...teams, { id: `team-${Date.now()}`, name, description: desc, personaIds: [], status: 'pool' }]);
                        setIsAddingTeam(false);
                        toast({ title: "Team Created", description: `${name} is ready for deployment.` });
                    }
                    }}>Create Team</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddingPersona} onOpenChange={setIsAddingPersona}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Custom AI Agent</DialogTitle>
                    <DialogDescription>Define a new specialized role for your team.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                    <Label>Role Name</Label>
                    <Input id="p-role" placeholder="e.g. Growth Hacker" />
                    </div>
                    <div className="grid gap-2">
                    <Label>Mission</Label>
                    <Textarea id="p-mission" placeholder="What is this agent's primary goal?" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingPersona(false)}>Cancel</Button>
                    <Button onClick={() => {
                    const role = (document.getElementById('p-role') as HTMLInputElement).value;
                    const mission = (document.getElementById('p-mission') as HTMLTextAreaElement).value;
                    if (role) {
                        const newPersona = {
                        id: `p-${Date.now()}`,
                        role,
                        mission,
                        deliverables: ['Custom Report', 'Strategy Brief'],
                        value: 'Specialized Expertise',
                        avatar: pmAvatar
                        };
                        setAllPersonas([...allPersonas, newPersona]);
                        setIsAddingPersona(false);
                        toast({ title: "Agent Created", description: `${role} has been added to your library.` });
                    }
                    }}>Create Agent</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

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

             {/* Persona Details Popover/Dialog */}
             <Dialog open={!!activePersona} onOpenChange={(open) => !open && setActivePersona(null)}>
                <DialogContent className="max-w-md">
                   {activePersona && (
                      <div className="flex flex-col items-center text-center -mt-4">
                         <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border-4 border-background shadow-xl mb-4 relative z-10">
                            <img src={activePersona.avatar} alt={activePersona.role} className="w-full h-full object-cover" />
                         </div>
                         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent rounded-t-lg -z-0" />
                         
                         <h3 className="text-xl font-bold mb-1">{activePersona.role}</h3>
                         <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-6">
                            Official Agent
                         </div>

                         <div className="w-full space-y-4 text-left">
                            <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5" /> Mission
                                </h4>
                                <p className="text-sm leading-relaxed">{activePersona.mission}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5" /> Value
                                    </h4>
                                    <p className="text-xs font-medium">{activePersona.value}</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> Output
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {activePersona.deliverables.slice(0, 2).map(d => (
                                            <span key={d} className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border/50">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                         </div>
                      </div>
                   )}
                </DialogContent>
             </Dialog>
          </div>
        );
      case 'projects-list':
          return (
             <div className="flex flex-col h-full w-full bg-background p-6 overflow-y-auto">
                 <div className="flex items-center gap-2 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                 </div>

                 {/* Toolbar */}
                 <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="relative flex-1 max-w-md">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input 
                         placeholder="Search projects..." 
                         value={projectListSearch}
                         onChange={(e) => setProjectListSearch(e.target.value)}
                         className="pl-9 bg-muted/50 border-border/50 focus:bg-background transition-all"
                       />
                    </div>
                    <div className="flex bg-muted/50 p-0.5 rounded-lg">
                        <button 
                            onClick={() => setProjectListFilter('all')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                projectListFilter === 'all' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setProjectListFilter('favorites')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                                projectListFilter === 'favorites' ? "bg-background shadow-sm text-amber-500" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Star className="w-3 h-3 fill-current" />
                            Favorites
                        </button>
                    </div>
                 </div>

                 {/* Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {HISTORY_TASKS
                        .filter(task => {
                            const matchesSearch = task.title.toLowerCase().includes(projectListSearch.toLowerCase()) || 
                                                  task.description.toLowerCase().includes(projectListSearch.toLowerCase());
                            const matchesFilter = projectListFilter === 'all' || task.isFavorite;
                            return matchesSearch && matchesFilter;
                        })
                        .map(task => (
                        <div 
                            key={task.id} 
                            className="group bg-card border border-border hover:border-primary/50 rounded-xl transition-all cursor-pointer hover:shadow-md flex flex-col h-[280px] overflow-hidden"
                        >
                            <div className="h-[140px] w-full bg-muted/50 overflow-hidden relative">
                                <img 
                                    src={task.thumbnail} 
                                    alt={task.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-2 right-2">
                                    {task.isFavorite ? (
                                        <div className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                        </div>
                                    ) : (
                                        <div className="bg-background/40 backdrop-blur-sm p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Star className="w-3.5 h-3.5 text-muted-foreground/60" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-4 flex flex-col gap-2 flex-1">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1" title={task.title}>
                                    {task.title}
                                </h3>
                                
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                                    {task.description}
                                </p>
                                
                                <div className="pt-3 mt-auto border-t border-dashed border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3 opacity-70" />
                                        <span>{task.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60">
                                       {task.assets.documents > 0 && <FileText className="w-3 h-3" />}
                                       {task.assets.images > 0 && <ImageIcon className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {HISTORY_TASKS.filter(task => {
                        const matchesSearch = task.title.toLowerCase().includes(projectListSearch.toLowerCase()) || 
                                              task.description.toLowerCase().includes(projectListSearch.toLowerCase());
                        const matchesFilter = projectListFilter === 'all' || task.isFavorite;
                        return matchesSearch && matchesFilter;
                    }).length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Search className="w-10 h-10 mb-4 opacity-20" />
                            <p className="font-medium">No projects found</p>
                            <p className="text-sm opacity-60">Try adjusting your filters</p>
                        </div>
                    )}
                 </div>
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
                <div className="absolute top-0 left-0 right-0 z-40 bg-transparent pointer-events-none">
                     {/* We inject the Project Header into the Shell's header area via portal or absolute positioning if feasible. 
                         However, Shell structure might be rigid. 
                         Looking at the Shell usage, it has a 'nav' prop which is the sidebar.
                         It seems the top header is part of Shell?
                         Actually, let's look at where we are rendering. 
                         We are inside renderContent(), inside activeTab === 'project'.
                         
                         If we want this "Project Name" to be in the "Canvas Header", we might need to place it 
                         where the tabs [Canvas] [Files] are usually located if they exist, or just at the top left of this container.
                         
                         Let's put it absolutely at top-left of the content area for now, assuming standard layout.
                     */}
                     <div className="absolute top-4 left-4 pointer-events-auto bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm z-50">
                        <ProjectHeader 
                            project={projectInfo}
                            onRename={handleRenameProject}
                            onNewProject={handleNewProject}
                        />
                     </div>
                     <div className="absolute top-4 right-4 pointer-events-auto z-50">
                        <TopRightToolbar />
                     </div>
                </div>
            )}
            
            <div className="relative w-full h-full pt-0">
                {/* Canvas is ALWAYS rendered underneath */}
                <FlowCanvas 
                    events={activePageId === 'p1' ? events : []} 
                    droppedFiles={uploadedFiles} 
                    onFileDrop={(files) => setUploadedFiles(files)} 
                    onFileDelete={(id) => setUploadedFiles(prev => prev.filter(f => f.id !== id))}
                />

                {/* Bottom Page Nav */}
                <div className="absolute bottom-0 left-0 right-0 z-40">
                    <PageBottomNav 
                        pages={pages}
                        activePageId={activePageId}
                        onSwitch={setActivePageId}
                        onAdd={handleAddPage}
                        onRenameTab={handleRenameTab}
                    />
                </div>

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
