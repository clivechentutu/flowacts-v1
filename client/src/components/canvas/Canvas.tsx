import { useRef, useEffect } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { InsightCard } from "./cards/InsightCard";
import { AlertCard } from "./cards/AlertCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface CanvasProps {
  events: StoryEvent[];
}

export function Canvas({ events }: CanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when events change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div className="h-full bg-slate-50 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="flex-1 overflow-y-auto px-8 py-12 custom-scrollbar">
        <div className="max-w-3xl mx-auto pl-4">
          <div className="space-y-0">
             {events.filter(e => ['action', 'insight', 'alert'].includes(e.type)).map((event, index, filteredArr) => {
               const isLast = index === filteredArr.length - 1;
               
               return (
                 <motion.div 
                   key={event.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1 }}
                 >
                   {event.type === 'action' && (
                     <ActionCard 
                       title={event.title || 'Action'} 
                       content={event.content}
                       image={event.image!}
                       timestamp={event.timestamp}
                       metadata={event.metadata}
                       isLast={isLast}
                     />
                   )}
                   {event.type === 'insight' && (
                     <InsightCard 
                       title={event.title || 'Insight'}
                       content={event.content}
                       timestamp={event.timestamp}
                       isLast={isLast}
                     />
                   )}
                   {event.type === 'alert' && (
                     <AlertCard 
                       title={event.title || 'Alert'}
                       content={event.content}
                       timestamp={event.timestamp}
                       isLast={isLast}
                     />
                   )}
                 </motion.div>
               );
             })}
             <div ref={bottomRef} className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
