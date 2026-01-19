import { CardBase } from "./CardBase";
import { AlertTriangle } from "lucide-react";

interface AlertCardProps {
  title: string;
  content: string;
  timestamp: string;
  isLast?: boolean;
}

export function AlertCard({ title, content, timestamp, isLast }: AlertCardProps) {
  return (
    <CardBase isLast={isLast} className="border-amber-200 bg-amber-50/30 min-w-[280px]">
      <div className="p-5 flex flex-col gap-3 h-full justify-center">
        <div className="flex items-center justify-between mb-1">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-amber-400 font-mono">{timestamp}</span>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-amber-900 text-xs uppercase tracking-wide">{title}</h4>
          <p className="text-amber-800 leading-relaxed text-sm font-medium">
            {content}
          </p>
        </div>
      </div>
    </CardBase>
  );
}
