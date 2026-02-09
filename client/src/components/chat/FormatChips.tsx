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
  { id: "checklist", label: "List", icon: "✅" },
  { id: "summary", label: "Brief", icon: "📝" },
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
            {FORMAT_CHIPS.map((chip) => {
              const isSelected = selectedFormats.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => onToggleFormat(chip.id)}
                  className={`
                    inline-flex items-center gap-1.5
                    text-sm px-3 py-1.5 rounded-md
                    transition-all duration-100 cursor-pointer
                    ${
                      isSelected
                        ? "bg-white/[0.08] text-foreground"
                        : "bg-transparent text-muted-foreground/70 hover:bg-white/[0.05] hover:text-muted-foreground"
                    }
                  `}
                >
                  <span className="text-sm leading-none">{chip.icon}</span>
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
