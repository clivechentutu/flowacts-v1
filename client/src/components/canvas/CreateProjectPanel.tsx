import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

export function CreateProjectPanel({
  isOpen,
  onOpenChange,
  onCreate
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, context: string) => void;
}) {
  const [projectName, setProjectName] = useState("");
  const [contextInput, setContextInput] = useState("");

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreate(projectName.trim(), contextInput.trim());
      setProjectName("");
      setContextInput("");
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[440px]">
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Project name — required */}
          <div>
            <label className="text-sm font-medium text-foreground">Project name *</label>
            <input
              type="text"
              placeholder="e.g. Q4 Product Review"
              className="mt-1.5 w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Context — optional */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Add a URL or description
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="URL, topic, or brief context"
              className="mt-1.5 w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCreate}
              disabled={!projectName.trim()}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Project
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Template link */}
          <div className="pt-4 border-t border-border mt-8">
            <p className="text-xs text-muted-foreground text-center mb-3">or start from a template</p>
            <button
              onClick={() => {}}
              className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Browse Templates →
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
