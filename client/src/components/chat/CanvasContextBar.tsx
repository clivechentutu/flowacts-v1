import { motion, AnimatePresence } from "framer-motion";
import { X, Layers } from "lucide-react";

interface SelectedNode {
  id: string;
  label: string;
}

interface CanvasContextBarProps {
  selectedNodes: SelectedNode[];
  onClear: () => void;
}

export function CanvasContextBar({ selectedNodes, onClear }: CanvasContextBarProps) {
  if (selectedNodes.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className="
          flex items-center justify-between
          px-3 py-1.5 mb-1.5 rounded-lg
          bg-white/[0.04] text-xs
        "
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-muted-foreground/50 shrink-0 flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            <span>Selected:</span>
          </span>
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mask-gradient-r">
            {selectedNodes.map((node) => (
              <div 
                key={node.id}
                className="
                  flex items-center whitespace-nowrap
                  bg-orange-500/10 border border-orange-500/20
                  rounded px-1.5 py-0.5 text-xs text-orange-200/90
                  shadow-sm
                "
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClear}
          className="ml-2 p-0.5 rounded hover:bg-white/[0.06] text-muted-foreground/40 hover:text-muted-foreground transition-colors flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
