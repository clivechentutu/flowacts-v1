import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

  const displayText =
    selectedNodes.length <= 2
      ? selectedNodes.map((n) => n.label).join(", ")
      : `${selectedNodes[0].label} and ${selectedNodes.length - 1} more`;

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
          bg-white/[0.04] text-muted-foreground text-xs
        "
      >
        <span className="truncate">
          <span className="text-muted-foreground/60 mr-1.5">Selected:</span>
          {displayText}
        </span>
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
