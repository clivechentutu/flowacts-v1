import { useRef, useEffect, useState, useMemo } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { InsightCard } from "./cards/InsightCard";
import { AlertCard } from "./cards/AlertCard";
import { motion, useDragControls } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface FlowCanvasProps {
  events: StoryEvent[];
}

// Configuration for layout
const CARD_WIDTH = 320;
const GAP_X = 150;
const AMPLITUDE_Y = 120; // How much up/down variance

// Zoom Controls Component
const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur border border-border rounded-lg p-2 shadow-lg flex flex-col gap-2 z-50">
      <button 
        onClick={() => zoomIn()} 
        className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button 
        onClick={() => zoomOut()} 
        className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 transition-colors"
        title="Reset View"
      >
        <Move className="w-4 h-4" />
      </button>
    </div>
  );
};

export function FlowCanvas({ events }: FlowCanvasProps) {
  // Filter only relevant events
  const canvasEvents = useMemo(() => 
    events.filter(e => ['action', 'insight', 'alert'].includes(e.type)), 
  [events]);

  // Track positions in state to allow dragging
  const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([]);

  // Initialize positions when events change
  useEffect(() => {
    // Only add new events, preserve positions of existing ones if possible
    setPositions(prev => {
      // Map current events to positions
      return canvasEvents.map((event, index) => {
        // Check if we already have a position for this event
        const existing = prev.find(p => p.id === event.id);
        if (existing) return existing;

        // Calculate new position
        const x = 100 + (index * (CARD_WIDTH + GAP_X));
        
        // Create a gentle wave pattern: 0 -> down -> 0 -> up -> 0
        const waveState = index % 4;
        let yOffset = 0;
        if (waveState === 1) yOffset = AMPLITUDE_Y;
        else if (waveState === 3) yOffset = -AMPLITUDE_Y;

        return { id: event.id, x, y: yOffset };
      });
    });
  }, [canvasEvents.length]); // Only re-calc when length changes (new events added)

  // Update position when dragged
  const handleDragEnd = (id: string, info: any) => {
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          x: p.x + info.offset.x, 
          y: p.y + info.offset.y 
        };
      }
      return p;
    }));
  };

  // Calculate total bounds for the canvas size
  const contentWidth = positions.length > 0 
    ? Math.max(...positions.map(p => p.x)) + CARD_WIDTH + 400 
    : 1000;
    
  const contentHeight = 1200; // Fixed ample height for now

  return (
    <div className="h-full w-full bg-slate-50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={2}
        centerOnInit={false}
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: false }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <Controls />
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
              <div 
                style={{ 
                  width: `${contentWidth}px`, 
                  height: `${contentHeight}px`,
                  position: 'relative',
                  // Center the content vertically initially
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
                    </marker>
                  </defs>
                  
                  {canvasEvents.map((event, i) => {
                    if (i === canvasEvents.length - 1) return null;
                    
                    const currentPos = positions.find(p => p.id === event.id);
                    const nextEvent = canvasEvents[i + 1];
                    const nextPos = positions.find(p => p.id === nextEvent.id);
                    
                    if (!currentPos || !nextPos) return null;

                    // Center Y of the container
                    const CENTER_Y = contentHeight / 2;
                    
                    const startX = currentPos.x + CARD_WIDTH;
                    const startY = CENTER_Y + currentPos.y;
                    const endX = nextPos.x;
                    const endY = CENTER_Y + nextPos.y;
                    
                    const cp1X = startX + (endX - startX) * 0.5;
                    const cp1Y = startY;
                    const cp2X = startX + (endX - startX) * 0.5;
                    const cp2Y = endY;

                    return (
                       <path
                         key={`path-${event.id}-${nextEvent.id}`}
                         d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX - 12} ${endY}`}
                         stroke="#94A3B8"
                         strokeWidth="2"
                         fill="none"
                         markerEnd="url(#arrowhead)"
                         strokeDasharray="8 4"
                         className="animate-[dash_60s_linear_infinite]"
                       />
                    );
                  })}
                </svg>

                {/* Cards Layer */}
                {canvasEvents.map((event, index) => {
                  const pos = positions.find(p => p.id === event.id);
                  if (!pos) return null;

                  const isLast = index === canvasEvents.length - 1;
                  const CENTER_Y = contentHeight / 2;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute z-10 cursor-grab active:cursor-grabbing"
                      drag
                      dragMomentum={false}
                      onDragEnd={(e, info) => handleDragEnd(event.id, info)}
                      style={{
                        left: pos.x,
                        top: CENTER_Y + pos.y,
                        marginTop: -200, // Center based on approx height
                      }}
                      // We don't use x/y in animate/style here for position because
                      // we want drag to work naturally. We set initial left/top.
                      // Actually, for controlled drag in framer motion with state updates:
                      // It's better to let framer handle the visual drag, and update state on end.
                      // But if we want lines to update LIVE, we need onDrag.
                      // For performance, let's just update lines on drag end for now, 
                      // or use onDrag if it's smooth enough.
                      // Let's stick to onDragEnd for the lines to snap to new place, 
                      // otherwise we need to drive x/y via motion values which complicates the SVG render.
                      // Wait, if I use `drag`, framer modifies the transform. 
                      // My SVG lines won't follow until `onDragEnd` updates the state.
                      // This is acceptable for a prototype.
                    >
                      {event.type === 'action' && (
                          <ActionCard 
                            title={event.title || 'Action'} 
                            content={event.content}
                            image={event.image!}
                            timestamp={event.timestamp}
                            metadata={event.metadata}
                            isLast={true} 
                          />
                        )}
                        {event.type === 'insight' && (
                          <InsightCard 
                            title={event.title || 'Insight'}
                            content={event.content}
                            timestamp={event.timestamp}
                            isLast={true}
                          />
                        )}
                        {event.type === 'alert' && (
                          <AlertCard 
                            title={event.title || 'Alert'}
                            content={event.content}
                            timestamp={event.timestamp}
                            isLast={true}
                          />
                        )}
                        
                        {/* Step Number Badge */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg z-20 border-2 border-white pointer-events-none">
                            {index + 1}
                        </div>
                    </motion.div>
                  );
                })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
