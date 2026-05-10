import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info" | "learning";
  icon?: ReactNode;
}) {
  const toneText = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    info: "text-info",
    learning: "text-learning",
  }[tone];

  return (
    <GlassCard className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className={cn("text-2xl font-semibold tracking-tight tabular-nums", toneText)}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </GlassCard>
  );
}
