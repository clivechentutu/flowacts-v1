import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Copy, EyeOff, Trash2, Wand2, Eye } from "lucide-react";

interface CardBaseProps {
  children: ReactNode;
  className?: string;
  isLast?: boolean;
}

export function CardBase({ children, className, isLast }: CardBaseProps) {
  return (
    <div className="relative flex flex-col items-center gap-6 group h-full justify-center w-full">
      <ContextMenu>
        <ContextMenuTrigger className="w-full h-full cursor-context-menu">
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
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-48">
          <ContextMenuItem className="gap-2">
            <Wand2 className="w-4 h-4" />
            <span>Smart Copy</span>
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem className="gap-2">
            <EyeOff className="w-4 h-4" />
            <span>Hide Card</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="gap-2 text-destructive focus:text-destructive">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
