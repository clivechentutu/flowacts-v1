import React from 'react';
import { format } from 'date-fns';
import { Settings as SettingsIcon } from 'lucide-react';

export type ContainerStatus = 'running' | 'paused' | 'error';

export interface ActiveContainerInfo {
  status: ContainerStatus;
  frequency: string;
  lastRunAt: string;
  nextRunAt: string;
  lastSummary: string;
  errorMessage?: string;
}

const statusStyles: Record<ContainerStatus, {
  barColor: string;
  dotColor: string;
  label: string;
  labelColor: string;
}> = {
  running: {
    barColor: 'bg-green-500',
    dotColor: 'bg-green-500',
    label: 'Running',
    labelColor: 'text-green-400',
  },
  paused: {
    barColor: 'bg-muted-foreground/40',
    dotColor: 'bg-muted-foreground/40',
    label: 'Paused',
    labelColor: 'text-muted-foreground',
  },
  error: {
    barColor: 'bg-red-500',
    dotColor: 'bg-red-500',
    label: 'Error',
    labelColor: 'text-red-400',
  },
};

function formatDateTime(dateStr: string) {
  return format(new Date(dateStr), 'MMM d, h:mm a');
}

function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'MMM d');
}

export function ActiveContainerStatusBar({
  container,
  onPause,
  onResume,
  onRunNow,
  onRetry,
  onOpenSettings,
}: {
  container: ActiveContainerInfo;
  onPause: () => void;
  onResume: () => void;
  onRunNow: () => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}) {
  const style = statusStyles[container.status];

  return (
    <div
      className="relative rounded-lg border border-border bg-card overflow-hidden mb-6"
      title={container.status === 'running'
        ? `Next run: ${formatDateTime(container.nextRunAt)}`
        : undefined}
    >
      {/* 左侧色条 */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${style.barColor}`} />

      <div className="px-4 py-3 pl-5">
        {/* 第一行：状态 + 频率 + 上次执行 + 操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${style.dotColor} ${
              container.status === 'running' ? 'animate-pulse' : ''
            }`} />
            <span className={`font-medium ${style.labelColor}`}>
              {style.label}
            </span>
            {container.status !== 'error' && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground/60">{container.frequency}</span>
              </>
            )}
            <span className="text-muted-foreground/40">·</span>
            <span className="text-muted-foreground/60">
              {container.status === 'error'
                ? `Last attempt failed: ${formatDate(container.lastRunAt)}`
                : `Last: ${formatDate(container.lastRunAt)}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {container.status === 'running' && (
              <>
                <button onClick={onPause}
                  className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors">
                  Pause
                </button>
                <button onClick={onRunNow}
                  className="px-2.5 py-1 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-md transition-colors">
                  Run Now
                </button>
              </>
            )}
            {container.status === 'paused' && (
              <>
                <button onClick={onResume}
                  className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors">
                  Resume
                </button>
                <button onClick={onRunNow}
                  className="px-2.5 py-1 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded-md transition-colors">
                  Run Now
                </button>
              </>
            )}
            {container.status === 'error' && (
              <button onClick={onRetry}
                className="px-2.5 py-1 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-md transition-colors">
                Retry
              </button>
            )}
            
            <button
              onClick={onOpenSettings}
              className="p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded"
              title="Container settings"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 第二行：变化摘要 */}
        <p className={`text-sm mt-1.5 ${
          container.status === 'paused'
            ? 'text-muted-foreground/40'
            : 'text-muted-foreground'
        }`}>
          {container.status === 'error'
            ? container.errorMessage
            : `"${container.lastSummary}"`}
        </p>
      </div>
    </div>
  );
}
