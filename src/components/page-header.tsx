import { GlassCard } from "./glass-card";
import { StatusBadge } from "./status-badge";
import { RefreshCw, GitBranch, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type GlobalStatus = "ONLINE" | "WARN" | "CRITICAL" | "UNKNOWN";

const toneFor: Record<GlobalStatus, "success" | "warning" | "danger" | "muted"> = {
  ONLINE: "success",
  WARN: "warning",
  CRITICAL: "danger",
  UNKNOWN: "muted",
};

export function PageHeader({
  title,
  subtitle,
  status = "ONLINE",
  role = "Viewer",
}: {
  title: string;
  subtitle?: string;
  status?: GlobalStatus;
  role?: "Admin" | "Viewer" | "Unauthenticated";
}) {
  const [updated, setUpdated] = useState(new Date());
  return (
    <GlassCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-gradient-primary">{title}</h1>
          <StatusBadge tone={toneFor[status]} dot>{status}</StatusBadge>
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="rounded bg-[oklch(0.25_0.04_265_/_60%)] px-1.5 py-0.5">OT v1.1.0</span>
          <span className="rounded bg-[oklch(0.25_0.04_265_/_60%)] px-1.5 py-0.5">CT APP v6.32.4</span>
          <span className="rounded bg-[oklch(0.25_0.04_265_/_60%)] px-1.5 py-0.5">CT pkg 6.32.4</span>
          <span className="rounded bg-[oklch(0.25_0.04_265_/_60%)] px-1.5 py-0.5 inline-flex items-center gap-1">
            <GitBranch className="h-3 w-3" /> main · a8f3c21
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="info"><ShieldCheck className="mr-1 h-3 w-3 inline" />{role}</StatusBadge>
        <span className="text-xs text-muted-foreground tabular-nums">
          Updated {updated.toLocaleTimeString()}
        </span>
        <button
          onClick={() => setUpdated(new Date())}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-[var(--glass-border)]",
            "bg-[oklch(0.25_0.04_265_/_60%)] px-2.5 py-1 text-xs font-medium hover:bg-[oklch(0.30_0.06_265_/_70%)]",
          )}
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>
    </GlassCard>
  );
}
