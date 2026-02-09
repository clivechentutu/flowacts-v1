import { motion, AnimatePresence } from "framer-motion";

interface FormatChip {
  id: string;
  label: string;
  icon: string;
}

const FORMAT_CHIPS: FormatChip[] = [
  { id: "report", label: "Report", icon: "📄" },
  { id: "table", label: "Table", icon: "📊" },
  { id: "mindmap", label: "Mind Map", icon: "🧠" },
  { id: "checklist", label: "Checklist", icon: "✅" },
  { id: "summary", label: "Summary", icon: "📝" },
];

interface FormatChipsProps {
  selectedFormats: string[];
  onToggleFormat: (id: string) => void;
  visible: boolean; // controlled by parent based on taskState
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
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 border-b border-border/30">
            {FORMAT_CHIPS.map((chip) => {
              const isSelected = selectedFormats.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => onToggleFormat(chip.id)}
                  className={`
                    inline-flex items-center gap-1.5
                    text-sm px-3.5 py-2 rounded-lg
                    transition-all duration-150 cursor-pointer
                    ${
                      isSelected
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-white/[0.06] text-muted-foreground border border-transparent hover:bg-white/[0.10] hover:text-foreground"
                    }
                  `}
                >
                  <span className="text-base leading-none">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
