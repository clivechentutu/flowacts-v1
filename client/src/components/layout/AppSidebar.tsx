import { Home, Layers, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AppSidebarProps {
  activeTab: 'home' | 'experience';
  onTabChange: (tab: 'home' | 'experience') => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'experience', icon: Layers, label: 'Experience' },
  ] as const;

  return (
    <div className="w-16 h-full bg-card border-r border-border flex flex-col items-center py-6 gap-6 z-30 flex-shrink-0">
      {/* Logo Placeholder */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
        <div className="w-5 h-5 text-primary-foreground font-bold text-xs flex items-center justify-center">U</div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 w-full px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative group flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 w-full px-2">
        <button className="flex items-center justify-center w-full h-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-full h-px bg-border my-1" />
        <button className="flex items-center justify-center w-full h-10 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
