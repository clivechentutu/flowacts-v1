import { useRef, useEffect, useState, useMemo } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { InsightCard } from "./cards/InsightCard";
import { AlertCard } from "./cards/AlertCard";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface FlowCanvasProps {
  events: StoryEvent[];
}

// Configuration for layout
const CARD_WIDTH = 320;
const CARD_HEIGHT = 400; // Approximate visual height for layout spacing
const GAP_X = 100;
const GAP_Y = 150;
const CARDS_PER_ROW = 3; // Snake layout constraint

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

  // Initialize positions with "Snake" layout
  useEffect(() => {
    setPositions(prev => {
      return canvasEvents.map((event, index) => {
        // Check if we already have a position for this event (preserve drag)
        const existing = prev.find(p => p.id === event.id);
        if (existing) return existing;

        // Snake Layout Calculation
        const row = Math.floor(index / CARDS_PER_ROW);
        const col = index % CARDS_PER_ROW;
        const isEvenRow = row % 2 === 0;

        // Calculate X
        // If even row: Left -> Right
        // If odd row: Right -> Left
        let x = 0;
        if (isEvenRow) {
            x = 100 + (col * (CARD_WIDTH + GAP_X));
        } else {
            // End of previous row aligns with start of this row roughly?
            // Let's align the grid.
            // Max width of a row = 100 + (CARDS_PER_ROW - 1) * (CARD_WIDTH + GAP_X)
            const rowWidth = (CARDS_PER_ROW - 1) * (CARD_WIDTH + GAP_X);
            x = 100 + (rowWidth - (col * (CARD_WIDTH + GAP_X)));
        }

        // Calculate Y
        const y = 100 + (row * (CARD_HEIGHT + GAP_Y));

        return { id: event.id, x, y };
      });
    });
  }, [canvasEvents.length]);

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

  // Calculate canvas content size
  const contentWidth = 100 + (CARDS_PER_ROW * (CARD_WIDTH + GAP_X)) + 200;
  const contentHeight = positions.length > 0 
    ? Math.max(...positions.map(p => p.y)) + CARD_HEIGHT + 200 
    : 1000;

  return (
    <div className="h-full w-full bg-slate-50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <TransformWrapper
        initialScale={0.7}
        minScale={0.2}
        maxScale={2}
        centerOnInit={true}
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

                    // Determine flow direction (Horizontal or Vertical wrap)
                    const currentRow = Math.floor(i / CARDS_PER_ROW);
                    const nextRow = Math.floor((i + 1) / CARDS_PER_ROW);
                    const isEvenRow = currentRow % 2 === 0;

                    // Card Dimensions
                    const halfW = CARD_WIDTH / 2;
                    const halfH = 200; // Approx half height
                    
                    // Start Point
                    let startX, startY, endX, endY, cp1X, cp1Y, cp2X, cp2Y;

                    if (currentRow === nextRow) {
                        // Same row connection
                        startY = currentPos.y + halfH;
                        endY = nextPos.y + halfH;
                        
                        if (isEvenRow) {
                            // Left -> Right
                            startX = currentPos.x + CARD_WIDTH;
                            endX = nextPos.x;
                        } else {
                            // Right -> Left
                            startX = currentPos.x;
                            endX = nextPos.x + CARD_WIDTH;
                        }

                        // Horizontal Curves
                        const midX = (startX + endX) / 2;
                        cp1X = midX;
                        cp1Y = startY;
                        cp2X = midX;
                        cp2Y = endY;

                    } else {
                        // Vertical Wrap connection (Down)
                        // Connect Bottom of Current to Top of Next
                        startX = currentPos.x + halfW;
                        startY = currentPos.y + (halfH * 2) - 20; // Bottom edge roughly
                        
                        endX = nextPos.x + halfW;
                        endY = nextPos.y; // Top edge

                        // Vertical Curves (S-shape)
                        cp1X = startX;
                        cp1Y = startY + 100; // Go down first
                        cp2X = endX;
                        cp2Y = endY - 100; // Come from up
                    }

                    return (
                       <path
                         key={`path-${event.id}-${nextEvent.id}`}
                         d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
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
                        top: pos.y,
                        width: CARD_WIDTH
                      }}
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
