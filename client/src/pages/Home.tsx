import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Canvas } from "@/components/canvas/Canvas";
import { SCENARIOS, StoryEvent } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { toast } = useToast();

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId)!;

  // Simulate progressive revealing of the story
  useEffect(() => {
    // Reset when scenario changes
    setEvents([]);
    setCurrentStepIndex(0);
    
    // Start the simulation sequence
    let timeout: NodeJS.Timeout;
    
    const playNextStep = (index: number) => {
      if (index >= activeScenario.events.length) return;
      
      const event = activeScenario.events[index];
      
      // Variable delay based on event type to feel natural
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

  return (
    <Shell
      sidebar={
        <ChatPanel 
          events={events} 
          onSendMessage={handleSendMessage} 
          persona={activeScenario.persona}
        />
      }
    >
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setActiveScenarioId(scenario.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm ${
              activeScenarioId === scenario.id 
                ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {scenario.name}
          </button>
        ))}
      </div>
      
      <Canvas events={events} />
    </Shell>
  );
}
