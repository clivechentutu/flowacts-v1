import { ReactNode } from "react";

interface ShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Shell({ sidebar, children }: ShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="w-[400px] h-full flex-shrink-0 z-20">
        {sidebar}
      </aside>
      <main className="flex-1 h-full relative z-10 shadow-2xl">
        {children}
      </main>
    </div>
  );
}
