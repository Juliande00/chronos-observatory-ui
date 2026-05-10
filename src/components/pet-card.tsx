import { GlassCard } from "./glass-card";
import { StatusBadge } from "./status-badge";
import { MASCOTS } from "./pet-mascots";
import type { PetStatus } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";

const statusToTone: Record<PetStatus, "success" | "warning" | "danger" | "shadow" | "muted"> = {
  active: "success",
  warning: "warning",
  critical: "danger",
  shadow: "shadow",
  idle: "muted",
};

export function PetCard({
  pet,
}: {
  pet: {
    id: string;
    name: string;
    module: string;
    role: string;
    status: PetStatus;
    statusLabel: string;
    metrics: { label: string; value: string }[];
    shadow: boolean;
    alert?: string;
  };
}) {
  const Mascot = MASCOTS[pet.id];
  return (
    <GlassCard className="flex flex-col gap-3 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.18_0.04_265_/_60%)] border border-[var(--glass-border)]">
          {Mascot && <Mascot className="h-16 w-16" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{pet.name}</h3>
            {pet.shadow && <StatusBadge tone="shadow">Shadow</StatusBadge>}
          </div>
          <p className="truncate text-xs text-muted-foreground">{pet.module}</p>
          <div className="mt-2">
            <StatusBadge tone={statusToTone[pet.status]} dot>
              {pet.statusLabel}
            </StatusBadge>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{pet.role}</p>
      {pet.alert && (
        <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
          <AlertTriangle className="h-3.5 w-3.5" />
          {pet.alert}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {pet.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] px-2.5 py-1 text-xs"
          >
            <span className="text-muted-foreground">{m.label}: </span>
            <span className="font-medium tabular-nums">{m.value}</span>
          </div>
        ))}
      </div>
      <button className="mt-1 text-left text-xs text-info/90 hover:text-info">Details ansehen →</button>
    </GlassCard>
  );
}
