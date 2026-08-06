import type { ReactNode } from "react";
import { motion } from "motion/react";
import { AnimatedBackground } from "./AnimatedBackground";
import { AuthHeader } from "./AuthHeader";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Split-screen auth shell with the premium glass card on the right. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      <AnimatedBackground />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center gap-10 px-5 py-10 md:flex-row md:gap-8 md:px-10">
        <section className="hidden w-full md:block md:w-[60%] lg:w-[45%]">
          <AuthHeader />
        </section>
        <section className="flex w-full items-center justify-center md:w-[40%] lg:w-[55%]">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="glass-panel w-full max-w-md rounded-3xl p-7 sm:p-9"
          >
            <header className="mb-7 space-y-2">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </header>
            {children}
            <footer className="mt-7 text-center text-sm text-muted-foreground">{footer}</footer>
          </motion.div>
        </section>
      </div>
    </motion.main>
  );
}
