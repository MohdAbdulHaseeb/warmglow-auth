import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Plus, Search, X, SearchX } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { ProjectTable } from "@/components/ProjectTable";
import { recentProjects } from "@/lib/dashboard-data";

/** Recent projects with a create action and client-side search. */
export function RecentProjectsSection() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recentProjects;
    return recentProjects.filter((p) =>
      [p.name, p.client, p.date].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/canvas"
            className="ember-gradient ember-glow inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus size={16} aria-hidden />
            Create New Project
          </Link>
        </motion.div>
      </div>

      <SectionCard
        title="Recent Projects"
        description="Latest furniture builds across your studio"
        action={
          <label className="relative flex w-full items-center sm:w-64">
            <Search size={15} className="absolute left-3 text-muted-foreground" aria-hidden />
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-2xl border border-border bg-input/40 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={14} />
              </button>
            )}
          </label>
        }
        className="[&>header]:grid-cols-1 [&>header]:sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        {filtered.length > 0 ? (
          <ProjectTable projects={filtered} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-foreground/[0.02] px-6 py-12 text-center"
          >
            <SearchX size={22} className="text-accent" aria-hidden />
            <p className="text-sm font-medium">No projects found</p>
            <p className="text-xs text-muted-foreground">Try a different name, client or date.</p>
          </motion.div>
        )}
      </SectionCard>
    </div>
  );
}
