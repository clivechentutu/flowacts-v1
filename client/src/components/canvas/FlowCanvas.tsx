import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { ActionCard } from "./cards/ActionCard";
import { FileCard } from "./cards/FileCard";
import { SuperFloat } from "./SuperFloat";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { TaskSidebar } from "./TaskSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent, useControls, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize, Send, Sparkles, Upload, Crop, Share2, Copy, ExternalLink, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, CreditCard, Sparkle, Users, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface FlowCanvasProps {
  events: StoryEvent[];
}

type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  role?: string;
};

type TeamTab = 'ai' | 'human';

type TeamMemberAddDraft = {
  name: string;
  role: string;
};

// Configuration for layout
const CARD_WIDTH = 360;
const CARD_HEIGHT = 500;
const GAP_X = 150;
const GAP_Y = 150;
const CARDS_PER_ROW = 3;

type KeyframeKind = "blocker" | "success" | "paywall";

function detectKeyframe(event: StoryEvent): KeyframeKind | null {
  const hay = `${event.title || ""}\n${event.content || ""}\n${Object.entries(event.metadata || {})
    .map(([k, v]) => `${k}:${v}`)
    .join("\n")}`.toLowerCase();

  // Paywall / pricing friction
  if (/(paywall|pricing|upgrade|subscribe|trial ended|payment required|locked)/.test(hay)) return "paywall";

  // Errors / blockers
  if (/(error|failed|failure|blocked|denied|timeout|invalid|mismatch|critical|risk)/.test(hay)) return "blocker";

  // Success / conversion
  if (/(success|successful|converted|conversion|completed|submitted|welcome|dashboard loaded|email received|redirected)/.test(hay)) return "success";

  return null;
}

type ActionGroup = {
  id: string;
  kind: "group";
  title: string;
  start: StoryEvent;
  end: StoryEvent;
  steps: StoryEvent[];
  keyframe: KeyframeKind | null;
};

type RenderNode = StoryEvent | ActionGroup;

function toRenderNodes(actionEvents: StoryEvent[]): RenderNode[] {
  const minor = (e: StoryEvent) => {
    const t = `${e.title || ""} ${e.content || ""}`.toLowerCase();
    return /(click|tap|focus|type|typing|enter|input|keystroke|scroll|hover|select|choose|open dropdown|paste)/.test(t);
  };

  const nodes: RenderNode[] = [];

  let i = 0;
  while (i < actionEvents.length) {
    const current = actionEvents[i];
    const currentKey = detectKeyframe(current);

    // If this is already a keyframe or not a minor step, keep it as a standalone node.
    if (currentKey || !minor(current)) {
      nodes.push(current);
      i += 1;
      continue;
    }

    // Start a group of consecutive minor steps, until we reach a non-minor or keyframe.
    const start = current;
    const steps: StoryEvent[] = [current];
    i += 1;

    while (i < actionEvents.length) {
      const next = actionEvents[i];
      const nextKey = detectKeyframe(next);
      if (nextKey || !minor(next)) break;
      steps.push(next);
      i += 1;
    }

    // If we only captured 1 minor step, don't group it.
    if (steps.length < 2) {
      nodes.push(start);
      continue;
    }

    const end = steps[steps.length - 1];

    nodes.push({
      id: `group-${start.id}-${end.id}`,
      kind: "group",
      title: "Action Group",
      start,
      end,
      steps,
      keyframe: null,
    });
  }

  return nodes;
}

// Zoom Controls Component
const Controls = ({ onScreenshot, scale, setScale }: { onScreenshot: () => void, scale: number, setScale: (s: number) => void }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  
  // Handlers for the new bottom-right control
  const handleZoomIn = () => {
      zoomIn(); 
      // We can't easily get the new scale directly from zoomIn return, 
      // but the TransformWrapper state updates and re-renders.
      // However, we are passing `scale` as prop which comes from a ref or state?
      // Let's look at how FlowCanvas uses this.
  };
  const handleZoomOut = () => zoomOut();

  return (
    <>
        {/* Original Left Controls - Kept as is or simplified? 
            User said "Do not change any other functions", but also "red box position needs zoom state".
            The red box is bottom right. The existing controls are bottom left.
            I will keep the Screenshot/Reset on the left if needed, or maybe just hide the zoom buttons from the left 
            if they are now on the right? 
            Let's keep the left controls for Reset/Screenshot as they provide extra utility, 
            but maybe remove the duplicate zoom buttons to clean up? 
            Or just leave them alone to be safe ("do not change any other functions").
            
            Actually, the user showed a screenshot of the bottom right zoom control. 
            I will add the NEW control to the bottom right.
        */}
        <div className="absolute bottom-8 left-8 bg-background/90 backdrop-blur border border-border rounded-lg p-2 shadow-lg flex flex-col gap-2 z-50">
            <button 
                onClick={() => resetTransform()} 
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title="Reset View"
            >
                <Maximize className="w-4 h-4" />
            </button>
            <div className="w-full h-px bg-border my-1" />
            <button 
                onClick={onScreenshot} 
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title="Screenshot Area"
            >
                <Crop className="w-4 h-4" />
            </button>
        </div>

        {/* New Bottom Right Zoom Control (Miro-style) */}
        <div className="absolute bottom-8 right-8 z-50">
            <div className="bg-white/95 backdrop-blur shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-black/[0.03] rounded-xl flex items-center p-1.5 gap-1">
                <button 
                    onClick={() => zoomOut()}
                    className="w-9 h-9 flex items-center justify-center hover:bg-black/[0.04] rounded-lg text-black/80 transition-colors active:scale-95 duration-100"
                >
                    <ZoomOut className="w-5 h-5" strokeWidth={1.5} />
                </button>
                
                <div className="min-w-[56px] text-center select-none font-medium text-black/90 text-sm tabular-nums">
                    {Math.round(scale * 100)}%
                </div>

                <button 
                    onClick={() => zoomIn()}
                    className="w-9 h-9 flex items-center justify-center hover:bg-black/[0.04] rounded-lg text-black/80 transition-colors active:scale-95 duration-100"
                >
                    <ZoomIn className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    </>
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
  
  // Preview Modal State
  const [previewMedia, setPreviewMedia] = useState<{
      isOpen: boolean;
      title: string;
      type: string;
      url?: string;
      content?: string;
  }>({
      isOpen: false,
      title: '',
      type: 'image',
  });

  // Screenshot State
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, currentX: number, currentY: number} | null>(null);

  const { toast } = useToast();

  const initialAiTeamMembers: TeamMember[] = useMemo(() => {
    // Mock data for prototype: Super Team agents participating in this canvas/project
    return [
      { id: 'p-1', name: 'Competitive Intelligence Analyst', role: 'CI Analyst', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=CI' },
      { id: 'p-2', name: 'Product Manager', role: 'PM', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=PM' },
      { id: 'p-3', name: 'UX Researcher', role: 'UX', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=UX' },
      { id: 'p-4', name: 'Product Marketing Manager', role: 'PMM', avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=PMM' },
    ];
  }, []);

  const initialHumanTeamMembers: TeamMember[] = useMemo(() => {
    // Mock data for prototype: invited human collaborators
    return [
      { id: 'h-1', name: 'Alice Chen', role: 'Design Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
      { id: 'h-2', name: 'Bo Zhang', role: 'PM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bo' },
      { id: 'h-3', name: 'Chris Li', role: 'Research', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    ];
  }, []);

  const [participatingAiTeamMembers, setParticipatingAiTeamMembers] = useState<TeamMember[]>(initialAiTeamMembers);
  const [participatingHumanTeamMembers, setParticipatingHumanTeamMembers] = useState<TeamMember[]>(initialHumanTeamMembers);

  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [teamMenuTab, setTeamMenuTab] = useState<TeamTab>('ai');

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [addMemberDraft, setAddMemberDraft] = useState<TeamMemberAddDraft>({ name: '', role: '' });

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Upliftly Canvas",
          text: "Check out this canvas in Upliftly.",
          url: shareUrl,
        });
        return;
      }
    } catch {
      // fall back to copy
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard.",
      });
    } catch {
      toast({
        title: "Couldn't copy link",
        description: "Please copy the URL from your browser.",
        variant: "destructive",
      });
    }
  };

  const handleScreenshotStart = () => {
    setIsScreenshotMode(true);
    setSelectionBox(null);
    toast({
        title: "Screenshot Mode",
        description: "Click and drag to select an area to capture.",
    });
  };

  const handleScreenshotMouseDown = (e: React.MouseEvent) => {
      if (!isScreenshotMode) return;
      e.preventDefault();
      setSelectionBox({
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY
      });
  };

  const handleScreenshotMouseMove = (e: React.MouseEvent) => {
      if (!isScreenshotMode || !selectionBox) return;
      setSelectionBox(prev => prev ? ({ ...prev, currentX: e.clientX, currentY: e.clientY }) : null);
  };

  const handleScreenshotMouseUp = async () => {
      if (!isScreenshotMode || !selectionBox) return;
      
      const startX = Math.min(selectionBox.startX, selectionBox.currentX);
      const startY = Math.min(selectionBox.startY, selectionBox.currentY);
      const width = Math.abs(selectionBox.currentX - selectionBox.startX);
      const height = Math.abs(selectionBox.currentY - selectionBox.startY);

      if (width < 10 || height < 10) {
          // Too small, cancel or just clear selection
          setSelectionBox(null);
          return;
      }

      setIsScreenshotMode(false); // Hide overlay to take shot

      // Small delay to ensure React renders the removal of overlay
      setTimeout(async () => {
        try {
            const canvas = await html2canvas(document.body, {
                x: startX + window.scrollX,
                y: startY + window.scrollY,
                width: width,
                height: height,
                useCORS: true,
                ignoreElements: (element) => element.classList.contains('screenshot-exclude')
            });

            canvas.toBlob((blob) => {
                if (!blob) return;

                // Copy to Clipboard
                try {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]);
                    toast({
                        title: "Screenshot Copied",
                        description: "Image copied to clipboard. Downloading now...",
                    });
                } catch (err) {
                    console.error("Clipboard write failed", err);
                }

                // Download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `flow-capture-${Date.now()}.png`;
                link.click();
                URL.revokeObjectURL(url);
            });
        } catch (err) {
            console.error("Capture failed:", err);
            toast({
                title: "Capture Failed",
                description: "Could not capture the selected area.",
                variant: "destructive"
            });
        }
        setSelectionBox(null);
      }, 50);
  };

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

  const handleMediaClick = (event: StoryEvent) => {
     let type = 'document';
     let url = undefined;

     if (event.type === 'file') {
         type = event.fileType || 'document';
         // Mock URL or real one if implemented
     } else {
         type = 'image';
         url = event.image;
     }

     setPreviewMedia({
         isOpen: true,
         title: event.title || 'Untitled',
         type,
         url,
         content: event.content
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

  const actionEvents = useMemo(() => events.filter(e => ['action'].includes(e.type)), [events]);

  const renderNodes = useMemo(() => toRenderNodes(actionEvents), [actionEvents]);

  const canvasEvents = useMemo(() => {
    // For layout + connections, we want a flat list of concrete events.
    // Groups render as summary nodes, but still need positions for their underlying steps when expanded.
    // We'll primarily position: group summaries + standalone action events + dropped files.
    const flattenedForCanvas: StoryEvent[] = [];

    renderNodes.forEach((n) => {
      if ((n as any).kind === "group") {
        const g = n as ActionGroup;
        // Represent the group as a synthetic action-like event for positioning.
        flattenedForCanvas.push({
          id: g.id,
          type: "action",
          title: `${g.title}: ${g.start.title || ""}`.trim(),
          content: `${g.steps.length} steps collapsed`,
          timestamp: g.end.timestamp,
          metadata: { "Collapsed": `${g.steps.length} steps` },
          parentId: g.start.parentId,
        });
      } else {
        flattenedForCanvas.push(n as StoryEvent);
      }
    });

    return [...flattenedForCanvas, ...droppedFiles];
  }, [renderNodes, droppedFiles]);

  const [positions, setPositions] = useState<{id: string, x: number, y: number}[]>([]);
  const [currentScale, setCurrentScale] = useState(0.8); // State for UI zoom display
  const scaleRef = useRef(0.8); // Start with initial scale
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  // Auto-scroll to new cards if they are out of view
  useEffect(() => {
    if (positions.length === 0 || !transformComponentRef.current) return;

    // Get the last added event's position
    const lastEvent = canvasEvents[canvasEvents.length - 1];
    if (!lastEvent) return;

    const lastPos = positions.find(p => p.id === lastEvent.id);
    if (!lastPos) return;

    const { positionX, positionY, scale } = transformComponentRef.current.instance.transformState;
    
    // Calculate screen coordinates of the card
    const cardScreenRight = (lastPos.x + CARD_WIDTH) * scale + positionX;
    const cardScreenBottom = (lastPos.y + CARD_HEIGHT) * scale + positionY;

    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const paddingRight = 450; // Increased padding to account for AI Chat sidebar on the right
    const paddingBottom = 100;

    let newX = positionX;
    let newY = positionY;
    let shouldScroll = false;

    // Check horizontal bounds (only scroll if offscreen to the right)
    if (cardScreenRight > viewportWidth - paddingRight) {
        // Scroll so the card is visible with some padding from the right edge
        // Increasing paddingRight to ensure it clears the sidebar (approx 450px + extra buffer)
        newX = viewportWidth - (paddingRight + 100) - (lastPos.x + CARD_WIDTH) * scale;
        shouldScroll = true;
    }

    // Check vertical bounds (only scroll if offscreen to the bottom)
    if (cardScreenBottom > viewportHeight - paddingBottom) {
        // Scroll so the card is visible with some padding from the bottom edge
        newY = viewportHeight - paddingBottom - (lastPos.y + CARD_HEIGHT) * scale;
        shouldScroll = true;
    }

    if (shouldScroll) {
        // Smooth pan to new position
        transformComponentRef.current.setTransform(newX, newY, scale, 1000, "easeOut");
    }
  }, [positions, canvasEvents]); // Dependency on positions ensures this runs after layout update

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
        className="h-full w-full bg-[var(--canvas-background)] relative overflow-hidden group/canvas transition-colors duration-300"
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
      <div className="absolute inset-0 pointer-events-none opacity-100"
        style={{
            backgroundImage: `radial-gradient(circle, var(--canvas-grid) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(circle at center, black, transparent 95%)'
        }}
      />
      {/* Secondary larger grid for structure - even more subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.3]"
         style={{
             backgroundImage: `
                linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px),
                linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)
             `,
             backgroundSize: '120px 120px'
         }}
      />
      
      <TaskSidebar events={events} />

      <TransformWrapper
        ref={transformComponentRef}
        initialScale={0.8}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.05 }}
        panning={{ velocityDisabled: false, excluded: ["draggable-card", "super-float-header", "super-float-container"] }} 
        doubleClick={{ disabled: true }}
        limitToBounds={false}
        onTransformed={(e) => {
           scaleRef.current = e.state.scale;
           setCurrentScale(e.state.scale);
           // Update CSS variable for adaptive UI elements
           if (e.instance.wrapperComponent) {
               e.instance.wrapperComponent.style.setProperty('--zoom-scale', e.state.scale.toString());
           }
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
            <div className="absolute top-6 right-6 z-50 flex items-center gap-2 screenshot-exclude">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTeamMenuOpen((v) => !v)}
                  className="h-9 w-9 rounded-lg shadow-md border border-border bg-background/85 hover:bg-background/95 backdrop-blur flex items-center justify-center transition-colors"
                  data-testid="button-canvas-team"
                  title="Participating team"
                >
                  <Users className="w-4 h-4" />
                </button>

                {isTeamMenuOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => {
                        setIsTeamMenuOpen(false);
                        setIsAddMemberOpen(false);
                      }}
                      data-testid="overlay-team-menu-dismiss"
                      aria-label="Dismiss team menu"
                    />

                    <div
                      className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-background/95 backdrop-blur shadow-xl overflow-hidden z-50"
                      data-testid="menu-canvas-team"
                    >
                        <div className="px-3 py-2 border-b border-border/60">
                      <div className="text-xs font-semibold text-foreground" data-testid="text-team-menu-title">
                        Participating Team
                      </div>
                      <div className="text-[11px] text-muted-foreground" data-testid="text-team-menu-subtitle">
                        AI agents & invited collaborators
                      </div>

                      <div className="mt-2 flex items-center gap-1" data-testid="tabs-team-menu">
                        <div className="flex flex-1 items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
                          <div className="relative flex-1">
                            <button
                              type="button"
                              onClick={() => {
                                setTeamMenuTab('ai');
                                setIsAddMemberOpen(false);
                              }}
                              className={cn(
                                "w-full rounded-md px-2 py-1 text-[11px] font-semibold transition-all",
                                teamMenuTab === 'ai' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                              )}
                              data-testid="tab-team-ai"
                            >
                              AI team
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeamMenuTab('ai');
                                setIsAddMemberOpen(true);
                                setAddMemberDraft({ name: '', role: '' });
                              }}
                              className={cn(
                                "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border border-border/60 bg-background/70 hover:bg-background shadow-sm inline-flex items-center justify-center transition-colors",
                                teamMenuTab === 'ai' && isAddMemberOpen ? "ring-1 ring-primary/30" : ""
                              )}
                              title="Add AI member"
                              data-testid="button-add-ai-member"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="relative flex-1">
                            <button
                              type="button"
                              onClick={() => {
                                setTeamMenuTab('human');
                                setIsAddMemberOpen(false);
                              }}
                              className={cn(
                                "w-full rounded-md px-2 py-1 text-[11px] font-semibold transition-all",
                                teamMenuTab === 'human' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                              )}
                              data-testid="tab-team-human"
                            >
                              Human team
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeamMenuTab('human');
                                setIsAddMemberOpen(true);
                                setAddMemberDraft({ name: '', role: '' });
                              }}
                              className={cn(
                                "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border border-border/60 bg-background/70 hover:bg-background shadow-sm inline-flex items-center justify-center transition-colors",
                                teamMenuTab === 'human' && isAddMemberOpen ? "ring-1 ring-primary/30" : ""
                              )}
                              title="Invite human collaborator"
                              data-testid="button-add-human-member"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      {isAddMemberOpen && (
                        <div className="mb-2 rounded-lg border border-border/60 bg-muted/20 p-2" data-testid="panel-add-member">
                          <div className="grid grid-cols-1 gap-2">
                            <input
                              value={addMemberDraft.name}
                              onChange={(e) => setAddMemberDraft((d) => ({ ...d, name: e.target.value }))}
                              placeholder={teamMenuTab === 'ai' ? 'AI role name (e.g., Pricing Analyst)' : 'Collaborator name'}
                              className="h-8 w-full rounded-md border border-border bg-background/80 px-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                              data-testid={teamMenuTab === 'ai' ? 'input-add-ai-name' : 'input-add-human-name'}
                            />
                            <input
                              value={addMemberDraft.role}
                              onChange={(e) => setAddMemberDraft((d) => ({ ...d, role: e.target.value }))}
                              placeholder={teamMenuTab === 'ai' ? 'Short role label (e.g., CI)' : 'Role (e.g., PM, Design)'}
                              className="h-8 w-full rounded-md border border-border bg-background/80 px-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                              data-testid={teamMenuTab === 'ai' ? 'input-add-ai-role' : 'input-add-human-role'}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddMemberOpen(false)}
                              className="h-8 px-2 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                              data-testid="button-add-member-cancel"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const name = addMemberDraft.name.trim();
                                const role = addMemberDraft.role.trim();
                                if (!name) return;

                                const idPrefix = teamMenuTab === 'ai' ? 'p' : 'h';
                                const newId = `${idPrefix}-${Date.now()}`;
                                const avatarSeed = encodeURIComponent(name);
                                const avatar = teamMenuTab === 'ai'
                                  ? `https://api.dicebear.com/7.x/thumbs/svg?seed=${avatarSeed}`
                                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

                                const newMember: TeamMember = {
                                  id: newId,
                                  name,
                                  role: role || (teamMenuTab === 'ai' ? 'AI' : 'Collaborator'),
                                  avatar,
                                };

                                if (teamMenuTab === 'ai') {
                                  setParticipatingAiTeamMembers((prev) => [newMember, ...prev]);
                                } else {
                                  setParticipatingHumanTeamMembers((prev) => [newMember, ...prev]);
                                }

                                setIsAddMemberOpen(false);
                                setAddMemberDraft({ name: '', role: '' });
                              }}
                              className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                              data-testid={teamMenuTab === 'ai' ? 'button-add-ai-confirm' : 'button-add-human-confirm'}
                            >
                              {teamMenuTab === 'ai' ? 'Add' : 'Invite'}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2" data-testid="list-team-members">
                        {(teamMenuTab === 'ai' ? participatingAiTeamMembers : participatingHumanTeamMembers).map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-2 py-1.5"
                            data-testid={`chip-team-member-${teamMenuTab}-${m.id}`}
                            title={m.name}
                          >
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="h-6 w-6 rounded-full border border-border/60"
                              data-testid={`img-team-avatar-${teamMenuTab}-${m.id}`}
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-foreground truncate" data-testid={`text-team-name-${teamMenuTab}-${m.id}`}>{m.name}</div>
                              {m.role && (
                                <div className="text-[10px] text-muted-foreground" data-testid={`text-team-role-${teamMenuTab}-${m.id}`}>{m.role}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                className="h-9 px-3 rounded-lg shadow-md border border-border bg-background/85 hover:bg-background/95 backdrop-blur flex items-center gap-2"
                onClick={handleShare}
                data-testid="button-canvas-share"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Share</span>
              </Button>
            </div>

            <Controls 
                onScreenshot={handleScreenshotStart} 
                scale={currentScale}
                setScale={setCurrentScale}
            />
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
              <div 
                style={{ 
                  width: `${contentWidth}px`, 
                  height: `${contentHeight}px`,
                  position: 'relative',
                  transformOrigin: '0 0',
                  '--zoom-scale': '0.8' // Initial scale
                } as React.CSSProperties}
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
                </svg>

                {/* Cards Layer */}
                {canvasEvents.map((event, index) => {
                  const pos = positions.find(p => p.id === event.id);
                  if (!pos) return null;

                  const isGroupSummary = event.id.startsWith("group-");

                  const keyframeScale = 1;

                  const keyframePill = null;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "absolute z-10 cursor-grab active:cursor-grabbing draggable-card group"
                      )}
                      drag
                      dragMomentum={false}
                      dragElastic={0}
                      onDrag={(e, info) => handleDrag(event.id, info)}
                      onMouseEnter={() => setHoveredCardId(event.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      style={{
                        x: pos.x,
                        y: pos.y,
                        width: CARD_WIDTH * keyframeScale,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transformOrigin: 'top left'
                      }}
                    >

                      {/* Group Summary Card (collapsible) */}
                      {isGroupSummary ? (
                        <div className="w-full">
                          <Collapsible>
                            <div
                              className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
                              data-testid={`card-action-group-${event.id}`}
                            >
                              <div className="p-3 border-b border-border/50 flex items-center justify-between bg-muted/40">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                    <Sparkle className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-heading font-semibold text-sm truncate" data-testid={`text-action-group-title-${event.id}`}>Action Group</div>
                                    <div className="text-[11px] text-muted-foreground truncate" data-testid={`text-action-group-summary-${event.id}`}>{event.content}</div>
                                  </div>
                                </div>

                                <CollapsibleTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 rounded-lg"
                                    data-testid={`button-action-group-toggle-${event.id}`}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="text-xs font-semibold">Details</span>
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>

                              <div className="p-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Start</div>
                                    <div className="text-xs font-medium mt-1" data-testid={`text-action-group-start-${event.id}`}>{event.title || ""}</div>
                                  </div>
                                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">End</div>
                                    <div className="text-xs font-medium mt-1" data-testid={`text-action-group-end-${event.id}`}>{event.timestamp}</div>
                                  </div>
                                </div>
                              </div>

                              <CollapsibleContent>
                                <div className="px-4 pb-4">
                                  <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Collapsed steps</div>
                                    </div>
                                    <ol className="space-y-2">
                                      {(renderNodes.find(n => (n as any).kind === 'group' && (n as ActionGroup).id === event.id) as ActionGroup | undefined)?.steps.map((s, idx) => (
                                        <li
                                          key={s.id}
                                          className="text-xs text-muted-foreground flex items-start gap-2"
                                          data-testid={`row-action-group-step-${event.id}-${idx}`}
                                        >
                                          <span className="mt-0.5 text-[10px] font-mono text-muted-foreground/70">{idx + 1}.</span>
                                          <span className="min-w-0">
                                            <span className="text-foreground/80">{s.title || "(no title)"}</span>
                                            <span className="text-muted-foreground"> — {s.content}</span>
                                          </span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        </div>
                      ) : (
                        <div className="pointer-events-none">
                          <div className="pointer-events-auto">
                            {event.type === 'file' ? (
                              <FileCard
                                title={event.title || 'Unknown File'}
                                content={event.content}
                                fileType={event.fileType}
                                timestamp={event.timestamp}
                                isLast={true}
                                onMediaClick={() => handleMediaClick(event)}
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
                                onMediaClick={() => handleMediaClick(event)}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg z-20 border-2 border-background pointer-events-none" data-testid={`badge-step-index-${event.id}`}>
                        {index + 1}
                      </div>

                      {/* AI Chat Input - Appears on Hover */}
                      {!isGroupSummary && (
                        <AnimatePresence>
                          {hoveredCardId === event.id && (
                            <motion.div
                              key="chat-input-box"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 right-0 z-30 pointer-events-auto pt-4"
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <div className="bg-background/95 backdrop-blur shadow-xl border border-border rounded-xl p-2 flex gap-2 items-center w-full box-border">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0" data-testid={`img-ai-avatar-${event.id}`}>
                                  <Sparkles className="w-3 h-3 text-primary" />
                                </div>
                                <Input
                                  className="flex-1 h-8 text-xs border-0 bg-transparent focus-visible:ring-0 px-0 shadow-none placeholder:text-muted-foreground/70 min-w-0"
                                  placeholder="Ask AI about this step..."
                                  value={cardInputs[event.id] || ''}
                                  onChange={(e) => setCardInputs(prev => ({ ...prev, [event.id]: e.target.value }))}
                                  data-testid={`input-ask-ai-${event.id}`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      console.log('Ask AI:', cardInputs[event.id]);
                                      setCardInputs(prev => ({ ...prev, [event.id]: '' }));
                                    }
                                  }}
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 shrink-0 rounded-full hover:bg-primary/10 hover:text-primary"
                                  data-testid={`button-ask-ai-send-${event.id}`}
                                >
                                  <Send className="w-3 h-3" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </motion.div>
                  );
                })}

                {/* Super Floats Layer */}
                
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Super Floats Layer - Now Rendered Outside TransformWrapper for Screen-Space Positioning */}
      <AnimatePresence>
        {openFloats.map(floatId => {
            // We don't need cardPos for physics anymore, just data lookup
            const event = canvasEvents.find(e => e.id === floatId);
            if (!event) return null;
            
            // Calculate center of screen for default position
            // Since we are outside the transform, we use window/screen coordinates
            // Assuming a standard modal width of ~600px and some height
            const screenCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 - 300 : 400;
            const screenCenterY = typeof window !== 'undefined' ? window.innerHeight / 2 - 350 : 300;

            // Use stored position if available, else default to center
            const currentPos = floatPositions[floatId];
            const currentX = currentPos ? currentPos.x : screenCenterX;
            const currentY = currentPos ? currentPos.y : screenCenterY;

            return (
                <SuperFloat 
                    key={`float-${floatId}`}
                    cardId={floatId}
                    title={event.title || "Insight Document"}
                    content={event.content}
                    onClose={() => toggleFloat(floatId)}
                    position={{ x: currentX, y: currentY }}
                    isPinned={pinnedFloats.includes(floatId)}
                    onPinToggle={() => togglePin(floatId)}
                    onDrag={(delta) => {
                        // No scale correction needed for screen-space dragging
                        const newX = currentX + delta.x;
                        const newY = currentY + delta.y;
                        updateFloatPosition(floatId, { x: newX, y: newY });
                    }}
                />
            );
        })}
      </AnimatePresence>

      {/* Screenshot Overlay */}
      {isScreenshotMode && (
          <div 
            className="fixed inset-0 z-[9999] cursor-crosshair bg-black/30 screenshot-exclude"
            onMouseDown={handleScreenshotMouseDown}
            onMouseMove={handleScreenshotMouseMove}
            onMouseUp={handleScreenshotMouseUp}
          >
              {selectionBox && (
                  <div 
                    className="absolute border-2 border-primary bg-primary/20 backdrop-blur-[1px] screenshot-exclude"
                    style={{
                        left: Math.min(selectionBox.startX, selectionBox.currentX),
                        top: Math.min(selectionBox.startY, selectionBox.currentY),
                        width: Math.abs(selectionBox.currentX - selectionBox.startX),
                        height: Math.abs(selectionBox.currentY - selectionBox.startY),
                    }}
                  />
              )}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 text-foreground px-4 py-2 rounded-full shadow-lg border border-border text-sm font-medium pointer-events-none screenshot-exclude">
                  Drag to select area to capture
              </div>
          </div>
      )}

      {/* Media Preview Modal */}
      <MediaPreviewModal 
        isOpen={previewMedia.isOpen}
        onClose={() => setPreviewMedia(prev => ({ ...prev, isOpen: false }))}
        title={previewMedia.title}
        type={previewMedia.type}
        url={previewMedia.url}
        content={previewMedia.content}
      />
    </div>
  );
}
