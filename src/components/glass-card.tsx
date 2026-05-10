import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

export function GlassCard({
  className,
  children,
  glow,
  ...props
}: HTMLAttributes<HTMLDivElement> & { glow?: "primary" | "success" | "warning" | "danger" | "learning" }) {
  const glowMap = {
    primary: "shadow-[var(--shadow-glow-primary)]",
    success: "shadow-[var(--shadow-glow-success)]",
    warning: "shadow-[var(--shadow-glow-warning)]",
    danger: "shadow-[var(--shadow-glow-danger)]",
    learning: "shadow-[var(--shadow-glow-learning)]",
  };
  return (
    <div
      className={cn("glass rounded-2xl p-5", glow && glowMap[glow], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
