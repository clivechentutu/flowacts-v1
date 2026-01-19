import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { InsightCard } from "./cards/InsightCard";
import { AlertCard } from "./cards/AlertCard";
import { motion, useMotionValue } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface FlowCanvasProps {
  events: StoryEvent[];
}

// Configuration for layout
const CARD_WIDTH = 320;
const CARD_HEIGHT = 400; 
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

  // Track positions in state to allow dragging
  const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([]);

  // Initialize positions with "Snake" layout
  useEffect(() => {
    setPositions(prev => {
      // Map current events to positions
      return canvasEvents.map((event, index) => {
        // Check if we already have a position for this event
        const existing = prev.find(p => p.id === event.id);
        if (existing) return existing;

        // Snake Layout Calculation
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

  // LIVE update on Drag
  const handleDrag = useCallback((id: string, info: any) => {
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          x: p.x + info.delta.x, // Use delta to update position incrementally
          y: p.y + info.delta.y 
        };
      }
      return p;
    }));
  }, []);

  // Calculate canvas content size
  const contentWidth = 100 + (CARDS_PER_ROW * (CARD_WIDTH + GAP_X)) + 400;
  const contentHeight = positions.length > 0 
    ? Math.max(...positions.map(p => p.y)) + CARD_HEIGHT + 400 
    : 1500;

  return (
    <div className="h-full w-full bg-slate-50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <TransformWrapper
        initialScale={0.8}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.05 }} // Smoother zoom
        panning={{ velocityDisabled: false }}
        doubleClick={{ disabled: true }}
        limitToBounds={false} // Allow infinite panning feel
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
                  // Ensure we have some padding so dragging doesn't hit edge immediately
                  transformOrigin: '0 0'
                }}
              >
                {/* SVG Connections Layer - BEHIND everything */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  <defs>
                    <marker id="arrowhead-solid" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                       <path d="M2,2 L10,6 L2,10 L2,2" fill="#94A3B8" />
                    </marker>
                  </defs>
                  
                  {canvasEvents.map((event, i) => {
                    if (i === canvasEvents.length - 1) return null;
                    
                    const currentPos = positions.find(p => p.id === event.id);
                    const nextEvent = canvasEvents[i + 1];
                    const nextPos = positions.find(p => p.id === nextEvent.id);
                    
                    if (!currentPos || !nextPos) return null;

                    // Simple logic: Connect closest edges or centers
                    // Let's use bounding boxes
                    const boxA = { 
                      left: currentPos.x, right: currentPos.x + CARD_WIDTH,
                      top: currentPos.y, bottom: currentPos.y + 200, // approx height center
                      centerX: currentPos.x + CARD_WIDTH/2, centerY: currentPos.y + 200
                    };
                    const boxB = {
                      left: nextPos.x, right: nextPos.x + CARD_WIDTH,
                      top: nextPos.y, bottom: nextPos.y + 200,
                      centerX: nextPos.x + CARD_WIDTH/2, centerY: nextPos.y + 200
                    };

                    // Simple Bezier from Center to Center? Or Edge to Edge?
                    // User complained about "detach". Let's use strict center-to-center logic first,
                    // but obscured by the cards (z-index).
                    // Actually, let's just draw from center to center.
                    
                    const startX = boxA.centerX;
                    const startY = boxA.centerY;
                    const endX = boxB.centerX;
                    const endY = boxB.centerY;

                    // Control points based on relative position
                    const dx = Math.abs(endX - startX);
                    const dy = Math.abs(endY - startY);
                    
                    // Dynamic Curvature
                    let cp1X, cp1Y, cp2X, cp2Y;
                    
                    if (dx > dy) {
                        // Horizontal dominant
                        cp1X = startX + (endX - startX) / 2;
                        cp1Y = startY;
                        cp2X = endX - (endX - startX) / 2;
                        cp2Y = endY;
                    } else {
                        // Vertical dominant
                        cp1X = startX;
                        cp1Y = startY + (endY - startY) / 2;
                        cp2X = endX;
                        cp2Y = endY - (endY - startY) / 2;
                    }

                    return (
                       <path
                         key={`path-${event.id}-${nextEvent.id}`}
                         d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
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
                      className="absolute z-10 cursor-grab active:cursor-grabbing"
                      // Use drag listener to update state in real-time
                      drag
                      dragMomentum={false} 
                      dragElastic={0}
                      onDrag={(e, info) => handleDrag(event.id, info)}
                      // We must use 'style' for position to be controlled by state if we want SVG to sync
                      // BUT motion drag uses transforms.
                      // To make them sync perfectly, we can't let Framer handle the visual transform alone.
                      // We must update the actual layout position.
                      // Actually, if we update state onDrag, re-render happens.
                      // We should set the 'x' and 'y' directly in style.
                      style={{
                        x: pos.x,
                        y: pos.y,
                        width: CARD_WIDTH,
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                      // Disable framer's internal transform application for drag?
                      // No, simply setting x/y in style overrides it?
                      // Let's try _drag_ controls.
                    >
                      {/* Card Content... */}
                      <div className="pointer-events-none"> 
                         {/* Wrap content in pointer-events-none so drag works on the whole div container easily, 
                             but buttons inside need pointer-events-auto */}
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
