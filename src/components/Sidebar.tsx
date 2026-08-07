import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, logoutItem } from "@/lib/dashboard-data";
import logo from "@/assets/logo.svg";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 268 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden rounded-none border-y-0 border-l-0 lg:flex"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <img src={logo} alt="" className="size-9 shrink-0" />
        {!collapsed && (
          <span className="truncate font-display text-lg font-semibold">Buildify</span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-secondary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-accent/12 text-foreground" : "hover:bg-white/5 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="ember-gradient absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full"
                />
              )}
              <item.icon size={18} className={cn("shrink-0", active && "text-accent")} aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        <Link
          to={logoutItem.to}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-secondary-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <logoutItem.icon size={18} className="shrink-0" aria-hidden />
          {!collapsed && <span>Logout</span>}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}

/** Mobile bottom navigation with the first five destinations. */
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [navItems[0], navItems[1], navItems[2], navItems[8], navItems[11]];

  return (
    <nav
      aria-label="Mobile navigation"
      className="glass-panel fixed inset-x-0 bottom-0 z-40 flex items-center justify-around rounded-none border-x-0 border-b-0 px-2 py-2 lg:hidden"
    >
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.label}
            to={item.to}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "text-accent" : "text-muted-foreground",
            )}
          >
            <item.icon size={19} aria-hidden />
            <span className="w-full truncate text-center">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
