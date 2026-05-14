import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { PetIcon } from "@/components/pet-icon";
import { OPEN_TRADES, CLOSED_TRADES } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, Circle, XCircle, Database, Activity, Brain, Swords, Compass, Flame, Stethoscope, ShieldAlert, LogIn, Briefcase, Eye, Moon, TrendingUp, TrendingDown, Briefcase as BriefIcon, Percent, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/trades")({
  head: () => ({ meta: [{ title: "Live Trades · OmniTrader" }, { name: "description", content: "Offene Trades, Trade Journey und Closed-Übersicht." }] }),
  component: TradesPage,
});

type StepTone = "ok" | "warn" | "risk" | "pending" | "data" | "shadow";
type Step = { id: string; label: string; icon: ReactNode; pet?: string; shadow?: boolean };
type FilterKey = "all" | "long" | "short" | "win" | "loss";

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

type Trade = typeof OPEN_TRADES[number];

function useLiveTicker(trades: Trade[]) {
  const [prices, setPrices] = useState<Record<string, number>>(
    () => Object.fromEntries(trades.map((t) => [t.id, t.current])),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) => {
        const next: Record<string, number> = { ...prev };
        for (const t of trades) {
          const cur = prev[t.id] ?? t.current;
          const range = Math.abs(t.tp - t.sl);
          const drift = (Math.random() - 0.5) * range * 0.012;
          const lo = Math.min(t.sl, t.tp);
          const hi = Math.max(t.sl, t.tp);
          next[t.id] = Math.max(lo, Math.min(hi, cur + drift));
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, [trades]);
  return prices;
}

function TradesPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const prices = useLiveTicker(OPEN_TRADES);

  const enriched = useMemo(
    () => OPEN_TRADES.map((t) => {
      const current = prices[t.id] ?? t.current;
      const dir = t.side === "LONG" ? 1 : -1;
      const pnl = ((current - t.entry) / t.entry) * 1000 * dir;
      const denom = Math.abs(t.entry - t.sl) || 1;
      const r = ((current - t.entry) * dir) / denom;
      return { ...t, current, pnl, r };
    }),
    [prices],
  );

  const filtered = enriched.filter((t) => {
    if (filter === "long") return t.side === "LONG";
    if (filter === "short") return t.side === "SHORT";
    if (filter === "win") return t.pnl >= 0;
    if (filter === "loss") return t.pnl < 0;
    return true;
  });

  const totalPnl = enriched.reduce((s, t) => s + t.pnl, 0);
  const totalR = enriched.reduce((s, t) => s + t.r, 0);
  const longs = enriched.filter((t) => t.side === "LONG").length;
  const shorts = enriched.length - longs;
  const winning = enriched.filter((t) => t.pnl >= 0).length;

  return (
    <div className="relative mx-auto max-w-7xl space-y-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <PageHeader
        title="Live Trades"
        subtitle="Offene Positionen, Live-Ticker und Trade Journey durch alle Module."
        status="WARN"
        role="Admin"
      />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Open Positions" value={enriched.length} tone="info" icon={<BriefIcon className="h-4 w-4" />} />
        <KpiCard label="Floating PnL" value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`} tone={totalPnl >= 0 ? "success" : "danger"} icon={totalPnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Total R" value={`${totalR >= 0 ? "+" : ""}${totalR.toFixed(2)}R`} tone={totalR >= 0 ? "success" : "warning"} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Long / Short" value={`${longs} / ${shorts}`} tone="muted" />
        <KpiCard label="Winning" value={`${winning}/${enriched.length}`} tone={winning >= enriched.length / 2 ? "success" : "warning"} icon={<Percent className="h-4 w-4" />} />
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filter
        </span>
        {(["all", "long", "short", "win", "loss"] as FilterKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === k
                ? "border-primary/40 bg-primary/15 text-primary shadow-[var(--shadow-glow-primary)]"
                : "border-[var(--glass-border)] bg-[oklch(0.20_0.04_265_/_60%)] text-muted-foreground hover:text-foreground",
            )}
          >
            {k === "all" ? "Alle" : k === "long" ? "LONG" : k === "short" ? "SHORT" : k === "win" ? "Im Plus" : "Im Minus"}
          </button>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 anim-ping-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Live-Ticker · Mock · 1.5s
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((t) => <TradeCard key={t.id} t={t} />)}
        {filtered.length === 0 && (
          <GlassCard className="text-center text-sm text-muted-foreground xl:col-span-2">
            Keine Trades passen zum Filter.
          </GlassCard>
        )}
      </div>

      <ClosedTradesTable />

      <p className="text-center text-xs text-muted-foreground">Shadow-Module erklären nur und greifen nicht live ein. Alle Preise sind simuliert.</p>
    </div>
  );
}

function ClosedTradesTable() {
  const wins = CLOSED_TRADES.filter((t) => t.pnl >= 0).length;
  const totalPnl = CLOSED_TRADES.reduce((s, t) => s + t.pnl, 0);
  return (
    <GlassCard className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Closed Trades · Heute</h3>
          <p className="text-xs text-muted-foreground">{CLOSED_TRADES.length} Trades · Winrate {Math.round((wins / CLOSED_TRADES.length) * 100)}%</p>
        </div>
        <StatusBadge tone={totalPnl >= 0 ? "success" : "danger"} dot>
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} Realized
        </StatusBadge>
      </div>
      <div className="-mx-4 overflow-x-auto sm:mx-0">
        <table className="w-full min-w-[640px] text-xs">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-[var(--glass-border)]">
              <th className="px-3 py-2 text-left font-medium">Zeit</th>
              <th className="px-3 py-2 text-left font-medium">Symbol</th>
              <th className="px-3 py-2 text-left font-medium">Side</th>
              <th className="px-3 py-2 text-right font-medium">Entry → Exit</th>
              <th className="px-3 py-2 text-right font-medium">PnL</th>
              <th className="px-3 py-2 text-right font-medium">R</th>
              <th className="px-3 py-2 text-left font-medium">Reason</th>
              <th className="px-3 py-2 text-left font-medium">Bucket</th>
              <th className="px-3 py-2 text-center font-medium">Grade</th>
            </tr>
          </thead>
          <tbody>
            {CLOSED_TRADES.map((t) => {
              const win = t.pnl >= 0;
              return (
                <tr key={t.id} className="border-b border-[var(--glass-border)]/50 last:border-0 hover:bg-[oklch(0.25_0.04_265_/_40%)]">
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{t.closedAt}</td>
                  <td className="px-3 py-2 font-medium">{t.symbol}</td>
                  <td className="px-3 py-2">
                    <StatusBadge tone={t.side === "LONG" ? "success" : "danger"}>{t.side}</StatusBadge>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {t.entry} → <span className="text-foreground">{t.exit}</span>
                  </td>
                  <td className={cn("px-3 py-2 text-right font-semibold tabular-nums", win ? "text-success" : "text-destructive")}>
                    {win ? "+" : ""}${t.pnl.toFixed(2)}
                  </td>
                  <td className={cn("px-3 py-2 text-right tabular-nums", win ? "text-success" : "text-destructive")}>
                    {win ? "+" : ""}{t.r.toFixed(2)}R
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge tone={t.reason === "TP" ? "success" : t.reason === "SL" ? "danger" : "warning"}>{t.reason}</StatusBadge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{t.bucket}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn(
                      "inline-flex h-6 w-8 items-center justify-center rounded-md border text-[10px] font-bold",
                      t.grade.startsWith("A") && "border-success/40 bg-success/15 text-success",
                      t.grade.startsWith("B") && "border-info/40 bg-info/15 text-info",
                      t.grade.startsWith("C") && "border-warning/40 bg-warning/15 text-warning",
                      t.grade.startsWith("D") && "border-destructive/40 bg-destructive/15 text-destructive",
                    )}>
                      {t.grade}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
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
