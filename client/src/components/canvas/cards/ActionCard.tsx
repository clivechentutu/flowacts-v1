import { CardBase } from "./CardBase";
import { Badge } from "@/components/ui/badge";
import { MousePointerClick, Clock, Globe } from "lucide-react";

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
    <CardBase isLast={isLast}>
      <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Action
          </Badge>
          <span className="font-heading font-semibold text-sm text-foreground">{title}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{timestamp}</span>
      </div>
      
      <div className="p-0">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted group-hover:brightness-105 transition-all">
          <img src={image} alt={title} className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105" />
          
          {/* Overlay info on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
             <button className="bg-white text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-xl transform scale-95 hover:scale-100 transition-all">
                View Full Replay
             </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{content}</p>
        
        {metadata && (
          <div className="flex gap-4 mt-2 pt-3 border-t border-border/50">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardBase>
  );
}
