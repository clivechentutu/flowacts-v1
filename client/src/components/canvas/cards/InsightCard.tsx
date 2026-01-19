import { CardBase } from "./CardBase";
import { Sparkles, Lightbulb } from "lucide-react";

interface InsightCardProps {
  title: string;
  content: string;
  timestamp: string;
  isLast?: boolean;
}

export function InsightCard({ title, content, timestamp, isLast }: InsightCardProps) {
  return (
    <CardBase isLast={isLast} className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
      <div className="p-5 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-heading font-bold text-indigo-950 text-sm uppercase tracking-wide">{title}</h4>
            <span className="text-xs text-indigo-300 font-mono">{timestamp}</span>
          </div>
          <p className="text-indigo-900/80 leading-relaxed text-sm">
            {content}
          </p>
        </div>
      </div>
    </CardBase>
  );
}
