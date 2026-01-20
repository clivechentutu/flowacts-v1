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
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'experience' | 'library'>('home');
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full bg-background relative overflow-y-auto">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none" />
            
            <div className="w-full max-w-3xl px-6 py-12 flex flex-col items-center gap-10 relative z-10">
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
              <div className="w-full relative group">
                <div className="relative flex flex-col bg-card border border-border shadow-xl rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                  <textarea 
                    value={homeInput}
                    onChange={(e) => setHomeInput(e.target.value)}
                    placeholder="Ask anything... e.g. 'Analyze the signup flow for competitor.com'" 
                    className="w-full bg-transparent border-0 focus:ring-0 resize-none p-6 min-h-[120px] text-lg placeholder:text-muted-foreground/50 font-medium"
                  />
                  
                  <div className="flex justify-between items-center p-4 pt-2 bg-muted/20 border-border/50">
                     <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-xs">Attach</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
                          <Globe className="w-4 h-4" />
                          <span className="text-xs">Search</span>
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

              {/* Common Scenarios */}
              <div className="w-full space-y-4">
                 <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">Suggested Scenarios</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SCENARIOS.map((scenario, idx) => (
                        <div 
                            key={scenario.id}
                            onClick={() => handleScenarioClick(scenario.id)}
                            className="group relative p-4 bg-card hover:bg-muted/50 border border-border rounded-xl cursor-pointer transition-all hover:border-primary/50 hover:shadow-md flex items-start gap-4"
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                idx % 2 === 0 ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600"
                            )}>
                                {idx % 2 === 0 ? <Layout className="w-5 h-5" /> : <BarChart className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        {scenario.name}
                                    </h4>
                                    <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {scenario.goal} - Simulating {scenario.persona}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Placeholder for 'New' */}
                    <div className="group relative p-4 bg-card/50 hover:bg-muted/50 border border-dashed border-border rounded-xl cursor-pointer transition-all hover:border-primary/50 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary h-full min-h-[88px]">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Create Custom Scenario</span>
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

// Add missing icon import
import { Plus } from "lucide-react";
