import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { FileCard } from "./cards/FileCard";
import { SuperFloat } from "./SuperFloat";
import { TaskSidebar } from "./TaskSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize, Send, Sparkles, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

export function FlowCanvas({ events, droppedFiles, onFileDrop, onFileDelete }: FlowCanvasProps & { droppedFiles: StoryEvent[], onFileDrop: (files: StoryEvent[]) => void, onFileDelete?: (id: string) => void }) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [cardInputs, setCardInputs] = useState<Record<string, string>>({});
  // droppedFiles state is now lifted
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [openFloats, setOpenFloats] = useState<string[]>([]);
  const [floatPositions, setFloatPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [pinnedFloats, setPinnedFloats] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleFloat = (id: string) => {
    setOpenFloats(prev => {
        if (prev.includes(id)) {
            // Close unless pinned? No, toggle always toggles if triggered by click
            // Actually, if clicked again on card, we might want to close even if pinned? 
            // Usually Toggle means close if open.
            return prev.filter(f => f !== id);
        }
        
        // Initialize position if not already set (re-center or use default logic later)
        // We'll calculate default position in render if not in state, so no need to set here explicitly 
        // unless we want to "reset" position on reopen. Let's keep position memory if dragged?
        // Let's clear position on open to reset to default? No, persistence is nicer.
        return [...prev, id];
    });
  };

  const closeAllFloats = () => {
    // Only close unpinned floats
    setOpenFloats(prev => prev.filter(id => pinnedFloats.includes(id)));
  };
  
  const togglePin = (id: string) => {
      setPinnedFloats(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };
  
  const handleFloatDrag = (id: string, info: any) => {
      // We need to update the specific float position
      // info.delta gives us the movement since last frame (or event)
      // BUT `info.delta` is in screen pixels, potentially scaled?
      // Framer motion drag on a scaled container handles scale automatically usually? 
      // Actually, if we use `drag` prop on motion.div, framer applies visual transform.
      // We want to update the React state `floatPositions` so the tether updates.
      // And we want the position to be "permanent" in our state.
      
      const scale = scaleRef.current || 1;
      
      setFloatPositions(prev => {
          const current = prev[id];
          // If we don't have a position yet (it was using default calculation), we need to grab that default first.
          // This is tricky inside the callback.
          // Better approach: When starting drag, or on every drag frame, we add delta.
          // But `info.delta` is cleaner.
          
          if (!current) {
               // If no custom position exists, we can't easily add delta to "unknown".
               // The render logic calculates default.
               // We should probably INITIALIZE the position in state when the float renders or opens.
               return prev; 
          }
          
          return {
              ...prev,
              [id]: {
                  x: current.x + (info.delta.x / scale),
                  y: current.y + (info.delta.y / scale)
              }
          };
      });
  };

  // We need a way to initialize the position in state when a float is opened or rendered,
  // so that drag operations have a base to work from.
  // Or, we change the drag logic:
  // The `SuperFloat` is positioned by `style={{ left, top }}`.
  // `onDrag` gives us delta. We update `left, top`.
  // To support this, we need to know the calculated default position inside the render loop 
  // and inject it into `floatPositions` if missing.
  // But we can't set state during render.
  // Solution: Just calculate the `activePosition` in render. 
  // If `floatPositions[id]` exists, use it. Else calculate default.
  // BUT `onDrag` provides delta. We need to add delta to `activePosition`.
  // If `activePosition` was default, we need to "commit" it to state + delta.
  
  const updateFloatPosition = (id: string, newPos: {x: number, y: number}) => {
      setFloatPositions(prev => ({ ...prev, [id]: newPos }));
  };

  const canvasEvents = useMemo(() => {
    const actionEvents = events.filter(e => ['action'].includes(e.type));
    return [...actionEvents, ...droppedFiles];
  }, [events, droppedFiles]);

  const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([]);
  const scaleRef = useRef(0.8); // Start with initial scale

  useEffect(() => {
    setPositions(prev => {
      // Re-calculate positions based on tree structure for proper branching
      // But keep it somewhat compact (Swimlane-like)
      
      const childrenMap: Record<string, string[]> = {};
      const roots: string[] = [];

      // 1. Build Tree Relationship
      canvasEvents.forEach(e => {
        if (e.parentId && canvasEvents.find(ce => ce.id === e.parentId)) {
           if (!childrenMap[e.parentId]) childrenMap[e.parentId] = [];
           childrenMap[e.parentId].push(e.id);
        } else {
           roots.push(e.id);
        }
      });

      const calculatedPositions: {id: string, x: number, y: number}[] = [];
      // Track row usage: Map<row_index, max_x_in_that_row>
      const rowMaxX: Record<number, number> = {};

      const getNextAvailableX = (row: number) => {
         const lastX = rowMaxX[row] || (100 - (CARD_WIDTH + GAP_X)); 
         return lastX + CARD_WIDTH + GAP_X;
      };

      const processNode = (id: string, row: number) => {
         if (calculatedPositions.find(p => p.id === id)) return;

         const x = getNextAvailableX(row);
         const y = 100 + (row * (CARD_HEIGHT + GAP_Y));

         calculatedPositions.push({ id, x, y });
         rowMaxX[row] = x;

         const children = childrenMap[id] || [];
         
         if (children.length > 0) {
             // First child continues on the same row (main path)
             processNode(children[0], row);
             
             // Subsequent children start new rows (branches)
             for (let i = 1; i < children.length; i++) {
                 // Find a fresh row below
                 const newRow = row + i; 
                 
                 // ALIGNMENT TWEAK: Start the branch slightly after the parent's X position
                 if (!rowMaxX[newRow] || rowMaxX[newRow] < x) {
                    rowMaxX[newRow] = x - (CARD_WIDTH + GAP_X); // Set "previous" card to be parent's slot
                 }
                 
                 processNode(children[i], newRow);
             }
         }
      };

      // Process all roots
      roots.forEach((rootId, i) => processNode(rootId, i * 2)); // Separate trees by rows

      // MERGE: Preserve existing positions if the user dragged them
      return calculatedPositions.map(pos => {
        const existing = prev.find(p => p.id === pos.id);
        return existing || pos;
      });
    });
  }, [canvasEvents.length]); // Re-calculate when number of events changes

  const handleDrag = useCallback((id: string, info: any) => {
    const scale = scaleRef.current || 1;
    setPositions(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          x: p.x + (info.delta.x / scale), 
          y: p.y + (info.delta.y / scale) 
        };
      }
      return p;
    }));
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    // Handle folders using webkitGetAsEntry if available
    const items = Array.from(e.dataTransfer.items || []);
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;

    // Check if we have directory entries
    const entries = items
      .map(item => item.webkitGetAsEntry ? item.webkitGetAsEntry() : null)
      .filter(entry => entry !== null);

    const newEvents: StoryEvent[] = [];

    // If we have directory entries, process them
    if (entries.length > 0) {
      entries.forEach((entry, index) => {
        if (entry!.isDirectory) {
          // It's a folder
          newEvents.push({
            id: `folder-${Date.now()}-${index}`,
            type: 'file',
            title: entry!.name,
            content: 'Folder',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fileType: 'folder', // Custom type for folder
            parentId: undefined
          });
        } else {
           // It's a file
           const file = files.find(f => f.name === entry!.name);
           if (file) {
              const size = file.size > 1024 * 1024 
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                : `${(file.size / 1024).toFixed(1)} KB`;

              newEvents.push({
                id: `file-${Date.now()}-${index}`,
                type: 'file',
                title: file.name,
                content: size,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fileType: file.type,
                parentId: undefined
              });
           }
        }
      });
    } else {
       // Fallback to standard file drop if webkitGetAsEntry not supported
        files.forEach((file, index) => {
            const size = file.size > 1024 * 1024 
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                : `${(file.size / 1024).toFixed(1)} KB`;

            newEvents.push({
                id: `file-${Date.now()}-${index}`,
                type: 'file',
                title: file.name,
                content: size,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fileType: file.type,
                parentId: undefined
            });
        });
    }

    onFileDrop([...droppedFiles, ...newEvents]);
    
    toast({
        title: "Items Added",
        description: `Added ${newEvents.length} item(s) to the canvas.`,
    });
  };

  const contentWidth = 100 + (4 * (CARD_WIDTH + GAP_X)) + 400; // Expanded width for potential branches
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
    <div 
        className="h-full w-full bg-[#f8f9fa] dark:bg-[#09090b] relative overflow-hidden group/canvas"
        onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleFileDrop}
    >
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDraggingFile && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-4 border-dashed border-primary m-4 rounded-3xl flex items-center justify-center pointer-events-none"
            >
                <div className="bg-background/90 p-8 rounded-full shadow-2xl flex flex-col items-center gap-4 animate-bounce">
                    <Upload className="w-12 h-12 text-primary" />
                    <span className="font-bold text-lg text-primary">Drop files to add to canvas</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Grid Pattern - Dot style for modern look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.3]"
        style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            maskImage: 'radial-gradient(circle at center, black, transparent 95%)'
        }}
      />
      {/* Secondary larger grid for structure - even more subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]"
         style={{
             backgroundImage: `
                linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
             `,
             backgroundSize: '80px 80px'
         }}
      />
      
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
        onTransformed={(e) => {
           scaleRef.current = e.state.scale;
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Global Dismiss for Floats */}
            {openFloats.length > 0 && (
                <div 
                    className="absolute inset-0 z-40 bg-transparent" 
                    onClick={closeAllFloats}
                />
            )}
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
                    // Logic: Connect event to its parent if it exists
                    // Or fall back to linear previous if no parentId (for backward compatibility/roots)
                    // But here we want explicit tree connections.
                    
                    const currentPos = positions.find(p => p.id === event.id);
                    if (!currentPos) return null;
                    
                    let parentId = event.parentId;
                    // Fallback for demo: if no parentId, assume it's part of the main chain? 
                    // No, for the demo to work cleanly with tree layout, we should rely on explicit parentId 
                    // OR if it's i > 0 and no parentId, maybe link to i-1 (linear fallback).
                    if (!parentId && i > 0 && event.type !== 'file') {
                         // Check if this node is a root (no parent). If so, don't link to previous.
                         // But for linear parts of mock data that don't have parentId yet, we want links.
                         // Simple heuristic: if I am a root (in the tree calc), I have no parent.
                         // So only draw line if I am NOT a root?
                         // Actually, let's just look for parentId. If missing, don't draw (except for linear legacy).
                         // For this specific update, I added parentId to the new nodes.
                         // I need to make sure the linear nodes have parentIds or implicit links.
                         
                         // IMPLICIT LINKING: if no parentId, link to previous node in array IF previous node is not a "leaf" of another branch?
                         // Safest: Use index-1 as parent if no parentId is set.
                         const prevEvent = canvasEvents[i-1];
                         parentId = prevEvent.id;
                    }

                    if (!parentId) return null;

                    const parentPos = positions.find(p => p.id === parentId);
                    if (!parentPos) return null; // Parent might not be positioned yet or filtered out

                    const rectSrc = { x: parentPos.x, y: parentPos.y, w: CARD_WIDTH, h: 500 }; 
                    const rectTgt = { x: currentPos.x, y: currentPos.y, w: CARD_WIDTH, h: 500 };

                    const centerSrc = { x: rectSrc.x + rectSrc.w / 2, y: rectSrc.y + rectSrc.h / 2 };
                    const centerTgt = { x: rectTgt.x + rectTgt.w / 2, y: rectTgt.y + rectTgt.h / 2 };

                    const start = getRectIntersection(rectSrc, centerTgt);
                    const rawEnd = getRectIntersection(rectTgt, centerSrc);
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
                         key={`path-${parentId}-${event.id}`}
                         d={`M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`}
                         stroke="#64748b" 
                         strokeWidth="2"
                         fill="none"
                         markerEnd="url(#arrowhead-solid)"
                       />
                    );
                  })}
                  {/* Super Float Tethers */}
                  {openFloats.map(floatId => {
                      const cardPos = positions.find(p => p.id === floatId);
                      if (!cardPos) return null;
                      
                      const floatX = cardPos.x + CARD_WIDTH + 80; // Increased gap for wider document
                      const floatY = cardPos.y - 50; // Shift up slightly to center vertically relative to card start
                      
                      const start = { x: cardPos.x + CARD_WIDTH, y: cardPos.y + 400 };
                      const end = { x: floatX, y: floatY + 60 };
                      
                      const cp1 = { x: start.x + 40, y: start.y };
                      const cp2 = { x: end.x - 40, y: end.y };

                      return (
                          <path
                              key={`tether-${floatId}`}
                              d={`M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`}
                              stroke="rgba(59, 130, 246, 0.5)"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="4"
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
                      className="absolute z-10 cursor-grab active:cursor-grabbing draggable-card group"
                      drag
                      dragMomentum={false} 
                      dragElastic={0}
                      onDrag={(e, info) => handleDrag(event.id, info)}
                      onMouseEnter={() => setHoveredCardId(event.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
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
                            {event.type === 'file' ? (
                                <FileCard 
                                    title={event.title || 'Unknown File'} 
                                    content={event.content}
                                    fileType={event.fileType}
                                    timestamp={event.timestamp}
                                    isLast={true}
                                />
                            ) : (
                                <ActionCard 
                                  title={event.title || 'Action'} 
                                  content={event.content}
                                  image={event.image!}
                                  timestamp={event.timestamp}
                                  metadata={event.metadata}
                                  isLast={true} 
                                  onInsightClick={() => toggleFloat(event.id)}
                                />
                            )}
                         </div>
                      </div>
                        
                        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg z-20 border-2 border-background pointer-events-none">
                            {index + 1}
                        </div>

                        {/* AI Chat Input - Appears on Hover */}
                        <AnimatePresence>
                          {hoveredCardId === event.id && (
                            <motion.div
                              key="chat-input-box"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 right-0 z-30 pointer-events-auto pt-4"
                              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking input
                            >
                              <div className="bg-background/95 backdrop-blur shadow-xl border border-border rounded-xl p-2 flex gap-2 items-center w-full box-border">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-3 h-3 text-primary" />
                                </div>
                                <Input 
                                  className="flex-1 h-8 text-xs border-0 bg-transparent focus-visible:ring-0 px-0 shadow-none placeholder:text-muted-foreground/70 min-w-0"
                                  placeholder="Ask AI about this step..."
                                  value={cardInputs[event.id] || ''}
                                  onChange={(e) => setCardInputs(prev => ({ ...prev, [event.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      // Handle submit mock
                                      console.log('Ask AI:', cardInputs[event.id]);
                                      setCardInputs(prev => ({ ...prev, [event.id]: '' }));
                                    }
                                  }}
                                />
                                <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0 rounded-full hover:bg-primary/10 hover:text-primary">
                                  <Send className="w-3 h-3" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Super Floats Layer */}
                <AnimatePresence>
                    {openFloats.map(floatId => {
                        const cardPos = positions.find(p => p.id === floatId);
                        const event = canvasEvents.find(e => e.id === floatId);
                        if (!cardPos || !event) return null;
                        
                        const floatX = cardPos.x + CARD_WIDTH + 60;
                        const floatY = cardPos.y;

                        return (
                            <SuperFloat 
                                key={`float-${floatId}`}
                                cardId={floatId}
                                title={event.title}
                                content={event.content}
                                onClose={() => toggleFloat(floatId)}
                                position={{ x: floatX, y: floatY }}
                            />
                        );
                    })}
                </AnimatePresence>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
