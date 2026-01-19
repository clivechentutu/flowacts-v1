import { CardBase } from "./CardBase";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  content: string;
  timestamp: string;
  isLast?: boolean;
}

export function InsightCard({ title, content, timestamp, isLast }: InsightCardProps) {
  return (
    <CardBase isLast={isLast} className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 min-w-[280px]">
      <div className="p-5 flex flex-col gap-3 h-full justify-center">
        <div className="flex items-center justify-between mb-1">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-indigo-300 font-mono">{timestamp}</span>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-indigo-950 text-xs uppercase tracking-wide">{title}</h4>
          <p className="text-indigo-900/80 leading-relaxed text-sm font-medium">
            {content}
          </p>
        </div>
      </div>
    </CardBase>
  );
}
