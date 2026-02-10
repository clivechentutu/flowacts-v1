import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DEMO_MEMBERS, Member } from "@/lib/collaboration-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AvatarStackProps {
  onManageMembers: () => void;
}

export function AvatarStack({ onManageMembers }: AvatarStackProps) {
  const visibleMembers = DEMO_MEMBERS.slice(0, 3);
  const remainingCount = Math.max(0, DEMO_MEMBERS.length - 3);

  return (
    <div className="flex items-center -space-x-2 mr-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <div className="flex items-center -space-x-2 cursor-pointer group">
              {visibleMembers.map((member) => (
                <TooltipProvider key={member.id}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="relative hover:z-10 transition-transform hover:scale-110">
                        <Avatar className="w-7 h-7 border-2 border-background ring-1 ring-border/20">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback className="text-[10px]">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>{member.name} / {member.role}</p>
                      <p className="text-[10px] text-muted-foreground opacity-90">
                        {member.isOnline ? "Online" : "Offline"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              
              {remainingCount > 0 && (
                <div className="relative hover:z-10 transition-transform hover:scale-110">
                    <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground ring-1 ring-border/20">
                        +{remainingCount}
                    </div>
                </div>
              )}
           </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px] p-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Members ({DEMO_MEMBERS.length})
            </div>
            {DEMO_MEMBERS.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="relative">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                         <div className={cn(
                            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
                            member.isOnline ? "bg-green-500" : "bg-zinc-300"
                          )} />
                    </div>
                    <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                </div>
            ))}
            <DropdownMenuSeparator className="my-2" />
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={onManageMembers}
            >
                Manage Members
            </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
