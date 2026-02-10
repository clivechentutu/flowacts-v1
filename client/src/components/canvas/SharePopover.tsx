import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Copy, Check, Link as LinkIcon, ExternalLink } from "lucide-react";
import { CURRENT_CANVAS_TITLE } from "@/lib/collaboration-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function SharePopover() {
  const [isPublic, setIsPublic] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  
  // Mock public link
  const publicLink = `https://upliftly.app/share/canvas/${btoa(CURRENT_CANVAS_TITLE).substring(0, 8).toLowerCase()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setHasCopied(true);
    toast({
        description: "Public link copied to clipboard",
    });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleEnablePublic = () => {
    setIsPublic(true);
    // Auto copy on enable
    setTimeout(() => handleCopyLink(), 100);
  };

  const handleDisablePublic = () => {
    setIsPublic(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50">
          Share
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30">
            <h4 className="font-semibold text-sm">Share "{CURRENT_CANVAS_TITLE}"</h4>
        </div>
        
        <div className="p-4 space-y-4">
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                    <h5 className="text-sm font-medium">Public Access</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Generate a public read-only link. Anyone with this link can view the canvas.
                    </p>
                </div>
            </div>

            {isPublic ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input 
                                value={publicLink} 
                                readOnly 
                                className="pr-8 h-9 text-xs bg-muted/30 font-mono text-muted-foreground"
                            />
                        </div>
                        <Button 
                            size="sm" 
                            className={cn("h-9 gap-2", hasCopied ? "bg-green-600 hover:bg-green-700" : "")}
                            onClick={handleCopyLink}
                        >
                            {hasCopied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                         <a 
                            href="#" 
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.preventDefault()}
                         >
                            <ExternalLink className="w-3 h-3" />
                            Test Link
                         </a>
                         
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleDisablePublic}
                         >
                            Disable Public Link
                         </Button>
                    </div>
                </div>
            ) : (
                <Button className="w-full" onClick={handleEnablePublic}>
                    Enable Public Link
                </Button>
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
