import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ContainerSettings {
  frequency: string;
  estimatedTokensPerRun: number;
  monitoringTargets: string[];
}

const frequencyOptions = [
  { value: 'daily', label: 'Every day' },
  { value: 'every_3_days', label: 'Every 3 days' },
  { value: 'weekly', label: 'Every week' },
  { value: 'biweekly', label: 'Every 2 weeks' },
];

function getRunsPerMonth(frequency: string): number {
  const map: Record<string, number> = {
    daily: 30, every_3_days: 10, weekly: 4, biweekly: 2,
  };
  return map[frequency] ?? 10;
}

export function ContainerSettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdateFrequency,
  onStopContainer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ContainerSettings;
  onUpdateFrequency: (frequency: string) => void;
  onStopContainer: () => void;
}) {
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const monthlyEstimate = Math.round(
    settings.estimatedTokensPerRun * getRunsPerMonth(settings.frequency)
  );

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setShowStopConfirm(false);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Container Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* 频率 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground
                              uppercase tracking-wide mb-1.5 block">
              Frequency
            </label>
            <select
              value={settings.frequency}
              onChange={(e) => onUpdateFrequency(e.target.value)}
              className="w-full rounded-md border border-border bg-card
                         px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {frequencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 成本预估 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground
                              uppercase tracking-wide mb-1.5 block">
              Estimated Cost
            </label>
            <p className="text-sm text-foreground">
              ~{settings.estimatedTokensPerRun} tokens per run
              <span className="text-muted-foreground/60">
                {' '}· ~{monthlyEstimate} tokens/month
              </span>
            </p>
          </div>

          {/* 监控目标（只读） */}
          <div>
            <label className="text-xs font-medium text-muted-foreground
                              uppercase tracking-wide mb-1.5 block">
              Monitoring Targets
            </label>
            <div className="space-y-1">
              {settings.monitoringTargets.map((url, i) => (
                <p key={i} className="text-sm text-foreground truncate">{url}</p>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Configured in AIChat
            </p>
          </div>

          {/* 停止容器（两步确认） */}
          <div className="border-t border-border pt-4">
            {!showStopConfirm ? (
              <button
                onClick={() => setShowStopConfirm(true)}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Stop Monitoring
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  This will permanently stop the container.
                  You can create a new one from AIChat.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onStopContainer(); onOpenChange(false); }}
                    className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400
                               hover:bg-red-500/30 rounded-md transition-colors font-medium">
                    Confirm Stop
                  </button>
                  <button
                    onClick={() => setShowStopConfirm(false)}
                    className="px-3 py-1.5 text-xs text-muted-foreground
                               hover:text-foreground border border-border
                               rounded-md transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
