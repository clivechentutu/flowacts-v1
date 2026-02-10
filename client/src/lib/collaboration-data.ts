import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isOnline: boolean;
  permission: "owner" | "can-edit" | "can-comment" | "can-view";
}

export const DEMO_MEMBERS: Member[] = [
  { id: "1", name: "Alice Chen", role: "Design Lead", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", isOnline: true, permission: "can-edit" },
  { id: "2", name: "Bo Zhang", role: "PM", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bo", isOnline: true, permission: "owner" },
  { id: "3", name: "Chris Li", role: "Research", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", isOnline: false, permission: "can-view" },
  { id: "4", name: "David Wang", role: "Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", isOnline: false, permission: "can-comment" },
  { id: "5", name: "Eva Green", role: "Marketing", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eva", isOnline: true, permission: "can-view" },
];

export const CURRENT_CANVAS_TITLE = "Competitive Analysis";
