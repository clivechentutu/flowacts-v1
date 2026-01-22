import { CardBase } from "./CardBase";
import { Badge } from "@/components/ui/badge";
import { FileText, FileImage, FileVideo, FileAudio, File, Folder } from "lucide-react";

interface FileCardProps {
  title: string;
  content: string; // In this case, maybe file size or description
  fileType?: string;
  timestamp: string;
  isLast?: boolean;
  onMediaClick?: () => void;
}

export function FileCard({ title, content, fileType, timestamp, isLast, onMediaClick }: FileCardProps) {
  const getIcon = () => {
    if (fileType === 'folder') return <Folder className="w-12 h-12 text-yellow-500 fill-yellow-500/20" />;
    if (fileType?.startsWith('image')) return <FileImage className="w-12 h-12 text-blue-500" />;
    if (fileType?.startsWith('video')) return <FileVideo className="w-12 h-12 text-purple-500" />;
    if (fileType?.startsWith('audio')) return <FileAudio className="w-12 h-12 text-pink-500" />;
    if (fileType?.includes('pdf') || fileType?.includes('document')) return <FileText className="w-12 h-12 text-orange-500" />;
    return <File className="w-12 h-12 text-gray-500" />;
  };

  const getBadgeColor = () => {
     if (fileType === 'folder') return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
     if (fileType?.startsWith('image')) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
     if (fileType?.startsWith('video')) return "bg-purple-500/10 text-purple-500 border-purple-500/20";
     if (fileType?.startsWith('audio')) return "bg-pink-500/10 text-pink-500 border-pink-500/20";
     return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  };

  return (
    <CardBase isLast={isLast} className="min-w-[360px] max-w-[360px] flex flex-col h-full bg-card border-border">
      <div className="p-3 border-b border-border/50 flex justify-between items-center bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] h-5 px-1.5 font-mono uppercase tracking-wider ${getBadgeColor()}`}>
            {fileType?.split('/')[0] || 'File'}
          </Badge>
          <span className="font-heading font-semibold text-sm text-card-foreground truncate max-w-[180px]">{title}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{timestamp}</span>
      </div>
      
      <div 
        className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/20 gap-4 group cursor-pointer"
        onClick={onMediaClick}
      >
         <div className="p-6 rounded-3xl bg-background shadow-sm border border-border group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
            {getIcon()}
         </div>
         <div className="text-center">
             <p className="font-medium text-foreground">{title}</p>
             <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{fileType || 'Unknown Type'}</p>
         </div>
      </div>

      <div className="p-4 border-t border-border/50 bg-card">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{content}</span>
            <span>Uploaded just now</span>
        </div>
      </div>
    </CardBase>
  );
}
