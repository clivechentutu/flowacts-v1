import { Home, Layers, Settings, Sun, Moon, FolderKanban, Users, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { SettingsModal } from "../settings/SettingsModal";

interface AppSidebarProps {
  activeTab: 'home' | 'project' | 'projects-list' | 'library';
  onTabChange: (tab: 'home' | 'project' | 'projects-list' | 'library') => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (systemPrefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'project', icon: FolderKanban, label: 'Studio' },
    { id: 'projects-list', icon: Layers, label: 'Project' },
  ] as const;

  return (
    <div className="w-20 h-full bg-[var(--sidebar-background)] border-r border-border flex flex-col items-center py-6 gap-6 z-30 flex-shrink-0 transition-all duration-300">
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
                "relative group flex flex-col items-center justify-center w-full h-16 rounded-xl transition-all duration-200 gap-1",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 w-full px-2">
        <button 
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center w-full h-14 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all gap-1 group"
        >
          {theme === 'light' ? (
             <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
             <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
          )}
          <span className="text-[9px] font-medium opacity-70 group-hover:opacity-100">
            {theme === 'light' ? 'Light' : 'Dark'}
          </span>
        </button>

        <button className="flex flex-col items-center justify-center w-full h-14 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all gap-1 group">
          <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-[9px] font-medium opacity-70 group-hover:opacity-100">Help</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-full h-14 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all gap-1 group"
          onClick={() => setIsSettingsOpen(true)}
          data-testid="button-open-settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-[9px] font-medium opacity-70 group-hover:opacity-100">Settings</span>
        </button>

        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

        <div className="w-full h-px bg-border my-1" />
        <button
          className="flex flex-col items-center justify-center w-full pb-2 rounded-lg transition-all group"
          data-testid="button-user-avatar"
        >
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary/50 transition-colors">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User Avatar" 
              className="w-full h-full rounded-full bg-muted"
              data-testid="img-user-avatar"
            />
          </div>
          <div
            className="mt-2 rounded-full bg-orange-500/15 text-orange-700 dark:text-orange-200 border border-orange-500/25 px-2 py-0.5 text-[10px] font-semibold tracking-wide"
            data-testid="badge-user-plan"
          >
            Pro
          </div>
        </button>
      </div>
    </div>
  );
}
