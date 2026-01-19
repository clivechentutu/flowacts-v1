import { ReactNode } from "react";

interface ShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Shell({ sidebar, children }: ShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <main className="flex-1 h-full relative z-10 shadow-2xl order-1">
        {children}
      </main>
      <aside className="w-[400px] h-full flex-shrink-0 z-20 border-l border-border order-2">
        {sidebar}
      </aside>
    </div>
  );
}
