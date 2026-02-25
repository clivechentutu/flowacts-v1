import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onCreate }: CreateProjectDialogProps) {
  const [newProjectName, setNewProjectName] = useState("");

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreate(newProjectName.trim());
      setNewProjectName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setNewProjectName("");
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Project name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateProject();
              }}
              placeholder="e.g. Competitor Analysis"
              className="w-full px-3 py-2 text-sm rounded-md
                         bg-muted/50 border border-border text-foreground
                         placeholder:text-muted-foreground/50
                         focus:outline-none focus:ring-1 focus:ring-primary/50"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={() => {
              onOpenChange(false);
              setNewProjectName("");
            }}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground
                       rounded-md hover:bg-primary/90 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
