import { GlassCard } from "./glass-card";
import { StatusBadge } from "./status-badge";
import { MASCOTS } from "./pet-mascots";
import type { Pet, PetStatus } from "@/lib/mock-data";
import { AlertTriangle, MessageCircle, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const statusToTone: Record<PetStatus, "success" | "warning" | "danger" | "shadow" | "muted"> = {
  active: "success",
  warning: "warning",
  critical: "danger",
  shadow: "shadow",
  idle: "muted",
};

const haloMap: Record<PetStatus, string> = {
  active: "from-success/30 to-success/0",
  warning: "from-warning/30 to-warning/0",
  critical: "from-destructive/35 to-destructive/0",
  shadow: "from-learning/25 to-learning/0",
  idle: "from-muted/20 to-muted/0",
};

const ringMap: Record<PetStatus, string> = {
  active: "ring-success/40 shadow-[var(--shadow-glow-success)]",
  warning: "ring-warning/40 shadow-[var(--shadow-glow-warning)]",
  critical: "ring-destructive/50 shadow-[var(--shadow-glow-danger)]",
  shadow: "ring-learning/35 shadow-[var(--shadow-glow-learning)]",
  idle: "ring-border",
};

export function PetCard({ pet }: { pet: Pet }) {
  const Mascot = MASCOTS[pet.id];
  return (
    <GlassCard className="group relative flex flex-col gap-4 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-primary)]">
      {/* corner sheen */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
      <div className="flex items-start gap-4">
        {/* mascot halo */}
        <div className="relative shrink-0">
          <div className={cn("absolute inset-0 -m-2 rounded-3xl bg-gradient-to-br blur-xl opacity-80", haloMap[pet.status])} />
          <div className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-3xl border bg-[oklch(0.16_0.04_265_/_75%)] ring-1",
            ringMap[pet.status],
          )}>
            {Mascot && <Mascot className="h-20 w-20 anim-bob" />}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-base font-semibold tracking-tight">{pet.name}</h3>
            {pet.shadow && <StatusBadge tone="shadow">Shadow</StatusBadge>}
          </div>
          <p className="mt-0.5 truncate text-[11px] uppercase tracking-wider text-muted-foreground">{pet.module}</p>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge tone={statusToTone[pet.status]} dot>{pet.statusLabel}</StatusBadge>
            <span className="text-[10px] text-muted-foreground/70">v6.32.4</span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{pet.role}</p>

      {pet.alert && (
        <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{pet.alert}</span>
        </div>
      )}

      {/* Pet says */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[oklch(0.18_0.04_265_/_60%)] p-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <MessageCircle className="h-3 w-3" />
            {pet.name} sagt
          </div>
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium",
            pet.commentarySource === "ollama-ready"
              ? "border-info/30 bg-info/10 text-info"
              : "border-muted bg-muted text-muted-foreground",
          )}>
            <Sparkles className="h-2.5 w-2.5" />
            {pet.commentarySource === "ollama-ready" ? "Ollama-ready" : "Fallback"}
          </span>
        </div>
        <p className="text-[13px] italic leading-snug text-foreground/90">"{pet.says}"</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {pet.metrics.map((m) => (
          <div key={m.label}
            className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_70%)] px-2.5 py-1 text-[11px]">
            <span className="text-muted-foreground">{m.label} </span>
            <span className="font-semibold tabular-nums text-foreground">{m.value}</span>
          </div>
        ))}
      </div>

      <button className="group/btn -mb-1 mt-auto inline-flex items-center gap-1 self-start text-xs font-medium text-info/90 transition-colors hover:text-info">
        Details ansehen <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </GlassCard>
  );
}
