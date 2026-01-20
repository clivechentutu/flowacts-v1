import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TaskNavigation } from "@/components/layout/TaskNavigation";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { FlowCanvas } from "@/components/canvas/FlowCanvas";
import { SCENARIOS, StoryEvent } from "@/lib/mock-data";
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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: 'competitor', label: '竞品调研', icon: Layout },
  { id: 'product', label: '产品优化', icon: Target },
  { id: 'learning', label: '结构化学习', icon: BookOpen },
  { id: 'ad', label: '广告巡检', icon: Eye },
  { id: 'fact', label: '事实多元核查', icon: CheckCircle },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'experience' | 'library'>('home');
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [activeCategory, setActiveCategory] = useState('competitor');
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const { toast } = useToast();
  const [homeInput, setHomeInput] = useState("");
  const [isThinkingMode, setIsThinkingMode] = useState(false);

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId)!;

  // Simulate progressive revealing of the story
  useEffect(() => {
    if (activeTab !== 'experience') return;
    
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
    setActiveTab('experience');
  };

  const getFilteredScenarios = () => {
    // Demo logic: mapping categories to available scenarios or creating placeholders
    if (activeCategory === 'competitor') return [SCENARIOS[0]];
    if (activeCategory === 'ad') return [SCENARIOS[1]];
    
    // For other categories, show placeholders or reuse for demo purposes
    if (activeCategory === 'product') return [
      { ...SCENARIOS[0], id: 'prod-1', name: 'User Retention Flow Analysis', goal: 'Optimize retention rates', persona: 'Sarah, Product Owner' }
    ];
    if (activeCategory === 'learning') return [
      { ...SCENARIOS[0], id: 'learn-1', name: 'React Hooks Deep Dive', goal: 'Structure learning path', persona: 'Dev Student' }
    ];
    if (activeCategory === 'fact') return [
      { ...SCENARIOS[1], id: 'fact-1', name: 'News Source Verification', goal: 'Check multiple sources', persona: 'Journalist' }
    ];
    
    return [];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full bg-background relative overflow-y-auto">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none" />
            
            <div className="w-full max-w-4xl px-6 py-12 flex flex-col items-center gap-10 relative z-10">
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

              {/* Categorized Scenarios */}
              <div className="w-full max-w-3xl space-y-6 mt-4">
                 {/* Tabs */}
                 <div className="flex items-center justify-center md:justify-start gap-1 p-1 bg-muted/30 rounded-xl overflow-x-auto no-scrollbar mx-auto md:mx-0">
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                                <div className="px-2 py-1 bg-muted rounded-md text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Playback Case
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                        {scenario.name}
                                    </h4>
                                    <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {scenario.goal} - Simulating {scenario.persona}
                                </p>
                            </div>

                            <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-muted-foreground/70">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span>Completed 2m ago</span>
                            </div>
                        </div>
                    ))}
                    
                    {/* Placeholder for 'New' */}
                    <div className="group relative p-5 bg-card/50 hover:bg-muted/50 border border-dashed border-border rounded-2xl cursor-pointer transition-all hover:border-primary/50 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary min-h-[160px]">
                        <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm">Create Custom Scenario</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'library':
         return (
          <div className="flex items-center justify-center h-full w-full bg-background text-muted-foreground">
             <div className="text-center">
               <h2 className="text-2xl font-bold mb-2">Library</h2>
               <p>Past Analysis Results & Assets</p>
             </div>
          </div>
        );
      case 'experience':
      default:
        return (
          <>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
              {SCENARIOS.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm ${
                    activeScenarioId === scenario.id 
                      ? 'bg-primary text-primary-foreground shadow-md transform scale-105' 
                      : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
            <FlowCanvas events={events} />
          </>
        );
    }
  };

  return (
    <Shell
      nav={
        <div className="flex h-full">
            <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <TaskNavigation />
        </div>
      }
      rightPanel={
        activeTab === 'experience' ? (
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

