import { useState } from 'react';
import { StoryEvent } from '@/lib/mock-data';
import { ChevronRight, ChevronLeft, CheckCircle2, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskSidebarProps {
  events: StoryEvent[];
}

export function TaskSidebar({ events }: TaskSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter for actionable steps that look like tasks
  const tasks = events.filter(e => e.type === 'action');

  return (
    <>
      <div 
        className={cn(
          "absolute top-6 left-6 z-40 flex flex-col transition-all duration-300 ease-in-out bg-background/95 backdrop-blur border border-border rounded-xl shadow-lg overflow-hidden",
          isOpen ? "w-64 max-h-[60vh]" : "w-10 h-10 rounded-lg overflow-hidden"
        )}
      >
        <div className={cn("flex items-center p-2", isOpen ? "justify-between" : "justify-center h-full")}>
            {!isOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(true)}
                    title="Show Tasks"
                >
                    <ListTodo className="h-5 w-5" />
                </Button>
            )}

            {isOpen && (
                <>
                    <div className="flex items-center gap-2 pl-1">
                        <ListTodo className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">Tasks</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsOpen(false)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>

        {isOpen && (
          <ScrollArea className="flex-1 p-3 pt-0">
            <div className="space-y-4 mt-2">
              {tasks.map((task, index) => (
                <div key={task.id} className="flex gap-3 items-start group animate-in slide-in-from-left-2 fade-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="mt-0.5 text-primary/60 group-hover:text-primary transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                      {task.title || `Step ${index + 1}`}
                    </p>
                    {task.metadata && (
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                            {Object.entries(task.metadata).slice(0, 2).map(([key, value]) => (
                                <span key={key} className="text-[9px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground border border-border/50">
                                    {key}: {value}
                                </span>
                            ))}
                        </div>
                    )}
                  </div>
                </div>
              ))}
              
              {tasks.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-8 italic">
                      No tasks started yet...
                  </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
}
