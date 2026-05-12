import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { PetIcon } from "@/components/pet-icon";
import { OPEN_TRADES } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, Circle, XCircle, Database, Activity, Brain, Swords, Compass, Flame, Stethoscope, ShieldAlert, LogIn, Briefcase, Eye, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const Route = createFileRoute("/trades")({
  head: () => ({ meta: [{ title: "Live Trades · ClaudeTrader" }, { name: "description", content: "Offene Trades, Trade Journey und Closed-Übersicht." }] }),
  component: TradesPage,
});

type StepTone = "ok" | "warn" | "risk" | "pending" | "data" | "shadow";

type Step = {
  id: string; label: string; icon: ReactNode; pet?: string;
  shadow?: boolean;
};

const STEPS: Step[] = [
  { id: "data", label: "Market Data", icon: <Database className="h-3.5 w-3.5" /> },
  { id: "signal", label: "Signal", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "strategy", label: "Strategy", icon: <Activity className="h-3.5 w-3.5" /> },
  { id: "xgb", label: "XGBoost", icon: <Brain className="h-3.5 w-3.5" />, shadow: true },
  { id: "arena", label: "Battle Arena", icon: <Swords className="h-3.5 w-3.5" />, pet: "sparky", shadow: true },
  { id: "hermes", label: "Hermes", icon: <Compass className="h-3.5 w-3.5" />, pet: "hermes", shadow: true },
  { id: "candle", label: "CandleSight", icon: <Flame className="h-3.5 w-3.5" />, pet: "wick", shadow: true },
  { id: "treat", label: "Treatment", icon: <Stethoscope className="h-3.5 w-3.5" />, pet: "spike" },
  { id: "risk", label: "Risk", icon: <ShieldAlert className="h-3.5 w-3.5" />, pet: "shieldy" },
  { id: "entry", label: "Entry", icon: <LogIn className="h-3.5 w-3.5" /> },
  { id: "position", label: "Position", icon: <Briefcase className="h-3.5 w-3.5" />, pet: "corey" },
  { id: "exit", label: "Exit Watch", icon: <Eye className="h-3.5 w-3.5" /> },
  { id: "learn", label: "Learning", icon: <Moon className="h-3.5 w-3.5" />, pet: "luna" },
];

function TradesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionTitle title="Live Trades" subtitle="Offene Positionen und ihr Weg durch die Module." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {OPEN_TRADES.map((t) => <TradeCard key={t.id} t={t} />)}
      </div>
      <GlassCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Letzter geschlossener Trade</h3>
          <StatusBadge tone="success" dot>+$12.40</StatusBadge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">BTC/USDT · LONG · SMC_TJR · gehalten 3h 18m · Exit Grade B+ · Retained Profit 71%.</p>
        <p className="mt-1 text-xs text-muted-foreground">Learning: Treatment-Klasse "Protected-Win" bestätigt.</p>
      </GlassCard>
      <p className="text-center text-xs text-muted-foreground">Shadow-Module erklären nur und greifen nicht live ein.</p>
    </div>
  );
}

function TradeCard({ t }: { t: typeof OPEN_TRADES[number] }) {
  const isWin = t.pnl >= 0;
  const lo = Math.min(t.sl, t.tp);
  const hi = Math.max(t.sl, t.tp);
  const pct = Math.max(0, Math.min(1, (t.current - lo) / (hi - lo)));
  const entryPct = Math.max(0, Math.min(1, (t.entry - lo) / (hi - lo)));
  const slLeft = t.side === "LONG";
  const curPos = (slLeft ? pct : 1 - pct) * 100;
  const entryPos = (slLeft ? entryPct : 1 - entryPct) * 100;
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{t.symbol}</h3>
            <StatusBadge tone={t.side === "LONG" ? "success" : "danger"}>{t.side}</StatusBadge>
            <StatusBadge tone="muted">{t.strategy}</StatusBadge>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 anim-ping-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Entry ${t.entry} → ${t.current} · {t.hold}</p>
        </div>
        <div className="text-right">
          <div className={`text-xl font-semibold tabular-nums ${isWin ? "text-success" : "text-destructive"}`}>
            {isWin ? "+" : ""}${t.pnl.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">R {t.r.toFixed(2)} · max {t.maxR.toFixed(2)}</div>
        </div>
      </div>

      {/* SL / Entry / TP risk track */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="text-destructive/80">SL ${t.sl}</span>
          <span>Risk Track</span>
          <span className="text-success/80">TP ${t.tp}</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_70%)]">
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${curPos}%`,
              background: isWin ? "var(--gradient-success)" : "var(--gradient-danger)",
              opacity: 0.85,
            }}
          />
          <div className="pointer-events-none absolute inset-0 anim-scan bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-foreground/60"
            style={{ left: `${entryPos}%` }}
            title="Entry"
          />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-[var(--shadow-glow-primary)]"
            style={{ left: `${curPos}%` }}
            title="Current"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat label="SL" value={`$${t.sl}`} />
        <Stat label="TP" value={`$${t.tp}`} />
        <Stat label="MinR" value={t.minR.toFixed(2)} />
        <Stat label="XGB" value={t.xgb.toFixed(2)} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Trade Journey</div>
          <div className="text-[10px] text-muted-foreground/70">Shadow-Schritte greifen nicht ein</div>
        </div>
        <Journey t={t} />
      </div>

      <div className="grid gap-2 text-xs">
        <Row label="Treatment" value={t.treatment} tone={t.treatment.includes("Risk") ? "warning" : "info"} />
        <Row label="CandleSight" value={t.candleSight} tone={t.candleSight.includes("risk") ? "warning" : "shadow"} />
        <Row label="Hermes" value={t.hermes} tone={t.hermes === "suspicious" ? "warning" : "shadow"} />
        <Row label="Arena" value={t.arena} tone="shadow" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {t.risk.map((r) => (
          <StatusBadge key={r} tone={r.includes("risk") || r.includes("WARN") || r.includes("Fakeout") ? "warning" : "muted"}>{r}</StatusBadge>
        ))}
      </div>
    </GlassCard>
  );
}

function Journey({ t }: { t: typeof OPEN_TRADES[number] }) {
  const activeIdx = STEPS.findIndex((s) => s.id === "position");
  return (
    <ol className="relative space-y-2">
      <div className="pointer-events-none absolute left-[14px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--glass-border)] via-[var(--glass-border)] to-transparent" />
      {STEPS.map((s, i) => {
        const tone = stepTone(t, i, s);
        const isActive = i === activeIdx;
        return (
          <li key={s.id} className="relative flex items-start gap-3">
            <span className={cn(
              "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
              toneCls(tone),
            )}>
              {isActive && <span className="absolute inset-0 rounded-full border-2 border-primary anim-ping-ring" />}
              <StepIcon tone={tone} />
            </span>
            <div className={cn(
              "flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5",
              isActive
                ? "border-primary/40 bg-primary/10 shadow-[var(--shadow-glow-primary)]"
                : "border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_50%)]",
            )}>
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-muted-foreground">{s.icon}</span>
                <span className="truncate text-xs font-medium">{s.label}</span>
                {s.pet && <PetIcon id={s.pet} size={20} halo={false} />}
                {s.shadow && <span className="rounded-full border border-warning/30 bg-warning/10 px-1.5 py-0 text-[9px] text-warning">shadow</span>}
                {isActive && <span className="rounded-full border border-primary/40 bg-primary/15 px-1.5 py-0 text-[9px] font-semibold uppercase text-primary">live</span>}
              </div>
              <span className={cn("text-[10px] font-medium uppercase tracking-wider", toneText(tone))}>
                {toneLabel(tone)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_50%)] px-2.5 py-1.5">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}
function Row({ label, value, tone }: { label: string; value: string; tone: any }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function stepTone(t: typeof OPEN_TRADES[number], i: number, s: Step): StepTone {
  if (i === 0) return "data";
  if (s.shadow && t.symbol.startsWith("ETH") && (s.id === "arena" || s.id === "hermes" || s.id === "candle")) return "warn";
  if (s.shadow) return "shadow";
  if (t.symbol.startsWith("ETH") && s.id === "treat") return "risk";
  if (s.id === "learn") return "pending";
  return "ok";
}

function toneCls(t: StepTone) {
  return {
    ok: "border-success/40 bg-success/15 text-success",
    warn: "border-warning/40 bg-warning/15 text-warning",
    risk: "border-destructive/50 bg-destructive/15 text-destructive",
    pending: "border-border bg-muted text-muted-foreground",
    data: "border-info/40 bg-info/15 text-info",
    shadow: "border-learning/30 bg-learning/10 text-learning",
  }[t];
}
function toneText(t: StepTone) {
  return {
    ok: "text-success", warn: "text-warning", risk: "text-destructive",
    pending: "text-muted-foreground", data: "text-info", shadow: "text-learning",
  }[t];
}
function toneLabel(t: StepTone) {
  return { ok: "ok", warn: "watch", risk: "risk", pending: "pending", data: "input", shadow: "shadow" }[t];
}
function StepIcon({ tone }: { tone: StepTone }) {
  const cls = "h-3.5 w-3.5";
  if (tone === "ok") return <CheckCircle2 className={cls} />;
  if (tone === "warn") return <AlertTriangle className={cls} />;
  if (tone === "risk") return <XCircle className={cls} />;
  if (tone === "data") return <Database className={cls} />;
  if (tone === "shadow") return <Eye className={cls} />;
  return <Circle className={cls} />;
}
