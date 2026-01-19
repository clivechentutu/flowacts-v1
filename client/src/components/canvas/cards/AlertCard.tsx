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
    <CardBase isLast={isLast} className="border-amber-200 bg-amber-50/30">
      <div className="p-5 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-heading font-bold text-amber-900 text-sm uppercase tracking-wide">{title}</h4>
            <span className="text-xs text-amber-400 font-mono">{timestamp}</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-sm">
            {content}
          </p>
        </div>
      </div>
    </CardBase>
  );
}
