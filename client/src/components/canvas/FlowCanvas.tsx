import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface FlowCanvasProps {
  events: StoryEvent[];
}

// Configuration for layout
const CARD_WIDTH = 360; // Slightly wider for ActionCard
const CARD_HEIGHT = 500; // Taller to accommodate Insight section
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
  // Filter only ACTION events now, as Insight/Alert are merged or hidden
  const canvasEvents = useMemo(() => 
    events.filter(e => ['action'].includes(e.type)), 
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
        panning={{ velocityDisabled: false, excluded: ["draggable-card"] }} 
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

                    // DYNAMIC ANCHOR LOGIC
                    const H_OFFSET_SRC = 250; // Roughly center of image area + padding
                    const H_OFFSET_TGT = 250;

                    const src = {
                        right: { x: currentPos.x + CARD_WIDTH, y: currentPos.y + H_OFFSET_SRC },
                        left: { x: currentPos.x, y: currentPos.y + H_OFFSET_SRC },
                        bottom: { x: currentPos.x + CARD_WIDTH/2, y: currentPos.y + 500 }, // Approx bottom of card
                        top: { x: currentPos.x + CARD_WIDTH/2, y: currentPos.y }
                    };

                    const tgt = {
                        left: { x: nextPos.x, y: nextPos.y + H_OFFSET_TGT },
                        right: { x: nextPos.x + CARD_WIDTH, y: nextPos.y + H_OFFSET_TGT },
                        top: { x: nextPos.x + CARD_WIDTH/2, y: nextPos.y },
                        bottom: { x: nextPos.x + CARD_WIDTH/2, y: nextPos.y + 500 }
                    };

                    const dx = nextPos.x - currentPos.x;
                    const dy = nextPos.y - currentPos.y;

                    let start, end, cp1, cp2;

                    if (Math.abs(dy) > 300) { // Increased threshold for vertical wrap
                        if (dy > 0) {
                            start = src.bottom;
                            end = tgt.top;
                            cp1 = { x: start.x, y: start.y + 100 };
                            cp2 = { x: end.x, y: end.y - 100 };
                        } else {
                            start = src.top;
                            end = tgt.bottom;
                            cp1 = { x: start.x, y: start.y - 100 };
                            cp2 = { x: end.x, y: end.y + 100 };
                        }
                    } else {
                        if (dx > 0) {
                            start = src.right;
                            end = tgt.left;
                            const dist = Math.abs(end.x - start.x);
                            cp1 = { x: start.x + dist/2, y: start.y };
                            cp2 = { x: end.x - dist/2, y: end.y };
                        } else {
                            start = src.left;
                            end = tgt.right;
                            const dist = Math.abs(end.x - start.x);
                            cp1 = { x: start.x - dist/2, y: start.y };
                            cp2 = { x: end.x + dist/2, y: end.y };
                        }
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
                      className="absolute z-10 cursor-grab active:cursor-grabbing draggable-card"
                      drag
                      dragMomentum={false} 
                      dragElastic={0}
                      onDrag={(e, info) => handleDrag(event.id, info)}
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
                            <ActionCard 
                              title={event.title || 'Action'} 
                              content={event.content}
                              image={event.image!}
                              timestamp={event.timestamp}
                              metadata={event.metadata}
                              isLast={true} 
                            />
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
