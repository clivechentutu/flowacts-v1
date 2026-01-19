import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardBaseProps {
  children: ReactNode;
  className?: string;
  isLast?: boolean;
}

export function CardBase({ children, className, isLast }: CardBaseProps) {
  return (
    <div className="relative flex gap-6 pb-12 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[26px] top-12 bottom-0 w-0.5 bg-border group-hover:bg-primary/20 transition-colors duration-300" />
      )}

      {/* Timeline Dot */}
      <div className="relative z-10 flex-shrink-0 mt-4">
        <div className="w-[52px] h-[52px] rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-current" />
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex-1 bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-border",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
