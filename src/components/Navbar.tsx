import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Menu, Moon, Search, Sparkles, ChevronDown, User, Settings, LogOut } from "lucide-react";
import logo from "@/assets/logo.svg";
import { notifications } from "@/lib/dashboard-data";

interface NavbarProps {
  onMenu: () => void;
}

export function Navbar({ onMenu }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="glass-panel sticky top-0 z-30 rounded-none border-x-0 border-t-0 px-4 py-3 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Toggle sidebar"
            className="rounded-xl p-2 text-secondary-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu size={18} />
          </button>
          <img src={logo} alt="Buildify" className="size-8 shrink-0 lg:hidden" />
          <label className="relative hidden min-w-0 flex-1 items-center sm:flex">
            <Search size={16} className="absolute left-3 text-muted-foreground" aria-hidden />
            <span className="sr-only">Global search</span>
            <input
              type="search"
              placeholder="Search projects, blueprints, materials…"
              className="w-full min-w-0 rounded-2xl border border-border bg-input/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-72 lg:w-96"
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="ember-gradient hidden items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <Sparkles size={16} aria-hidden /> AI Assistant
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            className="rounded-xl p-2 text-secondary-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Moon size={18} />
          </button>
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
                MA
              </span>
              <span className="hidden text-sm md:inline">Mohammed</span>
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
                    Mohammed Abdul Haseeb
                  </p>
                  <Link to="/settings" role="menuitem" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5">
                    <User size={15} aria-hidden /> Profile
                  </Link>
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
