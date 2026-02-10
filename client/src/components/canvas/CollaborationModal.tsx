import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { Member, DEMO_MEMBERS, CURRENT_CANVAS_TITLE } from "@/lib/collaboration-data";
import { cn } from "@/lib/utils";

interface CollaborationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollaborationModal({ isOpen, onOpenChange }: CollaborationModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState("can-comment");
  const [isSending, setIsSending] = useState(false);
  const [members, setMembers] = useState<Member[]>(DEMO_MEMBERS);

  const handleSendInvite = () => {
    if (!inviteEmail) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setInviteEmail("");
      // In a real app, this would add the user or send an email
    }, 1000);
  };

  const handlePermissionChange = (memberId: string, newPermission: Member["permission"]) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, permission: newPermission } : m));
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const PERMISSION_LABELS = {
    "owner": "Owner",
    "can-edit": "Can edit",
    "can-comment": "Can comment",
    "can-view": "Can view"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <div className="px-6 py-4 border-b">
            <DialogTitle className="text-lg font-semibold">
            Collaborate on "{CURRENT_CANVAS_TITLE}"
            </DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          {/* Invite People Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Invite people</h4>
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Enter email or name..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 h-9 text-sm"
                />
                <Select value={invitePermission} onValueChange={setInvitePermission}>
                  <SelectTrigger className="w-[110px] h-9 text-xs bg-muted/50 border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="can-edit">Can edit</SelectItem>
                    <SelectItem value="can-comment">Can comment</SelectItem>
                    <SelectItem value="can-view">Can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSendInvite} 
                disabled={!inviteEmail || isSending}
                size="sm"
                className="h-9"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
              </Button>
            </div>
          </div>

          {/* People with Access Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">People with access</h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {/* Current User (Mock) */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={DEMO_MEMBERS[1].avatarUrl} />
                        <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-none">You (Owner)</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{DEMO_MEMBERS[1].role}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium px-2 py-1">
                    Owner
                </div>
              </div>

              {/* Other Members */}
              {members.filter(m => m.id !== "2").map(member => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
                        member.isOnline ? "bg-green-500" : "bg-zinc-300"
                      )} />
                    </div>
                    <div>
                      <div className="text-sm font-medium leading-none">{member.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{member.role}</div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 font-normal text-muted-foreground hover:text-foreground px-2">
                        {PERMISSION_LABELS[member.permission]}
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem onClick={() => handlePermissionChange(member.id, "can-edit")}>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">Can edit</span>
                            <span className="text-[10px] text-muted-foreground">Can modify canvas content</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePermissionChange(member.id, "can-comment")}>
                         <div className="flex flex-col gap-1">
                            <span className="font-medium">Can comment</span>
                            <span className="text-[10px] text-muted-foreground">View + add comments</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePermissionChange(member.id, "can-view")}>
                         <div className="flex flex-col gap-1">
                            <span className="font-medium">Can view</span>
                            <span className="text-[10px] text-muted-foreground">Read-only access</span>
                        </div>
                      </DropdownMenuItem>
                      <div className="h-px bg-border my-1" />
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
