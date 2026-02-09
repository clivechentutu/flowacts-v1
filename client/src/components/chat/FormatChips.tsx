import { motion, AnimatePresence } from "framer-motion";
import { FileText, Table, Brain, ListTodo, ScrollText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormatChip {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const FORMAT_CHIPS: FormatChip[] = [
  { id: "report", label: "Report", icon: <FileText className="w-4 h-4" /> },
  { id: "table", label: "Table", icon: <Table className="w-4 h-4" /> },
  { id: "mindmap", label: "Mind Map", icon: <Brain className="w-4 h-4" /> },
  { id: "checklist", label: "List", icon: <ListTodo className="w-4 h-4" /> },
  { id: "summary", label: "Brief", icon: <ScrollText className="w-4 h-4" /> },
];

interface FormatChipsProps {
  selectedFormats: string[];
  onToggleFormat: (id: string) => void;
  visible: boolean;
}

export function FormatChips({
  selectedFormats,
  onToggleFormat,
  visible,
}: FormatChipsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-1">
            <TooltipProvider delayDuration={300}>
              {FORMAT_CHIPS.map((chip) => {
                const isSelected = selectedFormats.includes(chip.id);
                return (
                  <Tooltip key={chip.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onToggleFormat(chip.id)}
                        className={`
                          inline-flex items-center justify-center
                          p-2 rounded-md
                          transition-all duration-100 cursor-pointer
                          ${
                            isSelected
                              ? "bg-white/[0.08] text-foreground"
                              : "bg-transparent text-muted-foreground/70 hover:bg-white/[0.05] hover:text-muted-foreground"
                          }
                        `}
                      >
                        {chip.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {chip.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
