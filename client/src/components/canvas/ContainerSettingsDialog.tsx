import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ContainerSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frequency: string;
  onStopMonitoring: () => void;
}

export function ContainerSettingsDialog({
  open,
  onOpenChange,
  frequency: initialFrequency,
  onStopMonitoring,
}: ContainerSettingsDialogProps) {
  const [frequency, setFrequency] = useState(initialFrequency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Container Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Frequency</h4>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-full bg-muted/50 border-border">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Every day">Every day</SelectItem>
                <SelectItem value="Every 3 days">Every 3 days</SelectItem>
                <SelectItem value="Every week">Every week</SelectItem>
                <SelectItem value="Manual only">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Estimated Cost</h4>
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-border/50">
              ~50 tokens per run · ~500 tokens/month
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              Monitoring Target
            </h4>
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-border/50 space-y-1">
              <p>competitor-a.com/pricing</p>
              <p>competitor-b.com/features</p>
              <p className="text-xs text-muted-foreground/60 italic pt-1 mt-2 border-t border-border/50">
                (Configured in AIChat)
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 flex justify-between items-center">
          <Button 
            variant="destructive" 
            className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive border-0"
            onClick={() => {
              onStopMonitoring();
              onOpenChange(false);
            }}
          >
            Stop Monitoring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
