import React, { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarStack } from "./AvatarStack";
import { CollaborationPopover } from "./CollaborationModal";
import { SharePopover } from "./SharePopover";

export function TopRightToolbar() {
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);

  return (
    <div className="flex items-center bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm px-1.5 py-1">
      <AvatarStack onManageMembers={() => setIsCollaborationModalOpen(true)} />
      
      <div className="h-4 w-px bg-border/60 mx-1" />
      
      <CollaborationPopover 
        isOpen={isCollaborationModalOpen} 
        onOpenChange={setIsCollaborationModalOpen}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground mx-1"
          title="Invite & Manage Collaborators"
        >
          <Users className="w-4 h-4" />
        </Button>
      </CollaborationPopover>
      
      <div className="h-4 w-px bg-border/60 mx-1" />
      
      <SharePopover />
    </div>
  );
}
