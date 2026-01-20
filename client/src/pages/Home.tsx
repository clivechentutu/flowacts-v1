import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TaskNavigation } from "@/components/layout/TaskNavigation";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { FlowCanvas } from "@/components/canvas/FlowCanvas";
import { SCENARIOS, StoryEvent } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'experience' | 'library'>('experience');
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const { toast } = useToast();

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId)!;

  // Simulate progressive revealing of the story
  useEffect(() => {
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
  }, [activeScenarioId]);

  const handleSendMessage = (message: string) => {
    toast({
      title: "Demo Mode",
      description: "This is a playback demo. Try switching scenarios to see different flows!",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex items-center justify-center h-full w-full bg-background text-muted-foreground">
             <div className="text-center">
               <h2 className="text-2xl font-bold mb-2">Welcome Home</h2>
               <p>Dashboard Overview Placeholder</p>
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
        <ChatPanel 
          events={events} 
          onSendMessage={handleSendMessage} 
          persona={activeScenario.persona}
        />
      }
    >
      {renderContent()}
    </Shell>
  );
}
