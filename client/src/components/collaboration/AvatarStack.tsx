import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DEMO_MEMBERS, Member } from "./types";

interface AvatarStackProps {
  onManageMembers: () => void;
}

export function AvatarStack({ onManageMembers }: AvatarStackProps) {
  const displayMembers = DEMO_MEMBERS.slice(0, 3);
  const remainingCount = Math.max(0, DEMO_MEMBERS.length - 3);

  return (
    <div className="flex items-center -space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center -space-x-2 cursor-pointer hover:opacity-90 transition-opacity">
             {displayMembers.map((member) => (
              <TooltipProvider key={member.id}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <Avatar className="w-7 h-7 border-2 border-background ring-1 ring-border/20">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.name} / {member.role} · {member.isOnline ? "Online" : "Offline"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            
            {remainingCount > 0 && (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                         <div className="relative w-7 h-7 rounded-full bg-muted flex items-center justify-center border-2 border-background ring-1 ring-border/20 z-10">
                            <span className="text-[10px] font-medium text-muted-foreground">+{remainingCount}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{remainingCount} more members</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Active Members
            </div>
            {DEMO_MEMBERS.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="relative">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                         {member.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full" />
                          )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">{member.name}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{member.role} · {member.isOnline ? "Online" : "Offline"}</span>
                    </div>
                </div>
            ))}
            <DropdownMenuSeparator className="my-2" />
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-center text-xs"
                onClick={(e) => {
                    e.preventDefault();
                    onManageMembers();
                }}
            >
                Manage Members
            </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
