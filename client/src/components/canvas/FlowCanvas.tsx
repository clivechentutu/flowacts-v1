import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { TaskSidebar } from "./TaskSidebar";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface FlowCanvasProps {
  events: StoryEvent[];
}

// Configuration for layout
const CARD_WIDTH = 360; 
const CARD_HEIGHT = 500; 
const GAP_X = 150;
const GAP_Y = 150;
const CARDS_PER_ROW = 3;

// Zoom Controls Component
const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-8 left-8 bg-background/90 backdrop-blur border border-border rounded-lg p-2 shadow-lg flex flex-col gap-2 z-50">
      <button 
        onClick={() => zoomIn()} 
        className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button 
        onClick={() => zoomOut()} 
        className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button 
        onClick={() => resetTransform()} 
        className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
        title="Reset View"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
};

export function FlowCanvas({ events }: FlowCanvasProps) {
  const canvasEvents = useMemo(() => 
    events.filter(e => ['action'].includes(e.type)), 
  [events]);

  const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([]);

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

  // HELPER: Intersection Logic for Rectangle
  const getRectIntersection = (
    rect: { x: number, y: number, w: number, h: number }, 
    target: { x: number, y: number }
  ) => {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    
    const dx = target.x - cx;
    const dy = target.y - cy;
    
    if (dx === 0 && dy === 0) return { x: cx, y: cy };

    const slope = dy / dx;
    const hDist = rect.w / 2;

    if (Math.abs(dx) > 0.01) {
      if (dx > 0) {
          const yRight = cy + slope * hDist;
          if (yRight >= rect.y && yRight <= rect.y + rect.h) {
              return { x: rect.x + rect.w, y: yRight };
          }
      } else {
          const yLeft = cy + slope * (-hDist);
          if (yLeft >= rect.y && yLeft <= rect.y + rect.h) {
              return { x: rect.x, y: yLeft };
          }
      }
    }

    const vDist = rect.h / 2;
    if (Math.abs(dy) > 0.01) {
      if (dy > 0) {
          const xBottom = cx + vDist / slope;
          if (xBottom >= rect.x && xBottom <= rect.x + rect.w) {
              return { x: xBottom, y: rect.y + rect.h };
          }
      } else {
          const xTop = cx + (-vDist) / slope;
          if (xTop >= rect.x && xTop <= rect.x + rect.w) {
              return { x: xTop, y: rect.y };
          }
      }
    }

    return { x: cx, y: cy };
  };

  return (
    <div className="h-full w-full bg-[#fdfbf7] dark:bg-[#1e1e1e] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none" />
      
      <TaskSidebar events={events} />

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
                    {/* Using a simpler filled triangle path and adjusting markerWidth/Height/refX to avoid clipping */}
                    <marker 
                        id="arrowhead-solid" 
                        markerWidth="12" 
                        markerHeight="12" 
                        refX="10" 
                        refY="6" 
                        orient="auto"
                        markerUnits="userSpaceOnUse"
                    >
                       <path d="M2,2 L10,6 L2,10 L2,2" fill="#64748b" /> 
                    </marker>
                  </defs>
                  
                  {canvasEvents.map((event, i) => {
                    if (i === canvasEvents.length - 1) return null;
                    
                    const currentPos = positions.find(p => p.id === event.id);
                    const nextEvent = canvasEvents[i + 1];
                    const nextPos = positions.find(p => p.id === nextEvent.id);
                    
                    if (!currentPos || !nextPos) return null;

                    const rectSrc = { x: currentPos.x, y: currentPos.y, w: CARD_WIDTH, h: 500 }; 
                    const rectTgt = { x: nextPos.x, y: nextPos.y, w: CARD_WIDTH, h: 500 };

                    const centerSrc = { x: rectSrc.x + rectSrc.w / 2, y: rectSrc.y + rectSrc.h / 2 };
                    const centerTgt = { x: rectTgt.x + rectTgt.w / 2, y: rectTgt.y + rectTgt.h / 2 };

                    const start = getRectIntersection(rectSrc, centerTgt);
                    
                    // IMPORTANT: We need to pull back the end point slightly so the arrowhead doesn't get buried inside the card border
                    // Calculate raw intersection
                    const rawEnd = getRectIntersection(rectTgt, centerSrc);
                    
                    // Back off logic
                    // Vector from rawEnd to start
                    // We want to move 'rawEnd' towards 'start' by X pixels (e.g. 2px to clear border)
                    // The arrowhead itself has length, refX handles the tip position relative to line end.
                    // If refX is correct, line end is tip.
                    // But if intersection is EXACTLY on border, and stroke width > 1, maybe it looks clipped.
                    const end = rawEnd; 

                    const dx = end.x - start.x;
                    const dy = end.y - start.y;
                    
                    let cp1, cp2;
                    
                    if (Math.abs(dx) > Math.abs(dy)) {
                         cp1 = { x: start.x + dx * 0.4, y: start.y };
                         cp2 = { x: end.x - dx * 0.4, y: end.y };
                    } else {
                         cp1 = { x: start.x, y: start.y + dy * 0.4 };
                         cp2 = { x: end.x, y: end.y - dy * 0.4 };
                    }

                    return (
                       <path
                         key={`path-${event.id}-${nextEvent.id}`}
                         d={`M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`}
                         stroke="#64748b" 
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
                        
                        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg z-20 border-2 border-background pointer-events-none">
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
