import { ReactNode } from "react";

interface ShellProps {
  nav?: ReactNode;
  rightPanel?: ReactNode;
  children: ReactNode;
}

export function Shell({ nav, rightPanel, children }: ShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Navigation Sidebar */}
      {nav}

      {/* Main Content Area */}
      <main className="flex-1 h-full relative z-10 shadow-2xl order-1 overflow-hidden">
        {children}
      </main>

      {/* Right Chat Panel */}
      {rightPanel && (
        <aside className="w-[346px] h-full flex-shrink-0 z-20 border-l border-border bg-card order-2 relative shadow-xl">
          {rightPanel}
        </aside>
      )}
    </div>
  );
}
