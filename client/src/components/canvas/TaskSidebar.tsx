import { useState } from 'react';
import { StoryEvent } from '@/lib/mock-data';
import { ChevronRight, ChevronLeft, CheckCircle2, ListTodo, Loader2 } from 'lucide-react';
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
  
  // Logic to determine if the last task is "running"
  // If the last event in the entire stream is NOT an action, it might mean we are "thinking" about the next action?
  // Or simply: The last item in 'tasks' is 'running', previous are 'completed'.
  // But strictly speaking, if it's in the list, it's done? 
  // Let's simulate: The LAST action in the list is "Running" if we assume the user is watching it happen.
  // Actually, usually "Events" are past tense. 
  // BUT for the demo effect, let's make the *latest* task show as a spinner for a bit, or just show it as "completed" and assume the spinner is for the *next* thing?
  // The user asked for "Green spinning circle for running".
  // Let's say the last task in the list is the "Active" one.
  
  return (
    <>
      <div 
        className={cn(
          "absolute top-6 left-6 z-40 flex flex-col transition-all duration-300 ease-in-out bg-background/95 backdrop-blur border border-border rounded-xl shadow-lg overflow-hidden",
          isOpen ? "w-64 max-h-[60vh]" : "w-auto h-auto rounded-lg overflow-visible bg-transparent border-0 shadow-none"
        )}
      >
        <div className={cn("flex items-center", isOpen ? "justify-between p-2 bg-background/95 backdrop-blur" : "justify-start")}>
            {!isOpen && (
                <div className="flex flex-row items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
                        onClick={() => setIsOpen(true)}
                        title="Show Tasks"
                    >
                        <ListTodo className="h-5 w-5" />
                    </Button>
                    
                    {/* Collapsed Status Indicator */}
                    {events.length > 0 && (
                        <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-full border border-border/50 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                             {/* Check if last event is recent/active */}
                             {tasks.length > 0 && tasks.length < 15 ? (
                                <>
                                    <Loader2 className="h-3 w-3 text-emerald-500 animate-spin" />
                                    <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap max-w-[100px] truncate">
                                        Processing Step {tasks.length}...
                                    </span>
                                </>
                             ) : (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
                                    <span className="text-[10px] text-emerald-600 font-bold whitespace-nowrap">
                                        DONE
                                    </span>
                                </>
                             )}
                        </div>
                    )}
                </div>
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
              {tasks.map((task, index) => {
                const isLast = index === tasks.length - 1;
                // For demo purposes: treat the last item as "running" if it's fresh? 
                // Or maybe just show all as completed?
                // User wants to see the running state.
                // Let's assume the last task is "running" for visualization.
                const isRunning = isLast; 
                
                return (
                  <div key={task.id} className="flex gap-3 items-start group animate-in slide-in-from-left-2 fade-in duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="mt-0.5 transition-colors">
                      {isRunning ? (
                         <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                      ) : (
                         <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                          "text-xs font-medium leading-tight transition-colors",
                          isRunning ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}>
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
                );
              })}
              
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
