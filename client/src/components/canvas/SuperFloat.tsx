import { motion } from "framer-motion";
import { X, Sparkles, Copy, Download, Share2, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SuperFloatProps {
  cardId: string;
  title: string;
  content: string; // Markdown mock content
  onClose: () => void;
  position: { x: number; y: number };
  isFlipped?: boolean; // If true, render to the left of the card
}

export function SuperFloat({ cardId, title, content, onClose, position, isFlipped = false }: SuperFloatProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    toast({
      title: "Copied to clipboard",
      description: "Insight content copied successfully.",
    });
  };

  const handleDownload = (format: string) => {
    toast({
      title: "Download Started",
      description: `Downloading insight as ${format}...`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: "Public link copied to clipboard.",
    });
  };

  return (
    <div
      className={cn(
        "absolute z-[1000] flex items-center pointer-events-none", // Container handles layout
        isFlipped ? "flex-row-reverse" : "flex-row"
      )}
      style={{
        left: position.x,
        top: position.y,
        // If flipped, we need to adjust position in parent, but here we assume position is the anchor point on the card
        // Actually, let's handle positioning in the parent to be cleaner, 
        // passing 'x' and 'y' as the top-left of this component container.
        // Wait, spec says "Tethered to parent card".
        // Let's assume 'position' is the top-left of the FLOAT itself.
      }}
    >
        {/* The Float Component */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto w-[600px] max-h-[800px] flex flex-col bg-[#141416]/95 dark:bg-[#141416]/95 bg-white/95 backdrop-blur-xl border border-white/10 dark:border-white/10 border-border/50 shadow-2xl rounded-xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-white/10 border-border/10 shrink-0">
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span className="font-heading font-semibold text-lg text-foreground">AI Insight Document</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleCopy} title="Copy">
                        <Copy className="w-4 h-4" />
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Download">
                                <Download className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload("PNG (Insight Only)")}>
                                Save as Image (.png)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload("PNG (Card + Insight)")}>
                                Save Card + Insight (.png)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload("PDF")}>
                                Export as PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleShare} title="Share">
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-5 bg-border/20 mx-2" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive" onClick={onClose} title="Close">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1 max-h-[700px]">
                <div className="p-8 space-y-6 text-base text-muted-foreground leading-relaxed font-serif-reading">
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-4">{title}</h1>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
                        <p className="first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                            Based on the comprehensive analysis of <strong>{title}</strong>, we have identified several critical interaction patterns that significantly influence user engagement and conversion metrics.
                        </p>
                        
                        <p>
                            This document serves as a detailed breakdown of the behavioral signals observed during the user journey simulation. By examining the micro-interactions at this specific step, we can infer user intent with a higher degree of confidence.
                        </p>

                        <div className="my-8 p-6 bg-card border border-border/50 rounded-xl shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-border/30 pb-2">Performance Metrics</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Conversion Uplift</span>
                                    <p className="text-3xl font-mono text-primary font-medium mt-1">+12.5%</p>
                                    <p className="text-xs text-muted-foreground mt-1">Compared to baseline</p>
                                </div>
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Friction Index</span>
                                    <p className="text-3xl font-mono text-green-500 font-medium mt-1">-4.2%</p>
                                    <p className="text-xs text-muted-foreground mt-1">Drop-off reduction</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Core Principles Applied</h3>
                        <p>
                            The implementation of this step aligns with the <em>"Progressive Disclosure"</em> principle, effectively reducing cognitive load for new users. This approach ensures that users are not overwhelmed by options but are instead guided through a logical sequence of actions.
                        </p>
                        
                        <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                            <li><strong>Clear Call-to-Action:</strong> The primary action button is positioned prominently, utilizing high-contrast colors to draw attention without being intrusive.</li>
                            <li><strong>Contextual Guidance:</strong> Help tooltips are available on demand, appearing only when the user hovers over complex fields, maintaining a clean interface.</li>
                            <li><strong>Streamlined Input:</strong> Data entry fields have been consolidated, and smart defaults are used to minimize typing effort.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Strategic Recommendations</h3>
                        <p>
                            To further optimize this interaction, we recommend conducting an A/B test focusing on the placement of secondary action buttons. Moving the "Cancel" option to a less prominent location may reduce accidental exits.
                        </p>
                        
                        <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-6">
                            "Micro-interactions are the secret ingredient that transforms a good product into a great one."
                        </blockquote>
                        
                        <p>
                             Continue monitoring the session replay data for any anomalies in user behavior, particularly on mobile devices where touch targets may need adjustment.
                        </p>
                    </div>
                </div>
            </ScrollArea>


            {/* Footer - Removed Regenerate, kept simplified actions if needed or just remove completely */}
             {/* Use empty footer or just padding if strictly document reader style */}
             <div className="p-4 border-t border-white/10 dark:border-white/10 border-border/10 shrink-0 bg-muted/10">
                 <p className="text-xs text-muted-foreground italic text-center">
                    AI-generated insight based on user flow analysis • Confidential
                 </p>
             </div>
        </motion.div>
    </div>
  );
}
