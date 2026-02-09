import { useRef, useEffect, useState } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { InsightCard } from "./cards/InsightCard";
import { AlertCard } from "./cards/AlertCard";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface CanvasProps {
  events: StoryEvent[];
}

export function Canvas({ events }: CanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(77);

  // Auto-scroll to right when events change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth"
      });
    }
  }, [events]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 5, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 5, 10));

  return (
    <div className="h-full bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-center px-20 relative z-10"
      >
        <div 
          className="flex items-center space-x-0 min-w-max h-full py-20 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoom / 100})` }}
        >
             {events.filter(e => ['action', 'insight', 'alert'].includes(e.type)).map((event, index, filteredArr) => {
               const isLast = index === filteredArr.length - 1;
               
               return (
                 <motion.div 
                   key={event.id}
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                   className="h-auto flex items-center"
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
             <div ref={endRef} className="w-20" />
        </div>
      </div>

      {/* Zoom Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-50">
        <div className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-xl flex items-center p-1.5 gap-1">
          <button 
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg text-black/80 transition-colors"
          >
            <Minus className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          <div className="w-[48px] text-center select-none">
            <span className="text-sm font-medium text-black/90 tabular-nums">
              {zoom}%
            </span>
          </div>

          <button 
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg text-black/80 transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
