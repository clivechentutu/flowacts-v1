import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ContainerSettings {
  frequency: string;
  estimatedTokensPerRun: number;
  taskSources: string[];
}

const frequencyOptions = [
  { value: 'daily', label: 'Every day' },
  { value: 'every_3_days', label: 'Every 3 days' },
  { value: 'weekly', label: 'Every week' },
  { value: 'biweekly', label: 'Every 2 weeks' },
];

export function getRunsPerMonth(frequency: string): number {
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
  const runsPerMonth = getRunsPerMonth(settings.frequency);
  const monthlyTokens = settings.estimatedTokensPerRun * runsPerMonth;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-base font-semibold">
          Container Settings
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* 区块 1: Schedule */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Schedule
          </label>
          <div className="flex items-center justify-between gap-4">
            <select
              value={settings.frequency}
              onChange={(e) => onUpdateFrequency(e.target.value)}
              className="flex-1 rounded-md border border-border bg-card
                         px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {frequencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
              ~{settings.estimatedTokensPerRun.toLocaleString()} tokens/run
            </span>
          </div>
          <p className="text-xs text-muted-foreground/40">
            Est. ~{monthlyTokens.toLocaleString()} tokens/month
          </p>
        </div>

        {/* 区块 2: Task Scope */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Task Scope
          </label>
          <div className="space-y-1">
            {settings.taskSources.map((url, i) => (
              <p key={i} className="text-sm text-foreground truncate">
                {url}
              </p>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/50 mt-2">
            Configured in AIChat →
          </p>
        </div>

        {/* 分隔线 + 停止容器 */}
        <div className="border-t border-border pt-4">
          {!showStopConfirm ? (
            <button
              onClick={() => setShowStopConfirm(true)}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Stop Container
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
  );
}
