import { useRef, useEffect, useState, useMemo } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { InsightCard } from "./cards/InsightCard";
import { AlertCard } from "./cards/AlertCard";
import { motion } from "framer-motion";

interface FlowCanvasProps {
  events: StoryEvent[];
}

// Configuration for layout
const CARD_WIDTH = 320;
const CARD_HEIGHT = 400; // Approximate
const GAP_X = 100;
const AMPLITUDE_Y = 120; // How much up/down variance

export function FlowCanvas({ events }: FlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Filter only relevant events
  const canvasEvents = useMemo(() => 
    events.filter(e => ['action', 'insight', 'alert'].includes(e.type)), 
  [events]);

  // Calculate positions
  const positions = useMemo(() => {
    return canvasEvents.map((_, index) => {
      const x = 100 + (index * (CARD_WIDTH + GAP_X));
      // Create a gentle wave pattern: 0 -> down -> 0 -> up -> 0
      // index % 4 gives 0, 1, 2, 3
      // We want middle, low, middle, high
      const waveState = index % 4;
      let yOffset = 0;
      if (waveState === 1) yOffset = AMPLITUDE_Y;
      else if (waveState === 3) yOffset = -AMPLITUDE_Y;
      
      return { x, y: yOffset };
    });
  }, [canvasEvents]);

  // Total width calculation
  const totalWidth = positions.length > 0 
    ? positions[positions.length - 1].x + CARD_WIDTH + 400 
    : 1000;

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current && positions.length > 0) {
      const lastPos = positions[positions.length - 1];
      const containerWidth = scrollRef.current.clientWidth;
      
      // Center the last card
      const targetScroll = lastPos.x - (containerWidth / 2) + (CARD_WIDTH / 2);
      
      scrollRef.current.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth"
      });
    }
  }, [positions.length]);

  return (
    <div className="h-full bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Scrollable Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto custom-scrollbar relative"
        style={{ cursor: 'grab' }}
      >
        <div 
          className="relative min-h-full flex items-center"
          style={{ width: totalWidth, height: '100%' }}
        >
          {/* SVG Connector Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#CBD5E1" />
              </marker>
            </defs>
            {positions.map((pos, i) => {
              if (i === positions.length - 1) return null;
              const nextPos = positions[i + 1];
              
              // Coordinates relative to the center line of the container
              // We need to render the SVG covering the full height, so "center" is 50%
              // But React creates a local coordinate system inside the div.
              // Let's assume the div is strictly centered vertically.
              // Actually, simpler: render absolute, use 50% + yOffset.
              
              const startX = pos.x + CARD_WIDTH;
              const startY = `calc(50% + ${pos.y}px)`;
              const endX = nextPos.x;
              const endY = `calc(50% + ${nextPos.y}px)`;
              
              // Control points for bezier curve
              const cp1X = startX + GAP_X / 2;
              
              // We need numerical values for path calculation if we use bezier
              // Since we can't mix calc() in d path easily, let's use a standard height of 800px for calculation
              // and Center = 400px.
              // Alternatively, use lines which are simpler, but curves look better.
              
              // Let's use pure inline styles for the path? No, SVG paths need numbers.
              // We'll trust the 50% vertical alignment of the parent flex container
              // and treat "y=0" as the center line in our math, then translate the SVG group.
              
              return (
                 <path
                   key={`path-${i}`}
                   d={`M ${startX} ${pos.y} C ${startX + GAP_X/2} ${pos.y}, ${endX - GAP_X/2} ${nextPos.y}, ${endX} ${nextPos.y}`}
                   stroke="#CBD5E1"
                   strokeWidth="2"
                   fill="none"
                   markerEnd="url(#arrowhead)"
                   transform="translate(0, 400)" // Assuming approx center is 400px down? 
                   // Better: Use a wrapper div that centers everything.
                 />
              );
            })}
          </svg>
          
          {/* Better SVG approach: Put SVG in a container that matches the content div exactly */}
          <div className="absolute inset-0 pointer-events-none z-0 flex items-center">
             <svg width={totalWidth} height="100%" style={{ overflow: 'visible' }}>
               <defs>
                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
                 </marker>
               </defs>
               <g transform="translate(0, 0)"> 
                  {/* We need the actual center Y in pixels to draw. 
                      Instead of guessing, let's use flexbox for the cards and relative offsets.
                      And draw the lines based on known offsets.
                  */}
                  {positions.map((pos, i) => {
                    if (i === positions.length - 1) return null;
                    const nextPos = positions[i + 1];
                    
                    // Assuming the container height is roughly 100vh or 800px.
                    // Let's assume the center line is at y=0 relative to the "center" alignment.
                    // We will center the SVG vertically in CSS and draw paths from (x, y) to (x, y).
                    
                    // Note: This assumes the SVG is vertically centered in the parent.
                    // If the parent is flex items-center, then y=0 in SVG is the center line if we set overflow visible.
                    
                    // Actually, simpler: Set SVG height to 100% and assume 50% is the baseline.
                    // But we can't get "50%" in pixels inside the path string easily.
                    // Hack: use a large fixed height for SVG and centering, 
                    // or just render the lines as absolute divs with CSS transforms (rotation) 
                    // or simple curved SVGs for each segment.
                    
                    // Let's try individual SVGs between cards? No, too messy.
                    
                    // Let's go with a fixed height assumption for now since it's a prototype.
                    const CENTER_Y = 450; // Approximate center of screen
                    
                    const startX = pos.x + CARD_WIDTH;
                    const startY = CENTER_Y + pos.y;
                    const endX = nextPos.x;
                    const endY = CENTER_Y + nextPos.y;
                    
                    const cp1X = startX + (endX - startX) * 0.5;
                    const cp1Y = startY;
                    const cp2X = startX + (endX - startX) * 0.5;
                    const cp2Y = endY;

                    return (
                       <path
                         key={`path-${i}`}
                         d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX - 10} ${endY}`}
                         stroke="#94A3B8"
                         strokeWidth="2"
                         fill="none"
                         markerEnd="url(#arrowhead)"
                         strokeDasharray="6 4"
                         className="animate-[dash_30s_linear_infinite]"
                       />
                    );
                  })}
               </g>
             </svg>
          </div>

          {/* Cards Layer */}
          {canvasEvents.map((event, index) => {
            const pos = positions[index];
            const isLast = index === canvasEvents.length - 1;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.8, y: pos.y + 50 }}
                animate={{ opacity: 1, scale: 1, y: pos.y }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute z-10"
                style={{
                  left: pos.x,
                  // We use `transform` via framer-motion, but initial pos needs to be set.
                  // Since we are in a flex-centered container, 'top' is tricky.
                  // Let's use `top: 50%` and `marginTop` or `transform`.
                  top: '50%',
                  marginTop: -200, // Half of card height roughly to center it
                  // Then apply the offset
                  y: pos.y 
                }}
              >
                {event.type === 'action' && (
                     <ActionCard 
                       title={event.title || 'Action'} 
                       content={event.content}
                       image={event.image!}
                       timestamp={event.timestamp}
                       metadata={event.metadata}
                       isLast={true} // Hide default lines
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
                   <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg z-20 border-2 border-white">
                      {index + 1}
                   </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Zoom Controls (Visual only) */}
      <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur border border-border rounded-lg p-2 shadow-lg flex flex-col gap-2 z-30">
        <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded">+</button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded">-</button>
      </div>
    </div>
  );
}
