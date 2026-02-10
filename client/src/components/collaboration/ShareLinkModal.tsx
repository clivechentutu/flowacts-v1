import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Copy, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareLinkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    canvasTitle: string;
}

export function ShareLinkModal({ open, onOpenChange, canvasTitle }: ShareLinkModalProps) {
    const { toast } = useToast();
    const [linkPermission, setLinkPermission] = useState<"can-view" | "can-comment" | "can-edit">("can-view");

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://replit.com/studio/${canvasTitle.toLowerCase().replace(/\s+/g, '-')}`);
        toast({
            title: "Copied!",
            description: "Public link copied to clipboard",
        });
    };

    const getPermissionLabel = (permission: string) => {
        switch(permission) {
            case "can-edit": return "Can edit";
            case "can-comment": return "Can comment";
            case "can-view": return "Can view";
            default: return permission;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Share to Web</DialogTitle>
                    <DialogDescription>
                        Publish and share your canvas with anyone who has the link.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-background border rounded-md p-1 pl-3 h-10">
                            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 text-sm text-muted-foreground">Anyone with link</div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-muted font-normal px-2">
                                        {getPermissionLabel(linkPermission)}
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setLinkPermission('can-view')}>Can view</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLinkPermission('can-comment')}>Can comment</DropdownMenuItem>
                                    {/* Edit is usually restricted for public links, but leaving it as option if desired */}
                                    <DropdownMenuItem onClick={() => setLinkPermission('can-edit')}>Can edit</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Button size="default" className="gap-2 shrink-0" onClick={handleCopyLink}>
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </Button>
                    </div>
                    
                    <div className="bg-muted/30 rounded-md p-3 text-xs text-muted-foreground">
                        <p>
                            People with this link can view your canvas without signing in.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
