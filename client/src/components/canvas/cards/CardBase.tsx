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
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
