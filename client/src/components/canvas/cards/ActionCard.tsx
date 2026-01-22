import { CardBase } from "./CardBase";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, Sparkles } from "lucide-react";

interface ActionCardProps {
  title: string;
  content: string;
  image: string;
  timestamp: string;
  metadata?: Record<string, string>;
  isLast?: boolean;
}

export function ActionCard({ title, content, image, timestamp, metadata, isLast }: ActionCardProps) {
  return (
    <CardBase isLast={isLast} className="min-w-[360px] max-w-[360px] flex flex-col h-full bg-card border-border">
      <div className="p-3 border-b border-border/50 flex justify-between items-center bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background text-[10px] h-5 px-1.5 font-mono text-muted-foreground uppercase tracking-wider border-border">
            Action
          </Badge>
          <span className="font-heading font-semibold text-sm text-card-foreground truncate max-w-[180px]">{title}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{timestamp}</span>
      </div>
      
      <div className="p-0 flex-shrink-0">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted group cursor-zoom-in">
          <img src={image} alt={title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
             <div className="bg-background/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-lg">
                <ZoomIn className="w-4 h-4 text-foreground" />
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{content}</p>
        
        {metadata && (
          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md border border-border/50">
                <span className="font-medium text-foreground">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insight Section - Adaptive Colors */}
      <div 
        className="bg-primary/5 border-t border-primary/10 p-3 flex gap-3 mt-auto cursor-pointer hover:bg-primary/10 transition-colors group/insight"
        role="button"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 group-hover/insight:bg-primary group-hover/insight:text-primary-foreground transition-colors">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Insight</span>
           <p className="text-xs text-muted-foreground leading-relaxed">
             Analyzing this step reveals typical user behavior patterns aligning with successful conversion paths.
           </p>
        </div>
      </div>
    </CardBase>
  );
}
