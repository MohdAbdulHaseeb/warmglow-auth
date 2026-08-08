import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Sidebar, BottomNav } from "./Sidebar";
import { Navbar } from "./Navbar";
import { FloatingBackground } from "./FloatingBackground";

/** Shared shell: animated sidebar, top navbar, mobile bottom nav and footer. */
export function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen">
      <FloatingBackground />
      <div className="relative flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-10"
          >
            {children}
          </motion.main>
          <footer className="border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <span className="truncate">Buildify · Version 1.0</span>
              <span className="shrink-0">© 2026 Buildify</span>
            </div>
          </footer>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
