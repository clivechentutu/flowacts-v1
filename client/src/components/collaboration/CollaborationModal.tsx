import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { DEMO_MEMBERS, Member } from "./types";
import { useToast } from "@/hooks/use-toast";

interface CollaborationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    canvasTitle: string;
}

export function CollaborationModal({ open, onOpenChange, canvasTitle }: CollaborationModalProps) {
    const { toast } = useToast();
    const [members, setMembers] = useState<Member[]>(DEMO_MEMBERS);
    const [inviteEmail, setInviteEmail] = useState("");

    const handleInvite = () => {
        if (!inviteEmail) return;
        toast({
            title: "Invite Sent",
            description: `Invitation sent to ${inviteEmail}`,
        });
        setInviteEmail("");
    };

    const updatePermission = (memberId: string, newPermission: Member['permission']) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, permission: newPermission } : m));
    };

    const getPermissionLabel = (permission: string) => {
        switch(permission) {
            case "owner": return "Owner";
            case "can-edit": return "Can edit";
            case "can-comment": return "Can comment";
            case "can-view": return "Can view";
            default: return permission;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle className="text-lg">Share "{canvasTitle}"</DialogTitle>
                </DialogHeader>

                <div className="px-4 pb-4 space-y-6">
                    {/* Invite Section */}
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter email or name..." 
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="h-9"
                            />
                            <Button size="sm" onClick={handleInvite} className="h-9 px-4">Send</Button>
                        </div>
                    </div>

                    {/* People with access */}
                    <div className="space-y-3">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            People with access
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                             {members.map(member => (
                                <div key={member.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={member.avatarUrl} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-medium truncate">{member.name}</span>
                                                {member.permission === 'owner' && <span className="text-[10px] bg-muted px-1 rounded text-muted-foreground">You</span>}
                                            </div>
                                            <span className="text-xs text-muted-foreground truncate">{member.role}</span>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs font-normal text-muted-foreground hover:text-foreground px-2">
                                                {getPermissionLabel(member.permission)}
                                                <ChevronDown className="w-3 h-3 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[180px]">
                                            <DropdownMenuItem onClick={() => updatePermission(member.id, 'owner')}>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">Owner</span>
                                                    <span className="text-[10px] text-muted-foreground">Full access & delete</span>
                                                </div>
                                                {member.permission === 'owner' && <Check className="ml-auto w-4 h-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updatePermission(member.id, 'can-edit')}>
                                                 <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">Can edit</span>
                                                    <span className="text-[10px] text-muted-foreground">Edit content & AI</span>
                                                </div>
                                                {member.permission === 'can-edit' && <Check className="ml-auto w-4 h-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updatePermission(member.id, 'can-comment')}>
                                                 <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">Can comment</span>
                                                    <span className="text-[10px] text-muted-foreground">Comment only</span>
                                                </div>
                                                {member.permission === 'can-comment' && <Check className="ml-auto w-4 h-4" />}
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => updatePermission(member.id, 'can-view')}>
                                                 <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">Can view</span>
                                                    <span className="text-[10px] text-muted-foreground">Read only</span>
                                                </div>
                                                {member.permission === 'can-view' && <Check className="ml-auto w-4 h-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-500 focus:text-red-600 focus:bg-red-50">
                                                Remove access
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
