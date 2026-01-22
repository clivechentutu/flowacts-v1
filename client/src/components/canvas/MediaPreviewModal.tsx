import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, Play, FileText, Music, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'pdf' | string;
  url?: string;
  content?: string;
}

export function MediaPreviewModal({ isOpen, onClose, title, type, url, content }: MediaPreviewModalProps) {
  if (!isOpen) return null;

  // Normalize type
  const normalizedType = type.toLowerCase();
  const isImage = normalizedType.startsWith('image');
  const isVideo = normalizedType.startsWith('video');
  const isAudio = normalizedType.startsWith('audio');
  const isPdf = normalizedType.includes('pdf');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-background/95 border border-white/10 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/10 bg-muted/20">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {isImage && <ImageIcon className="w-5 h-5" />}
                    {isVideo && <Play className="w-5 h-5" />}
                    {isAudio && <Music className="w-5 h-5" />}
                    {!isImage && !isVideo && !isAudio && <FileText className="w-5 h-5" />}
                 </div>
                 <h2 className="text-lg font-heading font-semibold text-foreground truncate max-w-[300px] sm:max-w-md">
                    {title}
                 </h2>
              </div>
              <div className="flex items-center gap-2">
                {url && (
                    <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex" asChild>
                        <a href={url} download target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" /> Download
                        </a>
                    </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Media Container */}
            <div className="flex-1 overflow-auto bg-black/5 dark:bg-black/40 flex items-center justify-center p-4 min-h-[400px]">
                {isImage && url && (
                    <img src={url} alt={title} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
                )}

                {isVideo && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-black rounded-lg aspect-video max-h-[70vh]">
                        {/* Mock Video Player */}
                         <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Play className="w-8 h-8 fill-current text-white" />
                         </div>
                         <p>Video Preview Unavailable in Prototype</p>
                    </div>
                )}

                {isAudio && (
                     <div className="w-full max-w-md p-8 bg-card rounded-xl border border-border flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                            <Music className="w-10 h-10 text-primary" />
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-primary rounded-full" />
                        </div>
                        <div className="flex justify-between w-full text-xs text-muted-foreground">
                            <span>0:00</span>
                            <span>-3:45</span>
                        </div>
                        <p className="text-sm font-medium">{title}</p>
                     </div>
                )}

                {!isImage && !isVideo && !isAudio && (
                    <div className="w-full max-w-3xl bg-card rounded-xl border border-border p-8 md:p-12 shadow-sm min-h-[50vh] flex flex-col">
                        <h3 className="text-xl font-bold mb-6 font-serif-reading text-foreground">{title}</h3>
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            {content ? (
                                <p className="whitespace-pre-wrap">{content}</p>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 gap-4 opacity-50">
                                    <FileText className="w-12 h-12" />
                                    <p>No preview content available</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
