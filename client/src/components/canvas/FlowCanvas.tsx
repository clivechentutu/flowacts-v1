import { useRef, useEffect, useState, useMemo, useCallback } from "react";
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
const CARD_HEIGHT = 400; // Used for grid, actual height varies
const GAP_X = 150;
const GAP_Y = 150;
const CARDS_PER_ROW = 3;

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

  // Track positions in state
  const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([]);

  // Initialize positions with "Snake" layout
  useEffect(() => {
    setPositions(prev => {
      return canvasEvents.map((event, index) => {
        const existing = prev.find(p => p.id === event.id);
        if (existing) return existing;

        const row = Math.floor(index / CARDS_PER_ROW);
        const col = index % CARDS_PER_ROW;
        const isEvenRow = row % 2 === 0;

        let x = 0;
        if (isEvenRow) {
            x = 100 + (col * (CARD_WIDTH + GAP_X));
        } else {
            const rowWidth = (CARDS_PER_ROW - 1) * (CARD_WIDTH + GAP_X);
            x = 100 + (rowWidth - (col * (CARD_WIDTH + GAP_X)));
        }

        const y = 100 + (row * (CARD_HEIGHT + GAP_Y));
        return { id: event.id, x, y };
      });
    });
  }, [canvasEvents.length]);

  const handleDrag = useCallback((id: string, info: any) => {
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          x: p.x + info.delta.x, 
          y: p.y + info.delta.y 
        };
      }
      return p;
    }));
  }, []);

  const contentWidth = 100 + (CARDS_PER_ROW * (CARD_WIDTH + GAP_X)) + 400;
  const contentHeight = positions.length > 0 
    ? Math.max(...positions.map(p => p.y)) + CARD_HEIGHT + 400 
    : 1500;

  return (
    <div className="h-full w-full bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <TransformWrapper
        initialScale={0.8}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.05 }}
        panning={{ velocityDisabled: false, excluded: ["draggable-card"] }} // CRITICAL: Exclude cards from panning
        doubleClick={{ disabled: true }}
        limitToBounds={false}
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
                  transformOrigin: '0 0'
                }}
              >
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  <defs>
                    <marker id="arrowhead-solid" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                       <path d="M2,2 L8,5 L2,8 L2,2" fill="#94A3B8" />
                    </marker>
                  </defs>
                  
                  {canvasEvents.map((event, i) => {
                    if (i === canvasEvents.length - 1) return null;
                    
                    const currentPos = positions.find(p => p.id === event.id);
                    const nextEvent = canvasEvents[i + 1];
                    const nextPos = positions.find(p => p.id === nextEvent.id);
                    
                    if (!currentPos || !nextPos) return null;

                    // SMART ANCHOR LOGIC
                    // We calculate 4 midpoints for each card
                    // Assuming card height is approx 200px (or dynamic, but let's use a safe center offset)
                    // Visual center offset = 200px roughly? Let's use 150px as safe "middle" of content
                    const H_OFFSET = 180;
                    
                    const src = {
                        right: { x: currentPos.x + CARD_WIDTH, y: currentPos.y + H_OFFSET },
                        left: { x: currentPos.x, y: currentPos.y + H_OFFSET },
                        bottom: { x: currentPos.x + CARD_WIDTH/2, y: currentPos.y + (H_OFFSET * 2) }, // Approx bottom
                        top: { x: currentPos.x + CARD_WIDTH/2, y: currentPos.y }
                    };

                    const tgt = {
                        left: { x: nextPos.x, y: nextPos.y + H_OFFSET },
                        right: { x: nextPos.x + CARD_WIDTH, y: nextPos.y + H_OFFSET },
                        top: { x: nextPos.x + CARD_WIDTH/2, y: nextPos.y },
                        bottom: { x: nextPos.x + CARD_WIDTH/2, y: nextPos.y + (H_OFFSET * 2) }
                    };

                    // Determine relationship
                    const dx = nextPos.x - currentPos.x;
                    const dy = nextPos.y - currentPos.y;

                    let start, end, cp1, cp2;

                    // Logic:
                    // 1. If Target is clearly to the RIGHT -> Connect Src.Right to Tgt.Left
                    // 2. If Target is clearly to the LEFT -> Connect Src.Left to Tgt.Right
                    // 3. If Target is clearly BELOW -> Connect Src.Bottom to Tgt.Top
                    
                    if (Math.abs(dx) > Math.abs(dy)) {
                        // Horizontal dominant
                        if (dx > 0) {
                            // Target is to the Right
                            start = src.right;
                            end = tgt.left;
                            // Control points: extend horizontally
                            cp1 = { x: start.x + 80, y: start.y };
                            cp2 = { x: end.x - 80, y: end.y };
                        } else {
                            // Target is to the Left
                            start = src.left;
                            end = tgt.right;
                            cp1 = { x: start.x - 80, y: start.y };
                            cp2 = { x: end.x + 80, y: end.y };
                        }
                    } else {
                        // Vertical dominant (probably next row)
                        // Connect Bottom to Top
                        start = src.bottom; // Approximate bottom edge
                        end = tgt.top;
                        cp1 = { x: start.x, y: start.y + 80 }; // Down
                        cp2 = { x: end.x, y: end.y - 80 }; // Up from target
                    }

                    return (
                       <path
                         key={`path-${event.id}-${nextEvent.id}`}
                         d={`M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`}
                         stroke="#94A3B8"
                         strokeWidth="2"
                         fill="none"
                         markerEnd="url(#arrowhead-solid)"
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
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute z-10 cursor-grab active:cursor-grabbing draggable-card" // Added class for exclusion
                      drag
                      dragMomentum={false} 
                      dragElastic={0}
                      onDrag={(e, info) => handleDrag(event.id, info)}
                      // Use e.stopPropagation to be extra safe, though 'excluded' in panning handles it mostly
                      onPointerDownCapture={(e) => {
                        // This prevents the click from propagating to the canvas pan handler
                        e.stopPropagation();
                      }}
                      style={{
                        x: pos.x,
                        y: pos.y,
                        width: CARD_WIDTH,
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    >
                      <div className="pointer-events-none"> 
                         <div className="pointer-events-auto">
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
                         </div>
                      </div>
                        
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
