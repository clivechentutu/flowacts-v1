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
            className="pointer-events-auto w-[400px] max-h-[600px] flex flex-col bg-[#141416]/95 dark:bg-[#141416]/95 bg-white/95 backdrop-blur-xl border border-white/10 dark:border-white/10 border-border/50 shadow-2xl rounded-xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 dark:border-white/10 border-border/10 shrink-0">
                <div className="flex items-center gap-2 text-blue-500">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="font-semibold text-sm text-foreground">AI Insight</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCopy} title="Copy">
                        <Copy className="w-3.5 h-3.5" />
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Download">
                                <Download className="w-3.5 h-3.5" />
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

                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleShare} title="Share">
                        <Share2 className="w-3.5 h-3.5" />
                    </Button>
                    <div className="w-px h-4 bg-border/20 mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onClose} title="Close">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1 max-h-[500px]">
                <div className="p-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <h3 className="text-foreground font-semibold text-base">{title}</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>
                            Based on the analysis of <strong>{title}</strong>, we've identified several key interaction patterns that drive user engagement.
                        </p>
                        
                        <div className="my-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Key Metrics</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-muted-foreground">Conversion Rate</span>
                                    <p className="text-lg font-mono text-primary font-medium">+12.5%</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground">Drop-off</span>
                                    <p className="text-lg font-mono text-green-500 font-medium">-4.2%</p>
                                </div>
                            </div>
                        </div>

                        <p>
                            The implementation of this step aligns with the "Progressive Disclosure" principle, reducing cognitive load for new users.
                        </p>
                        
                        <ul className="list-disc pl-4 space-y-1 mt-2">
                            <li>Clear call-to-action visibility</li>
                            <li>Contextual help availability</li>
                            <li>Streamlined data entry fields</li>
                        </ul>

                        <p className="mt-4">
                            <strong>Recommendation:</strong> Consider A/B testing the button placement to further optimize click-through rates.
                        </p>
                    </div>
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 dark:border-white/10 border-border/10 shrink-0 bg-muted/20 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5">
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Regenerate
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Ask Follow-up
                </Button>
            </div>
        </motion.div>
    </div>
  );
}
