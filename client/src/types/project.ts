export interface Project {
  id: string;
  name: string;
  updatedAt: string;
  completedAt?: string;
  
  // Lifecycle status
  status: "active" | "completed" | "archived";

  // Pin and favorite
  isPinned: boolean;
  isFavorite: boolean;

  // Context summary (auto-generated, used for card display)
  contextSummary?: string;

  // Container/monitoring status
  containerStatus?: {
    overall: "new_changes" | "failed" | "running" | "paused";
    count: number;
    newChangesCount?: number;
    lastCheckedAt?: string;
  } | null;

  // Canvas count
  canvasCount: number;
}
