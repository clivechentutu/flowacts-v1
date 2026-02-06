import { useRef, useState } from "react";
import { StoryEvent } from "@/lib/mock-data";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize, Crop, Users, Plus, Share2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageTabNav, ScreenshotCard, FlowConnector, SummaryCard, PageTab, Metric } from "./CanvasComponents";
import caseOnboardingImg from "@/assets/images/case-onboarding.jpg";
import casePricingImg from "@/assets/images/case-pricing.jpg";
import caseUxAuditImg from "@/assets/images/case-ux-audit.jpg";

interface FlowCanvasProps {
  events: StoryEvent[];
  droppedFiles?: StoryEvent[];
  onFileDrop?: (files: StoryEvent[]) => void;
  onFileDelete?: (id: string) => void;
}

export function FlowCanvas({ events, droppedFiles = [], onFileDrop, onFileDelete }: FlowCanvasProps) {
  const { toast } = useToast();
  const [activePageId, setActivePageId] = useState("p1");
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);

  // Mock Pages Data
  const demoPages: PageTab[] = [
    { id: "p1", icon: "🔍", title: "Signup Flow", completedSteps: 4, totalSteps: 5 },
    { id: "p2", icon: "💰", title: "Pricing Compare", completedSteps: 3, totalSteps: 5 },
    { id: "p3", icon: "📊", title: "Features Audit", completedSteps: 0, totalSteps: 5 },
  ];

  // Mock Cards Data
  const demoCards = [
    {
      step: "Step 1",
      title: "Homepage Landing",
      screenshot: caseOnboardingImg,
      metrics: [
        { status: "good", label: "Load 1.2s" },
        { status: "good", label: "CTA visible" }
      ] as Metric[]
    },
    {
      step: "Step 2",
      title: "Signup Selection",
      screenshot: casePricingImg,
      metrics: [
        { status: "warning", label: "7 fields" },
        { status: "issue", label: "No progress bar" }
      ] as Metric[]
    },
    {
      step: "Step 3",
      title: "Email Verification",
      screenshot: caseUxAuditImg,
      metrics: [
        { status: "issue", label: "8s delay" },
        { status: "warning", label: "No resend" }
      ] as Metric[]
    }
  ];

  const demoCardsRow2 = [
    {
        step: "Step 4",
        title: "Welcome Dashboard",
        screenshot: undefined, // Placeholder
        metrics: [
            { status: "good", label: "Clean layout" },
            { status: "good", label: "Fast render" }
        ] as Metric[]
    }
  ];

  const handlePageSwitch = (id: string) => {
    setActivePageId(id);
    toast({ title: "Switched Page", description: `Active page: ${demoPages.find(p => p.id === id)?.title}` });
  };

  const handleAddPage = () => {
    toast({ title: "New Page", description: "Created new blank page" });
  };

  // Zoom Controls Component
  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls(); // This hook must be used inside TransformWrapper context? No, TransformWrapper passes it down.
    // Wait, useControls is a hook from the library, it needs to be inside the provider.
    // We'll define it outside but render it inside.
    return null; // Defined inline below for simplicity with scope
  };

  return (
    <div className="h-full w-full bg-[#FDFBF7] dark:bg-background relative overflow-hidden flex flex-col">
      {/* 1. Page Tab Navigation (Top) */}
      <PageTabNav 
        pages={demoPages} 
        activePageId={activePageId} 
        onSwitch={handlePageSwitch} 
        onAdd={handleAddPage} 
      />

      {/* 2. Main Canvas Area (Zoomable) */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
            style={{
                backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
            }}
        />

        <TransformWrapper
          initialScale={0.85}
          minScale={0.2}
          maxScale={2}
          centerOnInit={true}
          limitToBounds={false}
          wheel={{ step: 0.1 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls */}
              <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur border border-border rounded-xl p-1.5 shadow-xl flex flex-col gap-1 z-50">
                <button onClick={() => zoomIn()} className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors" title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => zoomOut()} className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors" title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                </button>
                <button onClick={() => resetTransform()} className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors" title="Reset View">
                    <Maximize className="w-4 h-4" />
                </button>
                <div className="w-full h-px bg-border my-0.5" />
                <button className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors" title="Screenshot">
                    <Crop className="w-4 h-4" />
                </button>
              </div>

              {/* Team Button (Top Right) */}
              <div className="absolute top-6 right-6 z-50">
                <Button variant="outline" size="sm" className="gap-2 shadow-sm bg-background/80 backdrop-blur" onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}>
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                </Button>
              </div>

              {/* Transformable Content */}
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full !flex !items-center !justify-center">
                <div className="p-20 min-w-[1200px] flex flex-col items-center justify-center gap-8">
                    
                    {/* Row 1 */}
                    <div className="flex items-center">
                        {demoCards.map((card, index) => (
                            <div key={index} className="flex items-center">
                                <ScreenshotCard {...card} />
                                {/* Add connector after every card except the last one in this visual row if we were wrapping purely, 
                                    but here we manually connect to next row */}
                                {index < demoCards.length - 1 && <FlowConnector direction="horizontal" />}
                            </div>
                        ))}
                    </div>

                    {/* Vertical Connector between Row 1 and Row 2 */}
                    {/* Positioned relative to the last card of Row 1 and first of Row 2 */}
                    {/* For demo, let's just place it centrally or aligned to a specific card logic */}
                    <div className="w-full flex justify-start pl-[600px] -mt-4 -mb-4 z-0">
                         <FlowConnector direction="vertical" />
                    </div>

                    {/* Row 2 */}
                    <div className="flex items-center pl-[550px]">
                         {demoCardsRow2.map((card, index) => (
                            <div key={`r2-${index}`} className="flex items-center">
                                <ScreenshotCard {...card} />
                                <FlowConnector direction="horizontal" />
                            </div>
                        ))}
                        
                        {/* Summary Card */}
                        <SummaryCard 
                            totalPages={5}
                            totalIssues={3}
                            totalInsights={12}
                            findings={[
                                { type: 'warning', text: '7 form fields on signup' },
                                { type: 'issue', text: '8s email verification delay' },
                                { type: 'good', text: 'Clean visual design' }
                            ]}
                        />
                    </div>

                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}
