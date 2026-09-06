import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import logo from "@/assets/logo.svg";
import { notifications } from "@/lib/dashboard-data";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAccount } from "@/lib/account-store";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;
  const { profile } = useAccount();
  const initials = profile.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="glass-panel sticky top-0 z-30 rounded-none border-x-0 border-t-0 px-4 py-3 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
          <img src={logo} alt="" aria-hidden className="size-8 shrink-0" />
          <span className="truncate text-lg font-semibold uppercase tracking-[0.18em] text-foreground">
            Buildify
          </span>
        </Link>


        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />

          <button
            type="button"
            aria-label={`Notifications, ${unread} unread`}
            className="relative rounded-xl p-2 text-secondary-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="ember-gradient absolute right-1 top-1 grid size-4 place-items-center rounded-full text-[10px] font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-2xl border border-border px-2 py-1.5 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="ember-gradient grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground">
                {initials}
              </span>
              <span className="hidden text-sm md:inline">{profile.fullName.split(" ")[0]}</span>
              <ChevronDown size={14} className="text-muted-foreground" aria-hidden />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="glass-panel absolute right-0 z-40 mt-2 w-52 rounded-2xl p-2"
                >
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    {profile.fullName}
                  </p>
                  <Link to="/settings" role="menuitem" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                    <Settings size={15} aria-hidden /> Settings
                  </Link>
                  <Link to="/" role="menuitem" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                    <LogOut size={15} aria-hidden /> Logout
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
