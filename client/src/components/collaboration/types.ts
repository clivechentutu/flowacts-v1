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
  { id: "1", name: "Alice Chen", role: "Design Lead", avatarUrl: "https://i.pravatar.cc/150?u=1", isOnline: true, permission: "can-edit" },
  { id: "2", name: "Bo Zhang", role: "PM", avatarUrl: "https://i.pravatar.cc/150?u=2", isOnline: true, permission: "owner" },
  { id: "3", name: "Chris Li", role: "Research", avatarUrl: "https://i.pravatar.cc/150?u=3", isOnline: false, permission: "can-view" },
  { id: "4", name: "David Wang", role: "Developer", avatarUrl: "https://i.pravatar.cc/150?u=4", isOnline: false, permission: "can-comment" },
  { id: "5", name: "Eva Green", role: "Marketing", avatarUrl: "https://i.pravatar.cc/150?u=5", isOnline: true, permission: "can-view" },
];
