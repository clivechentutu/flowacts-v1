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
    <div className="relative flex flex-col items-center gap-6 pr-12 group h-full justify-center min-w-[320px] max-w-[320px]">
      {/* Timeline Line (Horizontal) */}
      {!isLast && (
        <div className="absolute top-[50%] left-[50%] right-[-50%] h-0.5 bg-border group-hover:bg-primary/20 transition-colors duration-300 -z-10" />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border/80",
          className
        )}
      >
        {children}
      </motion.div>

      {/* Timeline Dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-white border-2 border-border shadow-sm flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-125 group-hover:border-primary">
          <div className="w-2 h-2 rounded-full bg-current" />
        </div>
      </div>
    </div>
  );
}
