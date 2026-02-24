import { Project } from "@/types/project";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Competitor Analysis - Q3 Report",
    updatedAt: "2024-03-20T10:00:00Z",
    status: "active",
    isPinned: true,
    isFavorite: true,
    contextSummary: "stripe.com · notion.so +2",
    containerStatus: {
      overall: "new_changes",
      count: 1,
      newChangesCount: 3,
      lastCheckedAt: "2024-03-20T08:00:00Z"
    },
    canvasCount: 4
  },
  {
    id: "p2",
    name: "SaaS Pricing Trends Research",
    updatedAt: "2024-03-19T15:30:00Z",
    status: "active",
    isPinned: true,
    isFavorite: false,
    contextSummary: "AI conversation · 12 messages",
    containerStatus: null,
    canvasCount: 2
  },
  {
    id: "p3",
    name: "New Product Launch Marketing Strategy",
    updatedAt: "2024-03-18T09:15:00Z",
    status: "active",
    isPinned: false,
    isFavorite: true,
    contextSummary: "Q3-report.pdf · 3 screenshots",
    containerStatus: {
      overall: "running",
      count: 1,
      lastCheckedAt: "2024-03-20T09:45:00Z"
    },
    canvasCount: 5
  },
  {
    id: "p4",
    name: "User Interview Notes - Batch 2",
    updatedAt: "2024-03-15T14:20:00Z",
    status: "active",
    isPinned: false,
    isFavorite: false,
    contextSummary: "Document analysis",
    containerStatus: null,
    canvasCount: 1
  },
  {
    id: "p5",
    name: "Website Redesign Feedback Collection",
    updatedAt: "2024-03-10T11:00:00Z",
    status: "completed",
    completedAt: "2024-03-10T11:00:00Z",
    isPinned: false,
    isFavorite: false,
    contextSummary: "Figma prototype · user-testing.com",
    containerStatus: null,
    canvasCount: 3
  },
  {
    id: "p6",
    name: "Q4 Budget Planning",
    updatedAt: "2023-12-20T16:45:00Z",
    status: "archived",
    isPinned: false,
    isFavorite: false,
    contextSummary: "Spreadsheet analysis",
    containerStatus: null,
    canvasCount: 2
  }
];
